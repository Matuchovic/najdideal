export const dynamic = 'force-dynamic'
export const maxDuration = 60

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

const KATEGORIE: Record<string, { rub: string; emoji: string; label: string; htmlPath: string }> = {
  mobily:   { rub: 'mo', emoji: '📱', label: 'Mobily',         htmlPath: 'mobily' },
  pc:       { rub: 'pc', emoji: '💻', label: 'PC & Notebooky', htmlPath: 'pc-notebooky' },
  elektro:  { rub: 'el', emoji: '🔌', label: 'Elektro',        htmlPath: 'elektro' },
  sport:    { rub: 'sp', emoji: '⚽', label: 'Sport',          htmlPath: 'sport' },
  obleceni: { rub: 'ob', emoji: '👕', label: 'Oblečení',       htmlPath: 'obleceni-moda' },
  nabytek:  { rub: 'na', emoji: '🛋️', label: 'Nábytek',       htmlPath: 'nabytek' },
  auto:     { rub: 'au', emoji: '🚗', label: 'Auta',           htmlPath: 'auto-moto' },
  motorky:  { rub: 'mt', emoji: '🏍️', label: 'Motorky',       htmlPath: 'motorky' },
  detske:   { rub: 'de', emoji: '🧸', label: 'Dětské',         htmlPath: 'detske-zbozi' },
  hudba:    { rub: 'hu', emoji: '🎸', label: 'Hudba',          htmlPath: 'hudba' },
  knihy:    { rub: 'kn', emoji: '📚', label: 'Knihy',          htmlPath: 'knihy' },
  ostatni:  { rub: 'os', emoji: '📦', label: 'Ostatní',        htmlPath: 'ostatni' },
}

const BAZOS_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Accept-Language': 'cs-CZ,cs;q=0.9',
  'Referer': 'https://www.bazos.cz/',
}

const HOT_KEYWORDS = ['nový','nové','zánovní','záruka','top','výborný','perfektní','nepoužitý','nerozbalený','orig']

function generateSlug(title: string): string {
  return title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80) + '-' + Date.now().toString(36)
}

function parsePrice(text: string): number | null {
  const match = text.match(/(\d[\d\s]*)\s*(?:Kč|kč|KC|kc)/i)
  if (!match) return null
  return parseInt(match[1].replace(/\s/g, ''), 10)
}

function parseRSS(xml: string) {
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

function parseHTML(html: string) {
  const items: { title: string; link: string; description: string; price: number | null; imageUrl: string | null }[] = []
  const inzeratRegex = /<div[^>]+class="[^"]*inzerat[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/g
  let match
  while ((match = inzeratRegex.exec(html)) !== null) {
    const block = match[1]
    const titleMatch = block.match(/<a[^>]+href="([^"]+)"[^>]*>([^<]+)<\/a>/)
    if (!titleMatch) continue
    const link = titleMatch[1].startsWith('http') ? titleMatch[1] : `https://www.bazos.cz${titleMatch[1]}`
    const title = titleMatch[2].trim()
    const desc = (block.match(/<div[^>]+class="[^"]*popis[^"]*"[^>]*>([\s\S]*?)<\/div>/)?.[1] || '').replace(/<[^>]*>/g, '').trim().slice(0, 400)
    const priceText = block.match(/<div[^>]+class="[^"]*cena[^"]*"[^>]*>([\s\S]*?)<\/div>/)?.[1] || ''
    const price = parsePrice(priceText.replace(/<[^>]*>/g, ''))
    const imgMatch = block.match(/<img[^>]+src="([^"]+)"/)
    const imageUrl = imgMatch ? (imgMatch[1].startsWith('http') ? imgMatch[1] : `https://www.bazos.cz${imgMatch[1]}`) : null
    if (title && link && link.includes('bazos.cz')) items.push({ title, link, description: desc, price, imageUrl })
  }
  return items
}

async function fetchAndUploadImage(ogUrl: string, slug: string, adminSupabase: ReturnType<typeof createAdminClient<any>>): Promise<string | null> {
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

async function insertItem(
  item: { title: string; link: string; description: string; price: number | null; pubDate?: string; imageUrl?: string | null },
  kat: { emoji: string; label: string },
  adminSupabase: ReturnType<typeof createAdminClient<any>>,
  supabase: Awaited<ReturnType<typeof createClient>>
) {
  const { data: existing } = await supabase.from('deals').select('id').eq('source_url', item.link).maybeSingle()
  if (existing) return 'skipped'

  const slug = generateSlug(item.title)
  
  // Pokus o obrazek - nejdrive z HTML parsovani, pak og:image
  let storedImageUrl: string | null = null
  const imageSource = item.imageUrl || await fetchOgImage(item.link)
  if (imageSource) {
    storedImageUrl = await fetchAndUploadImage(imageSource, slug, adminSupabase)
  }

  const titleLower = item.title.toLowerCase()
  const isHot = !!(item.price && item.price > 0 && storedImageUrl && HOT_KEYWORDS.some(k => titleLower.includes(k)))
  const isFeatured = !!(item.price && item.price > 500 && storedImageUrl)

  const { error } = await supabase.from('deals').insert({
    title: item.title.slice(0, 200), slug, description: item.description,
    category: getCategory(katKey), status: 'active' as const, access_level: 'free' as const,
    emoji: kat.emoji, source_url: item.link, image_url: storedImageUrl, source_name: 'Bazoš.cz',
    sell_price: item.price, tags: [kat.label, 'bazoš', 'bazar'],
    is_featured: isFeatured, is_hot: isHot, is_trending: false,
    image_urls: storedImageUrl ? [storedImageUrl] : [],
    created_at: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
  })

  return error ? 'error' : 'inserted'
}


function getCategory(katKey: string): 'marketplace_flip' | 'ai_opportunity' | 'trend_product' | 'profit_alert' | 'affiliate' | 'dropshipping' | 'crypto' | 'other' {
  if (katKey === 'auto' || katKey === 'motorky') return 'trend_product'
  if (katKey === 'obleceni') return 'affiliate'
  if (katKey === 'sport') return 'profit_alert'
  if (katKey === 'nabytek') return 'dropshipping'
  if (katKey === 'detske') return 'crypto'
  if (katKey === 'pc' || katKey === 'elektro' || katKey === 'mobily' || katKey === 'hudba') return 'ai_opportunity'
  return 'marketplace_flip'
}

export async function POST(req: Request) {
  try {
    // Auth - podporuje admin session i x-admin-secret header (pro GitHub Actions)
    const adminSecret = req.headers.get('x-admin-secret')
    const isSecretAuth = adminSecret === process.env.ADMIN_SECRET_KEY

    if (!isSecretAuth) {
      const supabaseCheck = await createClient()
      const { data: { user } } = await supabaseCheck.auth.getUser()
      if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      const { data: profile } = await supabaseCheck.from('profiles').select('role').eq('id', user.id).single()
      if (profile?.role !== 'admin') return NextResponse.json({ error: 'Admin only' }, { status: 403 })
    }

    const adminSupabase = createAdminClient(
      process.env.NEXT_PUBLIC_SB_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    // Pro DB operace pouzij admin klienta primo
    const supabase = adminSupabase as any

    const body = await req.json().catch(() => ({}))
    const katKey = (body.kategorie as string) || 'mobily'
    const kat = KATEGORIE[katKey] ?? KATEGORIE.mobily
    const pages = Math.min(body.pages || 5, 10) // max 10 stranek = ~500 polozek

    let allItems: { title: string; link: string; description: string; price: number | null; pubDate?: string; imageUrl?: string | null }[] = []

    // 1. RSS feed (rychle, spolehlivé)
    try {
      const rssRes = await fetch(`https://www.bazos.cz/rss.php?rub=${kat.rub}`, { headers: BAZOS_HEADERS, signal: AbortSignal.timeout(8000) })
      if (rssRes.ok) {
        const rssItems = parseRSS(await rssRes.text())
        allItems.push(...rssItems)
      }
    } catch { /* RSS selhal, pokracujeme */ }

    // 2. HTML scraping pro dalsi stranky
    for (let page = 1; page <= pages; page++) {
      try {
        const url = page === 1
          ? `https://www.bazos.cz/${kat.htmlPath}/`
          : `https://www.bazos.cz/${kat.htmlPath}/?page=${page}`
        const res = await fetch(url, { headers: BAZOS_HEADERS, signal: AbortSignal.timeout(8000) })
        if (!res.ok) break
        const html = await res.text()
        const htmlItems = parseHTML(html)
        if (htmlItems.length === 0) break
        // Pridej jen nove (deduplikace podle URL)
        const existingUrls = new Set(allItems.map(i => i.link))
        for (const item of htmlItems) {
          if (!existingUrls.has(item.link)) {
            allItems.push(item)
            existingUrls.add(item.link)
          }
        }
        // Rate limiting - neburcuj Bazos
        await new Promise(r => setTimeout(r, 500))
      } catch { break }
    }

    let inserted = 0, skipped = 0, errors = 0, imagesUploaded = 0

    // Zpracuj max 200 polozek per request (timeout ochrana)
    const toProcess = allItems.slice(0, 200)

    for (const item of toProcess) {
      const result = await insertItem(item, kat, adminSupabase, supabase)
      if (result === 'inserted') { inserted++; if (item.imageUrl) imagesUploaded++ }
      else if (result === 'skipped') skipped++
      else errors++
    }

    return NextResponse.json({
      success: true,
      kategorie: kat.label,
      total: allItems.length,
      processed: toProcess.length,
      inserted, skipped, errors, imagesUploaded
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Bazoš Sync API v2',
    kategorie: Object.keys(KATEGORIE),
    usage: 'POST { "kategorie": "mobily", "pages": 5 }'
  })
}
