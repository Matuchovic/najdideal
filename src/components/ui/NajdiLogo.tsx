'use client'
import Link from 'next/link'

// ══════════════════════════════════════════════════════
//  NajdiDeal – Ultimátní Logo Komponent
//  Pulsující zlatý glow, hezká ND ikona, Bebas Neue
// ══════════════════════════════════════════════════════

type LogoSize = 'sm' | 'md' | 'lg' | 'xl'

interface NajdiLogoProps {
  size?: LogoSize
  href?: string
  onClick?: () => void
  showText?: boolean
}

const sizes = {
  sm: { icon: 26, iconR: 6, ndSize: 10, textSize: 16, gap: 8, letterSpacing: 4 },
  md: { icon: 33, iconR: 7, ndSize: 13, textSize: 21, gap: 11, letterSpacing: 6 },
  lg: { icon: 44, iconR: 9, ndSize: 17, textSize: 28, gap: 13, letterSpacing: 7 },
  xl: { icon: 60, iconR: 12, ndSize: 24, textSize: 38, gap: 16, letterSpacing: 8 },
}

export default function NajdiLogo({ size = 'md', href = '/', onClick, showText = true }: NajdiLogoProps) {
  const s = sizes[size]

  const logo = (
    <span
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: s.gap,
        textDecoration: 'none',
        cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      <style>{`
        @keyframes nd-pulse {
          0%, 100% {
            box-shadow:
              0 0 12px rgba(240,180,41,.55),
              0 0 28px rgba(240,180,41,.28),
              0 0 0px rgba(240,180,41,0),
              inset 0 1px 0 rgba(255,255,255,.35);
          }
          50% {
            box-shadow:
              0 0 20px rgba(240,180,41,.9),
              0 0 48px rgba(240,180,41,.5),
              0 0 80px rgba(240,180,41,.2),
              inset 0 1px 0 rgba(255,255,255,.35);
          }
        }
        @keyframes nd-glow-text {
          0%, 100% { text-shadow: 0 0 18px rgba(240,180,41,.4); }
          50%       { text-shadow: 0 0 32px rgba(240,180,41,.85), 0 0 60px rgba(240,180,41,.3); }
        }
        @keyframes nd-shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes nd-ring {
          0%   { transform: rotate(0deg);   opacity: .55; }
          100% { transform: rotate(360deg); opacity: .55; }
        }
        @keyframes nd-ring2 {
          0%   { transform: rotate(0deg);   opacity: .3; }
          100% { transform: rotate(-360deg); opacity: .3; }
        }
        .nd-icon:hover { transform: scale(1.08) rotate(-4deg) !important; }
        .nd-text-wrap:hover .nd-deal { text-shadow: 0 0 32px rgba(240,180,41,.9) !important; }
      `}</style>

      {/* ── IKONA ── */}
      <span
        className="nd-icon"
        style={{
          width: s.icon,
          height: s.icon,
          borderRadius: s.iconR,
          background: 'linear-gradient(145deg, #FFD45E 0%, #F0B429 45%, #C8880A 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          flexShrink: 0,
          animation: 'nd-pulse 2.8s ease-in-out infinite',
          transition: 'transform .35s cubic-bezier(.34,1.56,.64,1)',
        }}
      >
        {/* Horní lesk */}
        <span style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '55%',
          background: 'linear-gradient(180deg,rgba(255,255,255,.45) 0%,transparent 100%)',
          borderRadius: `${s.iconR}px ${s.iconR}px 0 0`,
          pointerEvents: 'none',
        }} />

        {/* Rotující vnější kroužek */}
        <span style={{
          position: 'absolute', inset: -2,
          borderRadius: s.iconR + 2,
          border: '1.5px dashed rgba(240,180,41,.35)',
          animation: 'nd-ring 8s linear infinite',
          pointerEvents: 'none',
        }} />
        <span style={{
          position: 'absolute', inset: -5,
          borderRadius: s.iconR + 5,
          border: '1px solid rgba(240,180,41,.15)',
          animation: 'nd-ring2 12s linear infinite',
          pointerEvents: 'none',
        }} />

        {/* ND text — custom kerning */}
        <span style={{
          position: 'relative',
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: s.ndSize,
          fontWeight: 900,
          color: '#000',
          letterSpacing: 1,
          lineHeight: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
        }}>
          <span style={{ opacity: .85 }}>N</span>
          <span style={{ opacity: 1 }}>D</span>
        </span>

        {/* Spodní zlatý bloom */}
        <span style={{
          position: 'absolute', bottom: -4, left: '50%', transform: 'translateX(-50%)',
          width: '70%', height: 8,
          background: 'rgba(240,180,41,.5)',
          borderRadius: '50%',
          filter: 'blur(6px)',
          pointerEvents: 'none',
        }} />
      </span>

      {/* ── TEXT ── */}
      {showText && (
        <span
          className="nd-text-wrap"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: s.textSize,
            letterSpacing: s.letterSpacing,
            lineHeight: 1,
            display: 'flex',
            alignItems: 'baseline',
            gap: 0,
          }}
        >
          <span style={{
            color: '#F0EBE1',
            animation: 'nd-glow-text 2.8s ease-in-out infinite',
          }}>
            NAJDI
          </span>
          <span
            className="nd-deal"
            style={{
              background: 'linear-gradient(90deg, #F0B429 0%, #FFD97D 40%, #F0B429 60%, #C8880A 100%)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'nd-shimmer 3s linear infinite, nd-glow-text 2.8s ease-in-out infinite',
              textShadow: 'none',
              transition: 'text-shadow .3s',
            }}
          >
            DEAL
          </span>
        </span>
      )}
    </span>
  )

  if (href) {
    return (
      <Link href={href} style={{ textDecoration: 'none' }}>
        {logo}
      </Link>
    )
  }

  return logo
}
