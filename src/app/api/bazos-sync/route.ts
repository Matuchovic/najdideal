export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

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

const BAZOS_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Accept-Language': 'cs-CZ,cs;q=0.9',
  'Referer': 'https://www.bazos.cz/',
}

async function fetchAndUploadImage(ogUrl: string, slug: string, adminSupabase: ReturnType<typeof createAdminClient>): Promise<string | null> {
  try {
    const imgRes = await fetch(ogUrl, {
      headers: { ...BAZOS_HEADERS, 'Accept': 'image/webp,image/avif,image/*,*/*;q=0.8' },
      signal: AbortSignal.timeout(6000)
    })
    if (!imgRes.ok) return null
    const contentType = imgRes.headers.get('content-type') || 'image/jpeg'
    if (!contentType.startsWith('image/')) return null
    const buffer = await imgRes.arrayBuffer()
    if (buffer.byteLength < 1000) return null
    const ext = contentType.includes('png') ? 'png' : contentType.includes('webp') ? 'webp' : 'jpg'
    const filename = `bazos/${slug}.${ext}`
    const { error } = await adminSupabase.storage.from('deal-images').upload(filename, buffer, { contentType, upsert: true })
    if (error) return null
    const { data } = adminSupabase.storage.from('deal-images').getPublicUrl(filename)
    return data.publicUrl
  } catch { return null }
}

async function fetchOgImage(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { headers: BAZOS_HEADERS, signal: AbortSignal.timeout(5000) })
    if (!res.ok) return null
    const html = await res.text()
    const match = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
      || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i)
    return match?.[1] ?? null
  } catch { return null }
}

function generateSlug(title: string): string {
  return title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80) + '-' + Date.now().toString(36)
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

    const adminSupabase = createAdminClient(process.env.NEXT_PUBLIC_SB_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    const body = await req.json().catch(() => ({}))
    const katKey = (body.kategorie as string) || 'mobily'
    const kat = KATEGORIE[katKey] ?? KATEGORIE.mobily

    const rssUrl = `https://www.bazos.cz/rss.php?rub=${kat.rub}`
    const res = await fetch(rssUrl, { headers: BAZOS_HEADERS })
    if (!res.ok) throw new Error(`RSS fetch failed: ${res.status}`)

    const xml = await res.text()
    const items = parseRSS(xml, kat.label, kat.emoji)

    let inserted = 0, skipped = 0, imagesUploaded = 0

    for (const item of items) {
      const { data: existing } = await supabase.from('deals').select('id').eq('source_url', item.link).single()
      if (existing) { skipped++; continue }
      const slug = generateSlug(item.title)
      const ogImageUrl = await fetchOgImage(item.link)
      let storedImageUrl: string | null = null
      if (ogImageUrl) {
        storedImageUrl = await fetchAndUploadImage(ogImageUrl, slug, adminSupabase)
        if (storedImageUrl) imagesUploaded++
      }
      const { error } = await supabase.from('deals').insert({
        title: item.title.slice(0, 200), slug, description: item.description,
        category: 'marketplace_flip' as const, status: 'active' as const, access_level: 'free' as const,
        emoji: kat.emoji, source_url: item.link, image_url: storedImageUrl, source_name: 'Bazoš.cz',
        sell_price: item.price, tags: [kat.label, 'bazoš', 'bazar'],
        is_featured: false, is_hot: false, is_trending: false,
        image_urls: storedImageUrl ? [storedImageUrl] : [],
        created_at: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
      })
      if (!error) inserted++
    }

    return NextResponse.json({ success: true, kategorie: kat.label, total: items.length, inserted, skipped, imagesUploaded })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Bazoš RSS Sync API', kategorie: Object.keys(KATEGORIE), usage: 'POST { "kategorie": "mobily" }' })
}
