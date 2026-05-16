export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as adminClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const admin = adminClient(
      process.env.NEXT_PUBLIC_SB_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const [{ count: totalDeals }, { count: savedCount }, { count: unreadCount }] = await Promise.all([
      admin.from('deals').select('*', { count: 'exact', head: true }).in('status', ['active', 'featured']),
      admin.from('saved_deals').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
      admin.from('notifications').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('is_read', false),
    ])

    return NextResponse.json({
      totalDeals: totalDeals ?? 0,
      savedCount: savedCount ?? 0,
      unreadCount: unreadCount ?? 0,
    })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
