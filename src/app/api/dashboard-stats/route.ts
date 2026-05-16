export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as adminClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    const admin = adminClient(
      process.env.NEXT_PUBLIC_SB_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { count: totalDeals } = await admin
      .from('deals')
      .select('*', { count: 'exact', head: true })
      .in('status', ['active', 'featured'])

    let savedCount = 0
    let unreadCount = 0

    try {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const [{ count: sc }, { count: uc }] = await Promise.all([
          admin.from('saved_deals').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
          admin.from('notifications').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('is_read', false),
        ])
        savedCount = sc ?? 0
        unreadCount = uc ?? 0
      }
    } catch {}

    return NextResponse.json({ totalDeals: totalDeals ?? 0, savedCount, unreadCount })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
