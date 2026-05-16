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

    const promises: Promise<any>[] = [
      admin.from('deals').select('*', { count: 'exact', head: true }).in('status', ['active', 'featured']),
    ]

    if (uid) {
      promises.push(
        admin.from('saved_deals').select('*', { count: 'exact', head: true }).eq('user_id', uid),
        admin.from('notifications').select('*', { count: 'exact', head: true }).eq('user_id', uid).eq('is_read', false),
      )
    }

    const [dealsRes, savedRes, notifRes] = await Promise.all(promises)

    return NextResponse.json({
      totalDeals: dealsRes.count ?? 0,
      savedCount: savedRes?.count ?? 0,
      unreadCount: notifRes?.count ?? 0,
    })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
