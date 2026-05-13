import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// ══════════════════════════════════════════════════════════
//  NajdiDeal – AI Deal Generator v3
//  100% funkční - čistý AI generátor bez scrapingu
//  Generuje realistické české flip příležitosti
// ══════════════════════════════════════════════════════════

async function generateDeals(): Promise<any[]> {
  const today = new Date().toLocaleDateString('cs-CZ', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })
  const hour = new Date().getHours()
  const timeOfDay = hour < 12 ? 'dopoledne' : hour < 18 ? 'odpoledne' : 'večer'

  const prompt = `Jsi seniorní flip expert pro český trh. Dnes je ${today}, ${timeOfDay}.

Vygeneruj 8 RŮZNORODÝCH flip příležitostí které jsou PRÁVĚ TEĎ na českém trhu.
Každý deal musí být z jiné kategorie a mít realistické ceny roku 2026.

POŽADOVANÉ KATEGORIE (každá 1x):
1. Smartphone (iPhone nebo Samsung vlajková loď)
2. Notebook nebo MacBook
3. Herní konzole nebo GPU
4. Ojeté auto (Škoda, VW, BMW, Audi)
5. Nemovitost (byt nebo chata)
6. Luxusní hodinky nebo kabelka
7. Elektrokolo nebo skútr
8. Audio technika nebo chytrý domov

Vrať POUZE tento JSON (bez markdown, bez komentářů):
[
  {
    "title": "Konkrétní název produktu + rok/model, max 70 znaků",
    "short_desc": "Proč koupit a prodat, max 55 znaků",
    "description": "2-3 věty: proč je to flip příležitost, kde prodat, za kolik",
    "category": "marketplace_flip",
    "emoji": "emoji produktu",
    "buy_price": číslo_bez_mezer,
    "sell_price": číslo_bez_mezer,
    "profit_amount": číslo_bez_mezer,
    "profit_percent": číslo,
    "ai_score": číslo_mezi_75_a_96,
    "is_hot": true nebo false,
    "tags": ["tag1", "tag2"]
  }
]

REALISTICKÉ CENY 2026 (kupní / prodejní):
- iPhone 15 Pro 256GB: 18000 / 26000 Kč
- MacBook Air M2: 22000 / 32000 Kč  
- PS5 Slim: 9500 / 14000 Kč
- Škoda Octavia 2019: 280000 / 340000 Kč
- BMW 3 Series 2020: 580000 / 720000 Kč
- Byt 2+kk Praha (rekonstrukce): 3800000 / 5200000 Kč
- Rolex Submariner (použité): 180000 / 240000 Kč
- E-kolo Specialized: 28000 / 42000 Kč

is_hot = true pokud profit_percent > 25%
Vrať přesně 8 dealů. POUZE JSON array.`

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY ?? '', 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-5',
      max_tokens: 3000,
      messages: [{ role: 'user', content: prompt }]
    })
  })

  if (!res.ok) { const errBody = await res.text(); throw new Error(`Anthropic API error: ${res.status} - ${errBody}`) }

  const data = await res.json()
  const text = data.content?.find((b: any) => b.type === 'text')?.text ?? '[]'

  try {
    const clean = text.replace(/```json|```/g, '').trim()
    const match = clean.match(/\[[\s\S]*\]/)
    if (match) return JSON.parse(match[0])
    return JSON.parse(clean)
  } catch (e) {
    console.error('Parse error:', text.slice(0, 400))
    throw new Error('AI vrátil neplatný JSON')
  }
}

export async function GET(request: Request) {
  try {
    // Auth check
    const { searchParams } = new URL(request.url)
    if (searchParams.get('secret') !== 'najdideal-scanner-2026') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createClient()

    // Generuj dealy
    console.log('🤖 Generuji AI flip dealy...')
    const deals = await generateDeals()
    console.log(`✅ AI vygeneroval ${deals.length} dealů`)

    if (!deals.length) {
      return NextResponse.json({
        error: 'AI nevygeneroval žádné dealy',
        scanned: 0, found: 0, inserted: 0
      })
    }

    // Ulož do Supabase
    const inserted = []
    const errors = []

    for (const deal of deals) {
      try {
        // Validace
        if (!deal.title || !deal.buy_price || !deal.sell_price) continue

        const aiTitle = `🤖 ${String(deal.title).slice(0, 85)}`

        // Unikátní slug
        const baseSlug = aiTitle
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .slice(0, 80)
        const slug = `${baseSlug}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`

        // Zkontroluj duplicitu podle názvu (poslední 24h)
        const yesterday = new Date(Date.now() - 86400000).toISOString()
        const { data: existing } = await supabase
          .from('deals')
          .select('id')
          .eq('title', aiTitle)
          .gte('created_at', yesterday)
          .maybeSingle()

        if (existing) {
          console.log(`⏭ Přeskakuji duplicitu: ${aiTitle.slice(0, 40)}`)
          continue
        }

        const profitAmount = Number(deal.profit_amount) || (Number(deal.sell_price) - Number(deal.buy_price))
        const profitPercent = Number(deal.profit_percent) || Math.round((profitAmount / Number(deal.buy_price)) * 100)
        const aiScore = Number(deal.ai_score) || 80

        const { data, error } = await supabase.from('deals').insert({
          title: aiTitle,
          slug,
          description: String(deal.description || '').slice(0, 500),
          short_desc: String(deal.short_desc || '').slice(0, 60),
          category: 'marketplace_flip',
          status: 'active',
          access_level: aiScore >= 88 ? 'vip' : 'free',
          buy_price: Number(deal.buy_price),
          sell_price: Number(deal.sell_price),
          profit_amount: profitAmount,
          profit_percent: profitPercent,
          emoji: String(deal.emoji || '💰'),
          source_url: 'https://bazos.cz',
          source_name: 'AI NajdiDeal Scanner',
          tags: Array.isArray(deal.tags) ? deal.tags : ['ai', 'flip'],
          is_hot: Boolean(deal.is_hot) || profitPercent > 25,
          is_featured: aiScore >= 85,
          is_trending: aiScore >= 90,
          trend_percent: profitPercent,
        }).select().single()

        if (error) {
          console.error('Insert error:', error.message)
          errors.push({ title: deal.title, error: error.message })
        } else if (data) {
          inserted.push({
            id: data.id,
            title: deal.title,
            profit: profitAmount,
            profit_percent: profitPercent,
            ai_score: aiScore,
          })
          console.log(`✓ Přidáno: ${deal.title.slice(0, 40)} | profit: ${profitAmount} Kč`)
        }
      } catch (dealError: any) {
        console.error('Deal processing error:', dealError.message)
        errors.push({ title: deal.title, error: dealError.message })
      }
    }

    return NextResponse.json({
      success: true,
      scanned: deals.length,
      found: deals.length,
      inserted: inserted.length,
      deals: inserted,
      errors: errors.length > 0 ? errors : undefined,
      timestamp: new Date().toISOString(),
    })

  } catch (error: any) {
    console.error('Scanner fatal error:', error)
    return NextResponse.json({
      error: error.message,
      scanned: 0, found: 0, inserted: 0
    }, { status: 500 })
  }
}
