'use client'
import { useEffect, useState } from 'react'

interface Props {
  title: string
  description: string
  price: number | null
}

export function AiScoreWidget({ title, description, price }: Props) {
  const [score, setScore] = useState<{ score: number; condition: string; sellDays: string; belowMarket: number } | null>(null)

  useEffect(() => {
    fetch('/api/ai-deal-score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, price })
    })
      .then(r => r.json())
      .then(setScore)
      .catch(() => setScore({ score: 75, condition: 'dobrý', sellDays: '2-5 dní', belowMarket: 0 }))
  }, [title])

  const G = { grn: '#00E676', gold: '#F0B429', red: '#FF3B5C' }
  const scoreColor = !score ? G.gold : score.score >= 80 ? G.grn : score.score >= 60 ? G.gold : G.red
  const scoreWidth = score ? `${score.score}%` : '0%'

  return (
    <div className="gc gc-green" style={{ padding: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: G.grn, display: 'inline-block', animation: 'pulse-dot 1.8s infinite' }} />
          <span style={{ fontSize: 10, letterSpacing: '2px', textTransform: 'uppercase', color: G.grn, fontWeight: 700 }}>AI Hodnocení dealu</span>
        </div>
        <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 32, color: scoreColor, letterSpacing: 3, textShadow: `0 0 30px ${scoreColor}99` }}>
          {score ? `${score.score} / 100` : '... / 100'}
        </div>
      </div>
      <div style={{ height: 6, background: 'rgba(255,255,255,.06)', borderRadius: 100, overflow: 'hidden', marginTop: 8 }}>
        <div style={{ height: '100%', background: 'linear-gradient(90deg,#00E676,#F0B429)', borderRadius: 100, width: scoreWidth, transition: 'width 1s ease', boxShadow: '0 0 12px rgba(0,230,118,.5)' }} />
      </div>
      {score && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 14 }}>
          {score.belowMarket > 0 && <div style={{ fontSize: 10, color: 'rgba(240,235,225,.5)', lineHeight: 1.5 }}>✓ Pod tržní cenou o <strong style={{ color: G.grn }}>{score.belowMarket}%</strong></div>}
          <div style={{ fontSize: 10, color: 'rgba(240,235,225,.5)', lineHeight: 1.5 }}>✓ Stav <strong style={{ color: G.gold }}>{score.condition}</strong></div>
          <div style={{ fontSize: 10, color: 'rgba(240,235,225,.5)', lineHeight: 1.5 }}>✓ Prodej <strong style={{ color: G.grn }}>{score.sellDays}</strong></div>
        </div>
      )}
    </div>
  )
}
