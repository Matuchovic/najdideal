export const dynamic = 'force-dynamic'
export const maxDuration = 30

import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { title, description, price } = await req.json()
  
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 100,
        messages: [{
          role: 'user',
          content: `Rate this Czech marketplace listing. Reply ONLY with valid JSON: {"score":75,"condition":"dobrý","sellDays":"2-5 dní","belowMarket":10}. Title: "${(title||'').slice(0,80)}" Price: ${price||'unknown'} CZK. Description: "${(description||'').slice(0,100)}"`
        }]
      })
    })
    
    const data = await res.json()
    const text = (data.content?.[0]?.text || '').replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(text)
    
    return NextResponse.json({
      score: Math.min(100, Math.max(1, parsed.score || 75)),
      condition: parsed.condition || 'dobrý',
      sellDays: parsed.sellDays || '2-5 dní',
      belowMarket: Math.min(50, Math.max(0, parsed.belowMarket || 0))
    })
  } catch (e) {
    console.error('AI score error:', e)
    return NextResponse.json({ score: 75, condition: 'dobrý', sellDays: '2-5 dní', belowMarket: 0 })
  }
}
