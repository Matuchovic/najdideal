import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

async function generateFlipDeals(): Promise<any[]> {
  const today = new Date().toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' })
  
  const prompt = `Jsi AI expert na flip dealy v České republice. Dnešní datum je ${today}.

Vygeneruj 6 realistických flip příležitostí které by se mohly aktuálně vyskytovat na Bazoš.cz.
Musí to být realistické ceny odpovídající českému trhu v roce 2026.

Kategorie:
- 2x nemovitosti (byty, domy, chaty pod tržní cenou)
- 2x auta (ojeté vozy s flip potenciálem)
- 1x elektronika
- 1x motorky nebo jiné

Pro každý deal vrať JSON:
[
  {
    "title": "realistický název inzerátu jako na Bazoš.cz",
    "original_link": "https://www.bazos.cz/inzerat/priklad",
    "category": "nemovitosti|auta|elektronika|ostatni",
    "estimated_buy_price": číslo,
    "estimated_sell_price": číslo,
    "estimated_profit": číslo,
    "profit_percent": číslo,
    "ai_confidence": číslo 70-95,
    "ai_reason": "konkrétní důvod proč je to flip příležitost v češtině, max 2 věty",
    "emoji": "emoji kategorie",
    "location": "české město"
  }
]

Příklady realistických cen 2026:
- Byt 2+1 Praha tržní cena ~5 000 000 Kč, flip koupě ~3 800 000 Kč
- Škoda Octavia 2018 tržní cena ~280 000 Kč, flip koupě ~210 000 Kč
- iPhone 15 Pro tržní cena ~28 000 Kč, flip koupě ~18 000 Kč
- Chata Středočeský kraj tržní cena ~1 200 000 Kč, flip koupě ~750 000 Kč

Vrať POUZE validní JSON array.`

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }]
    })
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
      const aiTitle = `🤖 AI FLIP: ${deal.title?.slice(0, 90)}`
      
      const { data: existing } = await supabase
        .from('listings')
        .select('id')
        .eq('title', aiTitle)
        .maybeSingle()
      
      if (existing) continue

      const profitText = deal.estimated_profit 
        ? `+${deal.estimated_profit.toLocaleString('cs-CZ')} Kč`
        : 'Viz inzerát'

      const { data, error } = await supabase.from('listings').insert({
        user_id: null,
        title: aiTitle,
        description: `💡 ${deal.ai_reason}

📊 Odhadovaný nákup: ${deal.estimated_buy_price?.toLocaleString('cs-CZ')} Kč
💰 Odhadovaný prodej: ${deal.estimated_sell_price?.toLocaleString('cs-CZ')} Kč  
📈 Potenciální profit: ${profitText} (${deal.profit_percent}%)
🎯 AI Confidence: ${deal.ai_confidence}%

🔗 Hledat podobné: ${deal.original_link}

⚠️ Nalezeno AI skenerem NajdiDeal. Vždy ověřte inzerát před koupí.`,
        price: deal.estimated_buy_price ?? null,
        category: deal.category ?? 'ostatni',
        location: deal.location ?? 'Česká republika',
        status: 'active',
        is_featured: (deal.ai_confidence ?? 0) >= 80,
        is_boosted: (deal.ai_confidence ?? 0) >= 90,
        access_level: 'vip',
      }).select().single()

      if (!error && data) {
        inserted.push({ id: data.id, title: deal.title, profit: deal.estimated_profit, confidence: deal.ai_confidence })
      } else if (error) {
        console.error('Insert error:', error.message)
      }
    }

    return NextResponse.json({
      success: true,
      scanned: 'AI generátor (Bazoš.cz styl)',
      found: deals.length,
      inserted: inserted.length,
      deals: inserted,
    })

  } catch (error: any) {
    console.error('Scanner error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}