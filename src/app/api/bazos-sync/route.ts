export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const KATEGORIE: Record<string, { rub: string; emoji: string; label: string }> = {
  mobily:   { rub: 'mo', emoji: '📱', label: 'Mobily' },
  pc:       { rub: 'pc', emoji: '💻', label: 'PC & Notebooky' },
  elektro:  { rub: 'el', emoji: '🔌', label: 'Elektro' },
  sport:    { rub: 'sp', emoji: '⚽', label: 'Sport' },
  obleceni: { rub: 'ob', emoji: '👕', label: 'Oblečení' },
  nabytek:  { rub: 'na', emoji: '🛋️', label: 'Nábytek' },
  auto:     { rub: 'au', emoji: '🚗', label: 'Auta' },
  motorky:  { rub: 'mt', emoji: '🏍️', label: 'Motorky' },
  detske:   { rub: 'de', emoji: '🧸', label: 'Dětské' },
  hudba:    { rub: 'hu', emoji: '🎸', label: 'Hudba' },
  knihy:    { rub: 'kn', emoji: '📚', label: 'Knihy' },
  ostatni:  { rub: 'os', emoji: '📦', label: 'Ostatní' },
}

function parsePrice(text: string): number | null {
  const match = text.match(/(\d[\d\s]*)\s*(?:Kč|kč|KC|kc)/i)
  if (!match) return null
  return parseInt(match[1].replace(/\s/g, ''), 10)
}

function parseRSS(xml: string, label: string, emoji: string) {
  const items: { title: string; link: string; description: string; pubDate: string; price: number | null }[] = []
  const itemRegex = /<item>([\s\S]*?)<\/item>/g
  let match
  while ((match = itemRegex.exec(xml)) !== null) {
    const item = match[1]
    const title = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1] || item.match(/<title>(.*?)<\/title>/)?.[1] || ''
    const link = item.match(/<link>(.*?)<\/link>/)?.[1] || ''
    const description = (item.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/)?.[1] || item.match(/<description>([\s\S]*?)<\/description>/)?.[1] || '').replace(/<[^>]*>/g, '').slice(0, 800)
    const pubDate = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || ''
    const price = parsePrice(title) || parsePrice(description)
    if (title && link) items.push({ title, link, description, pubDate, price })
  }
  return items
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') return NextResponse.json({ error: 'Admin only' }, { status: 403 })

    const body = await req.json().catch(() => ({}))
    const katKey = (body.kategorie as string) || 'mobily'
    const kat = KATEGORIE[katKey] ?? KATEGORIE.mobily

    const rssUrl = `https://www.bazos.cz/rss.php?rub=${kat.rub}`
    const res = await fetch(rssUrl, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; NajdiDeal/1.0)' } })
    if (!res.ok) throw new Error(`RSS fetch failed: ${res.status}`)

    const xml = await res.text()
    const items = parseRSS(xml, kat.label, kat.emoji)

    let inserted = 0
    let skipped = 0

    for (const item of items) {
      const { data: existing } = await supabase.from('deals').select('id').eq('source_url', item.link).single()
      if (existing) { skipped++; continue }

      const { error } = await supabase.from('deals').insert({
        title: item.title.slice(0, 200),
        description: item.description,
        category: 'marketplace_flip' as const,
        status: 'active' as const,
        access_level: 'free' as const,
        emoji: kat.emoji,
        source_url: item.link,
        source_name: 'Bazoš.cz',
        sell_price: item.price,
        tags: [kat.label, 'bazoš', 'bazar'],
        is_featured: false,
        is_hot: false,
        is_trending: false,
        image_urls: [],
        created_at: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
      })
      if (!error) inserted++
    }

    return NextResponse.json({ success: true, kategorie: kat.label, total: items.length, inserted, skipped })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Bazoš RSS Sync API', kategorie: Object.keys(KATEGORIE), usage: 'POST { "kategorie": "mobily" }' })
}
