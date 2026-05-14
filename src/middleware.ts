import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// ══════════════════════════════════════════════════════════
//  NajdiDeal – Ultimátní Security Middleware
//  Rate limiting, route protection, security headers, bot detection
// ══════════════════════════════════════════════════════════

// In-memory rate limiter (resets per edge instance)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    request.headers.get('cf-connecting-ip') ||
    'unknown'
  )
}

function rateLimit(
  ip: string,
  key: string,
  maxRequests: number,
  windowMs: number
): boolean {
  const now = Date.now()
  const mapKey = `${ip}:${key}`
  const entry = rateLimitMap.get(mapKey)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(mapKey, { count: 1, resetAt: now + windowMs })
    return true // allowed
  }

  if (entry.count >= maxRequests) {
    return false // blocked
  }

  entry.count++
  return true // allowed
}

// Clean up old entries periodically
function cleanupRateLimit() {
  const now = Date.now()
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetAt) rateLimitMap.delete(key)
  }
}

// Protected routes that require auth
const PROTECTED_ROUTES = [
  '/dashboard',
  '/deals',
  '/saved',
  '/alerts',
  '/notifications',
  '/profile',
  '/settings',
  '/marketplace/moje',
  '/marketplace/pridat',
  '/marketplace/upravit',
  '/marketplace/zpravy',
  '/marketplace/boost',
  '/search',
  '/membership',
]

// Admin only routes
const ADMIN_ROUTES = ['/admin']

// Rate limit configs per route type
const RATE_LIMITS = {
  auth:    { max: 10,  windowMs: 60_000  }, // 10 login attempts/min
  api:     { max: 60,  windowMs: 60_000  }, // 60 API calls/min
  scanner: { max: 3,   windowMs: 300_000 }, // 3 scans per 5 min
  default: { max: 200, windowMs: 60_000  }, // 200 requests/min general
}

// Known bad bots / scanners user agents
const BAD_BOT_PATTERNS = [
  /sqlmap/i, /nikto/i, /nmap/i, /masscan/i, /zgrab/i,
  /python-requests\/2\.[0-4]/i, /go-http-client\/1\.1/i,
  /curl\/7\.[0-5]/i, /libwww-perl/i, /java\/1\.[0-7]/i,
  /scrapy/i, /wget/i, /burpsuite/i, /dirbuster/i,
]

function isBadBot(userAgent: string): boolean {
  return BAD_BOT_PATTERNS.some(pattern => pattern.test(userAgent))
}

// Security headers
function addSecurityHeaders(response: NextResponse): NextResponse {
  const headers = response.headers

  // Content Security Policy
  headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: blob: https://*.supabase.co https://images.unsplash.com",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.anthropic.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests",
    ].join('; ')
  )

  // Security headers
  headers.set('X-Frame-Options', 'DENY')
  headers.set('X-Content-Type-Options', 'nosniff')
  headers.set('X-XSS-Protection', '1; mode=block')
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()')
  headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
  headers.set('X-DNS-Prefetch-Control', 'off')
  headers.set('X-Download-Options', 'noopen')
  headers.set('X-Permitted-Cross-Domain-Policies', 'none')

  // Remove fingerprinting headers
  headers.delete('X-Powered-By')
  headers.delete('Server')

  return response
}

function rateLimitResponse(retryAfter: number = 60): NextResponse {
  const response = new NextResponse(
    JSON.stringify({
      error: 'Příliš mnoho požadavků. Zkuste to za chvíli.',
      retryAfter,
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': String(retryAfter),
        'X-RateLimit-Limit': '10',
        'X-RateLimit-Remaining': '0',
      },
    }
  )
  return addSecurityHeaders(response)
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const ip = getClientIp(request)
  const userAgent = request.headers.get('user-agent') || ''

  // 1. Bad bot detection
  if (isBadBot(userAgent)) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  // 2. Block suspicious paths (common attack vectors)
  const suspiciousPaths = [
    '/wp-admin', '/wp-login', '/.env', '/phpinfo',
    '/admin.php', '/shell.php', '/.git', '/config.php',
    '/xmlrpc.php', '/eval-stdin.php', '/vendor/',
  ]
  if (suspiciousPaths.some(p => pathname.includes(p))) {
    return new NextResponse('Not Found', { status: 404 })
  }

  // 3. Rate limiting per route type
  cleanupRateLimit()

  if (pathname.startsWith('/api/ai-scanner')) {
    const allowed = rateLimit(ip, 'scanner', RATE_LIMITS.scanner.max, RATE_LIMITS.scanner.windowMs)
    if (!allowed) return rateLimitResponse(300)
  } else if (pathname.startsWith('/api/')) {
    const allowed = rateLimit(ip, 'api', RATE_LIMITS.api.max, RATE_LIMITS.api.windowMs)
    if (!allowed) return rateLimitResponse(60)
  } else if (pathname === '/login' || pathname === '/register' || pathname === '/reset-password') {
    const allowed = rateLimit(ip, 'auth', RATE_LIMITS.auth.max, RATE_LIMITS.auth.windowMs)
    if (!allowed) return rateLimitResponse(60)
  } else {
    const allowed = rateLimit(ip, 'default', RATE_LIMITS.default.max, RATE_LIMITS.default.windowMs)
    if (!allowed) return rateLimitResponse(60)
  }

  // 4. Supabase auth session
  let response = NextResponse.next({ request: { headers: request.headers } })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SB_URL!,
    process.env.NEXT_PUBLIC_SB_ANON!,
    {
      cookies: {
        get(name) { return request.cookies.get(name)?.value },
        set(name, value, options) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value, ...options })
        },
        remove(name, options) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // 5. Route protection — redirect to login if not authenticated
  const isProtected = PROTECTED_ROUTES.some(route => pathname.startsWith(route))
  const isAdmin = ADMIN_ROUTES.some(route => pathname.startsWith(route))

  if (isProtected && !user) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // 6. Admin route protection - jen auth check, roli řeší admin/layout.tsx
  if (isAdmin) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // 7. Redirect logged-in users away from auth pages
  if (user && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // 8. Add security headers to all responses
  return addSecurityHeaders(response)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icon.svg|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml)$).*)',
  ],
}
