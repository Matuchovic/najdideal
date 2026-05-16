export const maxDuration = 30

import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, Bookmark, BookmarkCheck, Clock, Eye, Tag, Zap } from 'lucide-react'
import { formatCZK, formatRelative, formatDate } from '@/lib/utils'
import { CATEGORY_META } from '@/lib/types'
import { AiScoreWidget } from '@/components/deals/AiScoreWidget'

interface Props { params: { slug: string } }

function priceFromTitle(title: string): number | null {
  const m = title.match(/:\s*(\d[\d\s]{1,8})\s*$/)
  if (m) return parseInt(m[1].replace(/\s/g, ''), 10)
  return null
}

export async function generateMetadata({ params }: Props) {
  try {
    const supabase = await createClient()
    const { data } = await supabase.from('deals').select('title,short_desc').eq('slug', params.slug).maybeSingle()
    return { title: data?.title ?? 'Deal | NajdiDeal' }
  } catch {
    return { title: 'Deal | NajdiDeal' }
  }
}

export default async function DealDetailPage({ params }: Props) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
  const isVip = profile?.role === 'vip' || profile?.role === 'admin'

  const { data: deal } = await supabase.from('deals').select('*').eq('slug', params.slug).maybeSingle()
  if (!deal) notFound()
  if (deal.access_level === 'vip' && !isVip) redirect('/membership')

  const { data: savedRow } = await supabase.from('saved_deals').select('id').eq('user_id', user.id).eq('deal_id', deal.id).maybeSingle()
  const isSaved = !!savedRow

  await supabase.from('deals').update({ view_count: (deal.view_count ?? 0) + 1 }).eq('id', deal.id)

  const meta = CATEGORY_META[deal.category as keyof typeof CATEGORY_META] ?? { label: 'Deal', icon: '💰', color: '#F0B429', badgeClass: 'badge-gold' }
  const displayPrice = deal.sell_price ?? priceFromTitle(deal.title ?? '')

  const [similarResult] = await Promise.all([
    supabase
      .from('deals')
      .select('id, title, slug, sell_price, emoji, image_url, created_at')
      .eq('category', deal.category)
      .eq('status', 'active')
      .neq('id', deal.id)
      .order('created_at', { ascending: false })
      .limit(3)
  ])

  const similar = similarResult.data ?? []
  return (
    <>
      <style>{`
        @property --a { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
        @property --a2 { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
        @property --a3 { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
        @keyframes spin1 { to { --a: 360deg; } }
        @keyframes spin2 { to { --a2: 360deg; } }
        @keyframes spin3 { to { --a3: 360deg; } }
        @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.7)} }
        @keyframes glow-btn { 0%,100%{box-shadow:0 0 20px rgba(240,180,41,.3)} 50%{box-shadow:0 0 50px rgba(240,180,41,.7),0 0 80px rgba(240,180,41,.2)} }
        @keyframes score-glow { 0%,100%{box-shadow:0 0 8px rgba(0,230,118,.4)} 50%{box-shadow:0 0 24px rgba(0,230,118,.8),0 0 40px rgba(240,180,41,.3)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
        .gc { position:relative; border-radius:14px; overflow:hidden; }
        .gc::before { content:''; position:absolute; inset:-2px; border-radius:16px; background:conic-gradient(from var(--a,0deg),transparent 0deg,#F0B429 50deg,#FFD97D 70deg,transparent 120deg); animation:spin1 4s linear infinite; z-index:0; }
        .gc::after { content:''; position:absolute; inset:1.5px; border-radius:13px; background:#0a0a0e; z-index:1; }
        .gc > * { position:relative; z-index:2; }
        .gc-green::before { background:conic-gradient(from var(--a2,0deg),transparent 0deg,#00E676 50deg,#69FFB8 70deg,transparent 120deg); animation:spin2 3s linear infinite; }
        .gc-green::after { background:#080c0a; }
        .gc-fast::before { animation:spin3 2.5s linear infinite; background:conic-gradient(from var(--a3,0deg),transparent 0deg,#F0B429 30deg,#FF9500 55deg,#FFD97D 75deg,transparent 130deg); }
        .score-bar { height:6px; background:rgba(255,255,255,.06); border-radius:100px; overflow:hidden; margin-top:8px; }
        .score-fill { height:100%; background:linear-gradient(90deg,#00E676,#F0B429); border-radius:100px; animation:score-glow 2s ease-in-out infinite; }
        .pulse { animation:pulse-dot 1.8s infinite; }
        .sim-card:hover { background:rgba(255,255,255,.06)!important; border-color:rgba(240,180,41,.2)!important; }
      `}</style>

      <div style={{ maxWidth: 900, paddingBottom: 80, animation: 'fadeUp .6s ease both' }}>
        <Link href="/deals" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: "'Syne Mono',monospace", fontSize: 9, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'rgba(240,235,225,.3)', textDecoration: 'none', marginBottom: 20 }}>
          <ArrowLeft size={12} /> Zpět na dealy
        </Link>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* HEADER */}
            <div className="gc" style={{ padding: 20 }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 16 }}>
                <div style={{ width: 72, height: 72, borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(240,180,41,.2)', flexShrink: 0, background: 'rgba(240,180,41,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34, boxShadow: '0 0 24px rgba(240,180,41,.2)' }}>
                  {deal.image_url
                    ? <img src={deal.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <span>{deal.emoji || '💰'}</span>}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 100, fontSize: 9, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', background: 'rgba(240,180,41,.1)', border: '1px solid rgba(240,180,41,.25)', color: '#F0B429' }}>{meta.icon} {meta.label}</span>
                    {deal.is_hot && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 100, fontSize: 9, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', background: 'rgba(0,230,118,.08)', border: '1px solid rgba(0,230,118,.2)', color: '#00E676' }}>🔥 Hot deal</span>}
                  </div>
                  <h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 28, letterSpacing: 2, lineHeight: 1, color: '#F0EBE1', marginBottom: 4 }}>{(deal.title ?? '').toUpperCase()}</h1>
                  <div style={{ fontSize: 10, color: 'rgba(240,235,225,.3)', letterSpacing: 1 }}>Bazoš.cz · {formatRelative(deal.created_at)}</div>
                </div>
              </div>

              {displayPrice && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 16 }}>
                  <div style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 12, padding: 14 }}>
                    <div style={{ fontSize: 9, color: 'rgba(240,235,225,.35)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 5 }}>Prodejní cena</div>
                    <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 22, color: '#F0B429', letterSpacing: 1, textShadow: '0 0 20px rgba(240,180,41,.4)' }}>{displayPrice.toLocaleString('cs-CZ')} Kč</div>
                  </div>
                  {aiScore.belowMarket > 0 && (
                    <div style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 12, padding: 14 }}>
                      <div style={{ fontSize: 9, color: 'rgba(240,235,225,.35)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 5 }}>Tržní hodnota (est.)</div>
                      <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 22, color: '#F0EBE1', letterSpacing: 1 }}>{Math.round(displayPrice / (1 - aiScore.belowMarket / 100)).toLocaleString('cs-CZ')} Kč</div>
                    </div>
                  )}
                  {aiScore.belowMarket > 0 && (
                    <div style={{ background: 'rgba(0,230,118,.05)', border: '1px solid rgba(0,230,118,.15)', borderRadius: 12, padding: 14 }}>
                      <div style={{ fontSize: 9, color: 'rgba(0,230,118,.5)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 5 }}>Úspora</div>
                      <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 22, color: '#00E676', letterSpacing: 1, textShadow: '0 0 20px rgba(0,230,118,.5)' }}>-{aiScore.belowMarket}%</div>
                    </div>
                  )}
                </div>
              )}

              {deal.description && (
                <p style={{ fontSize: 12, color: 'rgba(240,235,225,.55)', lineHeight: 1.75 }}>{deal.description}</p>
              )}
            </div>

            {/* AI SCORE */}
            <AiScoreWidget title={deal.title ?? ''} description={deal.description ?? ''} price={displayPrice} />

            {/* SIMILAR */}
            {similar.length > 0 && (
              <div className="gc" style={{ padding: 18 }}>
                <div style={{ fontSize: 9, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'rgba(240,235,225,.3)', marginBottom: 12, fontFamily: "'Syne Mono',monospace" }}>Podobné dealy</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {similar.map(s => {
                    const sp = s.sell_price ?? priceFromTitle(s.title ?? '')
                    return (
                      <Link key={s.id} href={`/deals/${s.slug}`} className="sim-card" style={{ background: 'rgba(255,255,255,.02)', border: '1px solid rgba(255,255,255,.05)', borderRadius: 10, padding: '10px 12px', display: 'flex', gap: 10, alignItems: 'center', textDecoration: 'none', transition: 'all .2s' }}>
                        <div style={{ width: 40, height: 40, borderRadius: 9, background: 'rgba(240,180,41,.08)', border: '1px solid rgba(240,180,41,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                          {s.image_url ? <img src={s.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: 18 }}>{s.emoji || '💰'}</span>}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#F0EBE1' }}>{s.title}</div>
                          <div style={{ fontSize: 10, color: 'rgba(240,235,225,.35)', marginTop: 2 }}>{formatRelative(s.created_at)}</div>
                        </div>
                        {sp && <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 15, color: '#F0B429', whiteSpace: 'nowrap' }}>{sp.toLocaleString('cs-CZ')} Kč</div>}
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}

            {deal.tags && deal.tags.length > 0 && (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                <Tag size={12} color="rgba(240,235,225,.3)" />
                {deal.tags.map((tag: string) => (
                  <span key={tag} style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 100, padding: '4px 12px', fontSize: 9, color: 'rgba(240,235,225,.4)', letterSpacing: 1, fontFamily: "'Syne Mono',monospace" }}>#{tag}</span>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="gc gc-fast" style={{ padding: 18 }}>
              <div style={{ fontSize: 9, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(240,235,225,.25)', marginBottom: 12, fontFamily: "'Syne Mono',monospace" }}>Akce</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {deal.source_url && (
                  <a href={deal.source_url} target="_blank" rel="noopener noreferrer" style={{ background: 'linear-gradient(135deg,#F0B429,#FF9500)', color: '#000', border: 'none', borderRadius: 10, padding: '16px', fontSize: 11, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, textDecoration: 'none', animation: 'glow-btn 2s ease-in-out infinite' }}>
                    <ExternalLink size={14} /> Kontaktovat prodejce
                  </a>
                )}
                {deal.source_url && (
                  <a href={deal.source_url} target="_blank" rel="noopener noreferrer" style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', color: '#F0EBE1', borderRadius: 10, padding: '13px', fontSize: 10, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, textDecoration: 'none' }}>
                    ↗ Zobrazit na Bazosi
                  </a>
                )}
                <Link href={`/api/save-deal?deal_id=${deal.id}&saved=${isSaved}&redirect=/deals/${deal.slug}`} style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)', color: 'rgba(240,235,225,.6)', borderRadius: 10, padding: '11px', fontSize: 10, fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', cursor: 'pointer', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, textDecoration: 'none' }}>
                  {isSaved ? <><BookmarkCheck size={13} /> Uloženo</> : <><Bookmark size={13} /> Uložit deal</>}
                </Link>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button style={{ flex: 1, background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 8, padding: '9px', fontSize: 9, color: 'rgba(240,235,225,.5)', letterSpacing: 1, textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>📤 Sdílet</button>
                  <button style={{ flex: 1, background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 8, padding: '9px', fontSize: 9, color: 'rgba(240,235,225,.5)', letterSpacing: 1, textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>💬 WA</button>
                </div>
              </div>
            </div>

            <div className="gc" style={{ padding: 18 }}>
              <div style={{ fontSize: 9, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(240,235,225,.25)', marginBottom: 12, fontFamily: "'Syne Mono',monospace" }}>Informace</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}><span style={{ color: 'rgba(240,235,225,.4)', display: 'flex', alignItems: 'center', gap: 5 }}><Eye size={11} /> Zobrazení</span><span style={{ fontWeight: 600 }}>{(deal.view_count ?? 0).toLocaleString('cs-CZ')}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}><span style={{ color: 'rgba(240,235,225,.4)', display: 'flex', alignItems: 'center', gap: 5 }}><Bookmark size={11} /> Uložení</span><span style={{ fontWeight: 600 }}>{deal.save_count ?? 0}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}><span style={{ color: 'rgba(240,235,225,.4)', display: 'flex', alignItems: 'center', gap: 5 }}><Clock size={11} /> Přidáno</span><span style={{ fontWeight: 600 }}>{formatRelative(deal.created_at)}</span></div>
                {deal.expires_at && <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}><span style={{ color: 'rgba(240,235,225,.4)' }}>Platí do</span><span style={{ color: '#FF3B5C', fontWeight: 600 }}>{formatDate(deal.expires_at)}</span></div>}
              </div>
            </div>

            <div className="gc gc-green" style={{ padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <span className="pulse" style={{ width: 7, height: 7, borderRadius: '50%', background: '#00E676', display: 'inline-block' }} />
                <span style={{ fontSize: 9, letterSpacing: '2px', textTransform: 'uppercase', color: '#00E676', fontWeight: 700, fontFamily: "'Syne Mono',monospace" }}>Alert</span>
              </div>
              <p style={{ fontSize: 11, color: 'rgba(240,235,225,.6)', lineHeight: 1.6, marginBottom: 12 }}>Buď první u podobných dealů. Notifikace okamžitě.</p>
              <Link href="/alerts" style={{ background: 'rgba(0,230,118,.12)', border: '1px solid rgba(0,230,118,.25)', color: '#00E676', borderRadius: 8, padding: '10px', fontSize: 9, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, boxShadow: '0 0 20px rgba(0,230,118,.1)', textDecoration: 'none' }}>
                <Zap size={12} /> Nastavit alert
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
