export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const uid = searchParams.get('uid')

    const admin = createClient(
      process.env.NEXT_PUBLIC_SB_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { count: totalDeals } = await admin
      .from('deals')
      .select('*', { count: 'exact', head: true })
      .in('status', ['active', 'featured'])

    let savedCount = 0
    let unreadCount = 0

    if (uid) {
      const [{ count: sc }, { count: uc }] = await Promise.all([
        admin.from('saved_deals').select('*', { count: 'exact', head: true }).eq('user_id', uid),
        admin.from('notifications').select('*', { count: 'exact', head: true }).eq('user_id', uid).eq('is_read', false),
      ])
      savedCount = sc ?? 0
      unreadCount = uc ?? 0
    }

    return NextResponse.json({ totalDeals: totalDeals ?? 0, savedCount, unreadCount })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
