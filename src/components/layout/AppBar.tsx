'use client'

import Link from 'next/link'
import { BackButton } from '@/components/ui/BackButton'
import { LogoutButton } from '@/components/ui/LogoutButton'

interface AppBarProps {
  isAdmin?: boolean
}

export function AppBar({ isAdmin = false }: AppBarProps) {
  return (
    <>
      <style>{`
        .appbar{position:sticky;top:0;left:0;right:0;z-index:200;height:56px;display:flex;align-items:center;justify-content:space-between;padding:0 16px;background:rgba(2,2,8,.92);backdrop-filter:blur(32px) saturate(180%);border-bottom:1px solid rgba(255,255,255,.06)}
        .appbar-logo{position:absolute;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:8px;text-decoration:none;flex-shrink:0}
        .appbar-logo-icon{width:28px;height:28px;border-radius:7px;background:linear-gradient(145deg,#FFD45E 0%,#F0B429 50%,#C8880A 100%);display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 0 14px rgba(240,180,41,.45);position:relative;overflow:hidden}
        .appbar-logo-icon::after{content:'';position:absolute;top:0;left:0;right:0;height:50%;background:linear-gradient(180deg,rgba(255,255,255,.32) 0%,transparent 100%);border-radius:7px 7px 0 0;pointer-events:none}
        .appbar-logo-nd{font-family:'Bebas Neue',sans-serif;font-size:13px;color:#000;letter-spacing:.5px;position:relative;z-index:1}
        .appbar-logo-text{font-family:'Bebas Neue',sans-serif;font-size:18px;letter-spacing:4px;white-space:nowrap;color:#F0EBE1;line-height:1}
        .appbar-logo-text span{color:#F0B429}
        .appbar-left,.appbar-right{display:flex;align-items:center;gap:6px;flex-shrink:0;min-width:0;max-width:38%}
        .appbar-btn{display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:8px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.04);color:rgba(240,235,225,.5);font-size:14px;text-decoration:none;transition:background .2s,border-color .2s,color .2s;flex-shrink:0;cursor:pointer}
        .appbar-btn:hover{background:rgba(240,180,41,.08);border-color:rgba(240,180,41,.28);color:#F0B429}
        .appbar-admin{display:inline-flex;align-items:center;gap:4px;font-family:'Syne Mono',monospace;font-size:8px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;background:rgba(240,180,41,.1);color:#F0B429;border:1px solid rgba(240,180,41,.28);border-radius:8px;padding:5px 10px;text-decoration:none;white-space:nowrap;transition:background .2s,border-color .2s;flex-shrink:0}
        .appbar-admin:hover{background:rgba(240,180,41,.18);border-color:rgba(240,180,41,.5)}
        @media(min-width:640px){.appbar{padding:0 24px}.appbar-logo-text{font-size:20px;letter-spacing:5px}.appbar-logo-icon{width:30px;height:30px}}
        @media(max-width:380px){.appbar-logo-text{display:none}}
      `}</style>
      <nav className="appbar">
        <div className="appbar-left">
          <BackButton />
        </div>
        <Link href="/dashboard" className="appbar-logo" aria-label="NajdiDeal">
          <div className="appbar-logo-icon">
            <span className="appbar-logo-nd">ND</span>
          </div>
          <span className="appbar-logo-text">
            NAJDI<span>DEAL</span>
          </span>
        </Link>
        <div className="appbar-right">
          {isAdmin && (
            <Link href="/admin" className="appbar-admin">🔧 ADMIN</Link>
          )}
          <Link href="/marketplace/zpravy" className="appbar-btn" title="Zprávy">💬</Link>
          <Link href="/settings" className="appbar-btn" title="Nastavení">⚙️</Link>
          <LogoutButton />
        </div>
      </nav>
    </>
  )
}
