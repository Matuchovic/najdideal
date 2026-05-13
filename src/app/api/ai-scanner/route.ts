import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

async function generateFlipDeals(): Promise<any[]> {
  const today = new Date().toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' })
  const prompt = `Jsi AI expert na flip dealy v České republice. Dnešní datum je ${today}.
Vygeneruj 6 realistických flip příležitostí. Vrať POUZE validní JSON array:
[{"title":"název max 80 znaků","category":"marketplace_flip","buy_price":číslo,"sell_price":číslo,"profit_amount":číslo,"profit_percent":číslo,"ai_confidence":číslo70-95,"short_desc":"max 60 znaků","description":"2-3 věty proč je to flip příležitost","emoji":"emoji","source_url":"https://bazos.cz","source_name":"Bazoš.cz","tags":["flip","ai"]}]
Kategorie: 2x marketplace_flip (elektronika), 2x marketplace_flip (auta, použij category marketplace_flip), 2x marketplace_flip (nemovitosti).
Realistické české ceny 2026. Vrať POUZE JSON.`

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 2000, messages: [{ role: 'user', content: prompt }] })
  })
  const data = await response.json()
  const text = data.content?.find((b: any) => b.type === 'text')?.text ?? '[]'
  try {
    const clean = text.replace(/```json|```/g, '').trim()
    const match = clean.match(/\[[\s\S]*\]/)
    if (match) return JSON.parse(match[0])
    return JSON.parse(clean)
  } catch(e) {
    console.error('Parse error:', text.slice(0, 300))
    return []
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    if (searchParams.get('secret') !== 'najdideal-scanner-2026') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const supabase = createClient()
    const deals = await generateFlipDeals()
    if (deals.length === 0) {
      return NextResponse.json({ error: 'AI nevygeneroval žádné dealy', scanned: 0, found: 0, inserted: 0 })
    }
    const inserted = []
    for (const deal of deals) {
      const aiTitle = `🤖 ${deal.title?.slice(0, 80)}`
      const slug = aiTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 90) + '-' + Date.now()
      const { data: existing } = await supabase.from('deals').select('id').eq('title', aiTitle).maybeSingle()
      if (existing) continue
      const { data, error } = await supabase.from('deals').insert({
        title: aiTitle,
        slug,
        description: deal.description ?? '',
        short_desc: deal.short_desc ?? '',
        category: 'marketplace_flip',
        status: 'active',
        access_level: 'vip',
        buy_price: deal.buy_price ?? null,
        sell_price: deal.sell_price ?? null,
        profit_amount: deal.profit_amount ?? null,
        profit_percent: deal.profit_percent ?? null,
        emoji: deal.emoji ?? '💰',
        source_url: deal.source_url ?? 'https://bazos.cz',
        source_name: deal.source_name ?? 'Bazoš.cz',
        tags: deal.tags ?? ['ai', 'flip'],
        is_hot: (deal.ai_confidence ?? 0) >= 85,
        is_featured: (deal.ai_confidence ?? 0) >= 80,
      }).select().single()
      if (!error && data) {
        inserted.push({ id: data.id, title: deal.title, profit: deal.profit_amount, confidence: deal.ai_confidence })
      } else if (error) {
        console.error('Insert error:', error.message)
      }
    }
    return NextResponse.json({ success: true, scanned: 'AI generátor', found: deals.length, inserted: inserted.length, deals: inserted })
  } catch (error: any) {
    console.error('Scanner error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
