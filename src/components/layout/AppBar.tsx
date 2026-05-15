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
        .appbar{position:sticky;top:0;z-index:200;height:56px;display:flex;align-items:center;justify-content:space-between;padding:0 12px;background:rgba(2,2,8,.95);backdrop-filter:blur(32px) saturate(180%);border-bottom:1px solid rgba(255,255,255,.06)}
        .appbar-logo{position:absolute;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:7px;text-decoration:none;pointer-events:auto}
        .appbar-logo-icon{width:26px;height:26px;border-radius:6px;background:linear-gradient(145deg,#FFD45E 0%,#F0B429 50%,#C8880A 100%);display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 0 10px rgba(240,180,41,.35);position:relative;overflow:hidden}
        .appbar-logo-icon::after{content:'';position:absolute;top:0;left:0;right:0;height:50%;background:linear-gradient(180deg,rgba(255,255,255,.28) 0%,transparent 100%);pointer-events:none}
        .appbar-logo-nd{font-family:'Bebas Neue',sans-serif;font-size:12px;color:#000;letter-spacing:.5px;position:relative;z-index:1}
        .appbar-logo-text{font-family:'Bebas Neue',sans-serif;font-size:16px;letter-spacing:3px;white-space:nowrap;color:#F0EBE1;line-height:1}
        .appbar-logo-text span{color:#F0B429}
        .appbar-right{display:flex;align-items:center;gap:4px;flex-shrink:0}
        .appbar-btn{display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:7px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.04);font-size:13px;text-decoration:none;flex-shrink:0;cursor:pointer;color:rgba(240,235,225,.6);transition:background .2s}
        .appbar-btn:hover{background:rgba(240,180,41,.08);border-color:rgba(240,180,41,.28)}
        .appbar-admin{display:inline-flex;align-items:center;font-family:'Syne Mono',monospace;font-size:7px;font-weight:700;letter-spacing:1px;text-transform:uppercase;background:rgba(240,180,41,.1);color:#F0B429;border:1px solid rgba(240,180,41,.28);border-radius:6px;padding:4px 7px;text-decoration:none;white-space:nowrap;flex-shrink:0}
      `}</style>
      <nav className="appbar">
        <BackButton />
        <Link href="/dashboard" className="appbar-logo" aria-label="NajdiDeal">
          <div className="appbar-logo-icon">
            <span className="appbar-logo-nd">ND</span>
          </div>
          <span className="appbar-logo-text">NAJDI<span>DEAL</span></span>
        </Link>
        <div className="appbar-right">
          {isAdmin && <Link href="/admin" className="appbar-admin">🔧 ADMIN</Link>}
          <Link href="/" className="appbar-btn" title="Domů">🏠</Link>
          <Link href="/settings" className="appbar-btn" title="Nastavení">⚙️</Link>
          <LogoutButton />
        </div>
      </nav>
    </>
  )
}
