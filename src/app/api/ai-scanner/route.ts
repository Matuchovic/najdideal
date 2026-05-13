import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// ══════════════════════════════════════════════════════════
//  NajdiDeal – Real Bazoš RSS Scanner + AI Scoring
//  Stahuje skutečné inzeráty z Bazoš.cz RSS feedů
//  AI hodnotí každý inzerát a přidá jen ty s profit potenciálem
// ══════════════════════════════════════════════════════════

const RSS_FEEDS = [
  { url: 'https://www.bazos.cz/rss.php?rub=telefony', category: 'marketplace_flip', emoji: '📱' },
  { url: 'https://www.bazos.cz/rss.php?rub=pc',       category: 'marketplace_flip', emoji: '💻' },
  { url: 'https://www.bazos.cz/rss.php?rub=foto',     category: 'marketplace_flip', emoji: '📷' },
  { url: 'https://www.bazos.cz/rss.php?rub=auto',     category: 'marketplace_flip', emoji: '🚗' },
  { url: 'https://www.bazos.cz/rss.php?rub=moto',     category: 'marketplace_flip', emoji: '🏍️' },
  { url: 'https://www.bazos.cz/rss.php?rub=reality',  category: 'marketplace_flip', emoji: '🏠' },
  { url: 'https://www.bazos.cz/rss.php?rub=obleceni', category: 'marketplace_flip', emoji: '👟' },
  { url: 'https://www.bazos.cz/rss.php?rub=sport',    category: 'marketplace_flip', emoji: '⚽' },
]

type RSSItem = {
  title: string
  link: string
  description: string
  price: number | null
  category: string
  emoji: string
}

async function fetchRSSFeed(feedUrl: string, category: string, emoji: string): Promise<RSSItem[]> {
  try {
    const res = await fetch(feedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; NajdiDeal/1.0)',
        'Accept': 'application/rss+xml, application/xml, text/xml',
      },
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) return []
    const xml = await res.text()

    // Parse RSS items
    const itemMatches = xml.matchAll(/<item>([\s\S]*?)<\/item>/g)
    const items: RSSItem[] = []

    for (const match of itemMatches) {
      const item = match[1]
      const title = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1]
        ?? item.match(/<title>(.*?)<\/title>/)?.[1] ?? ''
      const link = item.match(/<link>(.*?)<\/link>/)?.[1]
        ?? item.match(/<guid>(.*?)<\/guid>/)?.[1] ?? ''
      const desc = item.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/)?.[1]
        ?? item.match(/<description>(.*?)<\/description>/)?.[1] ?? ''

      // Extract price from title or description
      const priceMatch = (title + ' ' + desc).match(/(\d[\d\s]*)\s*(?:Kč|kc|CZK)/i)
      const price = priceMatch
        ? parseInt(priceMatch[1].replace(/\s/g, ''), 10)
        : null

      if (title && link) {
        items.push({ title: title.trim(), link, description: desc.trim(), price, category, emoji })
      }
    }

    return items.slice(0, 8) // max 8 per feed
  } catch (e) {
    console.error(`RSS fetch error for ${feedUrl}:`, e)
    return []
  }
}

async function scoreDealsWithAI(items: RSSItem[]): Promise<any[]> {
  if (items.length === 0) return []

  const itemsText = items.map((it, i) =>
    `${i + 1}. "${it.title}" | Cena: ${it.price ? it.price.toLocaleString('cs-CZ') + ' Kč' : 'neuvedena'} | Popis: ${it.description.slice(0, 120)}`
  ).join('\n')

  const prompt = `Jsi expert na flip příležitosti na českém bazarovém trhu. Analyzuj tyto inzeráty z Bazoš.cz a vyber jen ty s reálným flip potenciálem.

INZERÁTY:
${itemsText}

Pro každý inzerát s flip potenciálem (AI skóre >= 72) vrať JSON objekt.
Přeskoč inzeráty bez ceny nebo bez flip potenciálu.

Vrať POUZE JSON array (může být prázdný []):
[
  {
    "index": číslo (1-based index inzerátu),
    "ai_score": číslo 72-97,
    "buy_price": odhadovaná kupní cena nebo uvedená cena,
    "sell_price": odhadovaná prodejní cena na trhu,
    "profit_amount": odhadovaný čistý profit,
    "profit_percent": procento profitu,
    "short_desc": "max 60 znaků - proč je to flip příležitost",
    "ai_reason": "1-2 věty konkrétní důvod proč koupit a prodat"
  }
]

Hodnoť přísně — jen skutečně podhodnocené nebo flip-worthy položky.`

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }]
      })
    })
    const data = await res.json()
    const text = data.content?.find((b: any) => b.type === 'text')?.text ?? '[]'
    const clean = text.replace(/```json|```/g, '').trim()
    const match = clean.match(/\[[\s\S]*\]/)
    return match ? JSON.parse(match[0]) : []
  } catch (e) {
    console.error('AI scoring error:', e)
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

    // 1. Stáhni RSS feedy paralelně
    console.log('📡 Stahování RSS feedů z Bazoš.cz...')
    const feedResults = await Promise.all(
      RSS_FEEDS.map(f => fetchRSSFeed(f.url, f.category, f.emoji))
    )
    const allItems = feedResults.flat()
    console.log(`✅ Staženo ${allItems.length} inzerátů`)

    if (allItems.length === 0) {
      return NextResponse.json({
        error: 'Nepodařilo se stáhnout RSS feedy z Bazoš.cz',
        scanned: 0, found: 0, inserted: 0
      })
    }

    // 2. AI scoring — posíláme po dávkách max 20 najednou
    console.log('🤖 AI hodnotí inzeráty...')
    const batchSize = 20
    const scored: any[] = []

    for (let i = 0; i < allItems.length; i += batchSize) {
      const batch = allItems.slice(i, i + batchSize)
      const batchScored = await scoreDealsWithAI(batch)
      // Přidej referenci na původní item
      for (const s of batchScored) {
        const item = batch[s.index - 1]
        if (item) scored.push({ ...s, item })
      }
    }

    console.log(`🎯 AI vybral ${scored.length} flip příležitostí`)

    // 3. Ulož do Supabase deals
    const inserted = []
    for (const s of scored) {
      const { item } = s
      const aiTitle = `🤖 ${item.title.slice(0, 85)}`
      const slug = aiTitle.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-').slice(0, 90) + '-' + Date.now()

      // Zkontroluj duplicitu podle source_url
      const { data: existing } = await supabase
        .from('deals')
        .select('id')
        .eq('source_url', item.link)
        .maybeSingle()

      if (existing) continue

      const { data, error } = await supabase.from('deals').insert({
        title: aiTitle,
        slug,
        description: `💡 ${s.ai_reason}\n\n📍 Zdroj: Bazoš.cz\n🔗 ${item.link}\n\n${item.description.slice(0, 300)}`,
        short_desc: s.short_desc,
        category: 'marketplace_flip',
        status: 'active',
        access_level: s.ai_score >= 85 ? 'vip' : 'free',
        buy_price: s.buy_price ?? item.price ?? null,
        sell_price: s.sell_price ?? null,
        profit_amount: s.profit_amount ?? null,
        profit_percent: s.profit_percent ?? null,
        emoji: item.emoji,
        source_url: item.link,
        source_name: 'Bazoš.cz',
        tags: ['bazos', 'flip', 'ai-scored'],
        is_hot: s.ai_score >= 88,
        is_featured: s.ai_score >= 82,
      }).select().single()

      if (!error && data) {
        inserted.push({
          id: data.id,
          title: item.title,
          profit: s.profit_amount,
          ai_score: s.ai_score,
          link: item.link,
        })
      } else if (error) {
        console.error('Insert error:', error.message)
      }
    }

    return NextResponse.json({
      success: true,
      scanned: allItems.length,
      found: scored.length,
      inserted: inserted.length,
      deals: inserted,
      feeds: RSS_FEEDS.length,
    })

  } catch (error: any) {
    console.error('Scanner error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
