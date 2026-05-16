export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SB_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { data } = await supabase
    .from('deals')
    .select('title, slug, emoji, image_url, sell_price, is_hot, category')
    .eq('status', 'active')
    .eq('source_name', 'Bazoš.cz')
    .order('created_at', { ascending: false })
    .not('image_url', 'is', null).limit(6)

  return NextResponse.json({ deals: data ?? [] })
}
