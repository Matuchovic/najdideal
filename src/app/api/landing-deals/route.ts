export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const limit = parseInt(searchParams.get('limit') || '6')

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SB_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Celkový počet dealů s fotkou
  const { count } = await supabase
    .from('deals')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active')
    .eq('source_name', 'Bazoš.cz')
    .not('image_url', 'is', null)

  // Náhodný offset pro rotaci
  const total = count || 0
  const maxOffset = Math.max(0, total - limit)
  const offset = Math.floor(Math.random() * maxOffset)

  const { data } = await supabase
    .from('deals')
    .select('title, slug, emoji, image_url, sell_price, is_hot, category')
    .eq('status', 'active')
    .eq('source_name', 'Bazoš.cz')
    .not('image_url', 'is', null)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  return NextResponse.json({ deals: data ?? [] })
}
