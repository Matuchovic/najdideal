'use client'
import Link from 'next/link'
import NajdiLogo from '@/components/ui/NajdiLogo'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export default function Navbar() {
  const path = usePathname()
  const [open, setOpen] = useState(false)
  const isApp = path.startsWith('/dashboard') || path.startsWith('/admin') || path.startsWith('/deals') || path.startsWith('/alerts') || path.startsWith('/saved') || path.startsWith('/profile') || path.startsWith('/settings') || path.startsWith('/membership')
  if (isApp) return null

  const G = { g: '#F0B429', wht: '#F0EBE1', mut: 'rgba(240,235,225,.38)' }
  const links = [
    { l: 'Domů', href: '/' },
    { l: 'Dealy', href: '/dashboard' },
    { l: 'VIP Členství', href: '/vip' },
    { l: 'FAQ', href: '/faq' },
    { l: 'Kontakt', href: '/kontakt' },
    { l: 'Kariéra', href: '/kariera' },
    { l: 'Pro firmy', href: '/b2b' },
    { l: 'Nápověda', href: '/napoveda' },
  ]

  return (
    <>
      <style>{`
        .nav-desktop-links { display: flex; }
        .nav-hamburger { display: none; }
        @media(max-width:768px) {
          .nav-desktop-links { display: none !important; }
          .nav-hamburger { display: flex !important; }
          .nav-wrap { padding: 0 18px !important; }
        }
      `}</style>

      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 500, height: 64, display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(2,2,8,.75)', backdropFilter: 'blur(40px) saturate(200%)', borderBottom: '1px solid rgba(255,255,255,.05)' }} />
        <div className="nav-wrap" style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '0 48px' }}>

          {/* LOGO */}
          <NajdiLogo href="/" onClick={() => setOpen(false)} size="md" />

          {/* DESKTOP LINKS */}
          <ul className="nav-desktop-links" style={{ gap: 32, listStyle: 'none', margin: 0, padding: 0 }}>
            {links.map(lk => (
              <li key={lk.l}>
                <Link href={lk.href} style={{ fontFamily: 'Syne Mono, monospace', fontSize: 9, letterSpacing: '3px', textTransform: 'uppercase', color: path === lk.href ? G.wht : G.mut, textDecoration: 'none', transition: 'color .2s' }}
                  onMouseEnter={e => { (e.currentTarget as any).style.color = G.wht }}
                  onMouseLeave={e => { (e.currentTarget as any).style.color = path === lk.href ? G.wht : G.mut }}>
                  {lk.l}
                </Link>
              </li>
            ))}
          </ul>

          {/* DESKTOP CTA */}
          <div className="nav-desktop-links" style={{ alignItems: 'center', gap: 10 }}>
            <button onClick={() => window.dispatchEvent(new Event('openChat'))} style={{ position: 'relative', fontFamily: 'Syne Mono, monospace', fontSize: 9, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: G.mut, padding: '10px 16px', borderRadius: 8, textDecoration: 'none', border: '1px solid rgba(255,255,255,.08)', background: 'rgba(255,255,255,.03)', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 7, transition: 'all .2s', cursor: 'pointer' }}
              onMouseEnter={e => { (e.currentTarget as any).style.borderColor = 'rgba(240,180,41,.3)'; (e.currentTarget as any).style.color = G.g }}
              onMouseLeave={e => { (e.currentTarget as any).style.borderColor = 'rgba(255,255,255,.08)'; (e.currentTarget as any).style.color = G.mut }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#00E676', boxShadow: '0 0 8px #00E676', flexShrink: 0, display: 'inline-block' }} />
              💬 Podpora
            </button>
            <Link href="/dashboard" style={{ fontFamily: 'Syne Mono, monospace', fontSize: 9, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', background: `linear-gradient(135deg, ${G.g}, #C8880A)`, color: '#000', padding: '10px 22px', borderRadius: 8, textDecoration: 'none', boxShadow: '0 4px 20px rgba(240,180,41,.3), 0 0 0 1px rgba(240,180,41,.15)', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: 6, transition: 'all .25s' }}
              onMouseEnter={e => { (e.currentTarget as any).style.boxShadow = '0 8px 32px rgba(240,180,41,.5), 0 0 0 1px rgba(240,180,41,.3)'; (e.currentTarget as any).style.transform = 'translateY(-1px)' }}
              onMouseLeave={e => { (e.currentTarget as any).style.boxShadow = '0 4px 20px rgba(240,180,41,.3), 0 0 0 1px rgba(240,180,41,.15)'; (e.currentTarget as any).style.transform = '' }}>
              Přejít do aplikace →
            </Link>
          </div>

          {/* MOBILE RIGHT */}
          <div className="nav-hamburger" style={{ alignItems: 'center', gap: 10 }}>
            <Link href="/dashboard" style={{ fontFamily: 'Syne Mono, monospace', fontSize: 8, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', background: G.g, color: '#000', padding: '8px 12px', borderRadius: 6, textDecoration: 'none', whiteSpace: 'nowrap' }}>
              Do aplikace
            </Link>
            <button onClick={() => setOpen(!open)} style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 8, width: 40, height: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5, cursor: 'pointer', padding: 0, flexShrink: 0 }}>
              <span style={{ display: 'block', width: 18, height: 1.5, background: open ? G.g : G.wht, borderRadius: 2, transition: 'all .3s', transform: open ? 'rotate(45deg) translate(4px, 4px)' : 'none' }} />
              <span style={{ display: 'block', width: 18, height: 1.5, background: open ? G.g : G.wht, borderRadius: 2, transition: 'all .3s', opacity: open ? 0 : 1 }} />
              <span style={{ display: 'block', width: 18, height: 1.5, background: open ? G.g : G.wht, borderRadius: 2, transition: 'all .3s', transform: open ? 'rotate(-45deg) translate(4px, -4px)' : 'none' }} />
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE OVERLAY */}
      <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.6)', backdropFilter: 'blur(8px)', zIndex: 490, opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none', transition: 'opacity .35s' }} />

      {/* MOBILE MENU PANEL */}
      <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 280, background: 'rgba(6,6,14,.97)', backdropFilter: 'blur(40px)', borderLeft: '1px solid rgba(255,255,255,.08)', zIndex: 495, transform: open ? 'translateX(0)' : 'translateX(100%)', transition: 'transform .4s cubic-bezier(.34,1.1,.64,1)', display: 'flex', flexDirection: 'column', padding: '80px 28px 36px' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,rgba(240,180,41,.3),transparent)' }} />

        <NajdiLogo href="/" onClick={() => setOpen(false)} size="sm" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, marginTop: 24 }}>
          {links.map((lk, i) => (
            <Link key={lk.l} href={lk.href} onClick={() => setOpen(false)} style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 28, letterSpacing: 3, color: path === lk.href ? G.g : G.wht, textDecoration: 'none', padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'color .2s' }}
              onMouseEnter={e => { (e.currentTarget as any).style.color = G.g }}
              onMouseLeave={e => { (e.currentTarget as any).style.color = path === lk.href ? G.g : G.wht }}>
              {lk.l}
              <span style={{ fontSize: 14, color: 'rgba(240,180,41,.3)' }}>→</span>
            </Link>
          ))}
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,.06)', paddingTop: 24 }}>
          <Link href="/vip" onClick={() => setOpen(false)} style={{ display: 'block', background: G.g, color: '#000', fontFamily: 'Syne Mono, monospace', fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', padding: '15px', borderRadius: 10, textDecoration: 'none', textAlign: 'center', boxShadow: '0 8px 32px rgba(240,180,41,.3)', marginBottom: 12 }}>
            👑 Vstoupit do VIP
          </Link>
          <p style={{ fontFamily: 'Syne Mono, monospace', fontSize: 8, color: G.mut, letterSpacing: 1, textAlign: 'center', textTransform: 'uppercase' }}>info@najdideal.cz</p>
        </div>
      </div>
    </>
  )
}