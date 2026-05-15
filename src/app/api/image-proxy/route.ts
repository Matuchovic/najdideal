import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const url = searchParams.get('url')
  
  if (!url) return new NextResponse('Missing url', { status: 400 })
  
  // Pouze Bazoš domény povoleny
  if (!url.includes('bazos.cz') && !url.includes('bazo.sk')) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://www.bazos.cz/',
        'Accept': 'image/webp,image/avif,image/*,*/*;q=0.8',
      },
      signal: AbortSignal.timeout(5000)
    })
    
    if (!res.ok) return new NextResponse('Not found', { status: 404 })
    
    const contentType = res.headers.get('content-type') || 'image/jpeg'
    const buffer = await res.arrayBuffer()
    
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400',
        'Access-Control-Allow-Origin': '*',
      }
    })
  } catch {
    return new NextResponse('Error', { status: 500 })
  }
}
