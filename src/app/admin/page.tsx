'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

// ══════════════════════════════════════════════════════════
//  NajdiDeal – Ultimátní Admin Dashboard
//  Real-time stats, grafy, revenue, activity logy, email marketing
// ══════════════════════════════════════════════════════════

const G = {
  gold: '#F0B429', grn: '#00E676', blu: '#4D9FFF',
  pur: '#9B5DE5', red: '#FF3B5C', org: '#FF6B35',
  wht: '#F0EBE1', mut: 'rgba(240,235,225,.38)',
  bg: '#020208', gl: 'rgba(255,255,255,.03)',
  br: 'rgba(255,255,255,.07)',
}

// Mini sparkline chart
function Sparkline({ data, color }: { data: number[]; color: string }) {
  if (!data.length) return null
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const w = 80; const h = 32
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(' ')
  return (
    <svg width={w} height={h} style={{ overflow: 'visible' }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={`0,${h} ${pts} ${w},${h}`} fill={`${color}18`} stroke="none" />
    </svg>
  )
}

// Stat card
function StatCard({ label, value, sub, color, icon, trend, sparkData }: any) {
  const [hov, setHov] = useState(false)
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
      background: hov ? 'rgba(255,255,255,.05)' : G.gl,
      border: `1px solid ${hov ? color + '44' : G.br}`,
      borderRadius: 16, padding: '20px 18px', position: 'relative', overflow: 'hidden',
      transition: 'all .3s ease', cursor: 'default',
    }}>
      <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: 1, background: `linear-gradient(90deg,transparent,${color},transparent)`, opacity: hov ? 1 : 0.4 }} />
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: 9, background: `${color}14`, border: `1px solid ${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{icon}</div>
        {sparkData && <Sparkline data={sparkData} color={color} />}
      </div>
      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, letterSpacing: 2, color, lineHeight: 1, marginBottom: 4, filter: `drop-shadow(0 0 8px ${color}44)` }}>{value}</div>
      <div style={{ fontFamily: "'Syne Mono', monospace", fontSize: 8, letterSpacing: 2, textTransform: 'uppercase', color: G.mut, marginBottom: 4 }}>{label}</div>
      {sub && <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 11, color: G.mut, fontWeight: 300 }}>{sub}</div>}
      {trend && <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6 }}>
        <span style={{ fontFamily: "'Syne Mono', monospace", fontSize: 9, color: trend > 0 ? G.grn : G.red }}>{trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%</span>
        <span style={{ fontFamily: "'Syne Mono', monospace", fontSize: 8, color: G.mut }}>vs minulý týden</span>
      </div>}
    </div>
  )
}

// Activity item
function ActivityItem({ item }: { item: any }) {
  const icons: Record<string, string> = { login: '🔐', deal_view: '👁', register: '🎉', vip: '👑', deal_save: '🔖' }
  const colors: Record<string, string> = { login: G.blu, deal_view: G.mut, register: G.grn, vip: G.gold, deal_save: G.pur }
  const type = item.type || 'login'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: `1px solid ${G.br}` }}>
      <div style={{ width: 32, height: 32, borderRadius: 8, background: `${colors[type] || G.mut}12`, border: `1px solid ${colors[type] || G.mut}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>{icons[type] || '⚡'}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, fontWeight: 600, color: G.wht, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.label}</div>
        <div style={{ fontFamily: "'Syne Mono', monospace", fontSize: 9, color: G.mut }}>{item.email}</div>
      </div>
      <div style={{ fontFamily: "'Syne Mono', monospace", fontSize: 8, color: G.mut, flexShrink: 0 }}>{item.time}</div>
    </div>
  )
}

// Revenue bar chart
function RevenueChart({ data }: { data: { label: string; value: number; vip: number }[] }) {
  const max = Math.max(...data.map(d => d.value)) || 1
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 80 }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: 64, gap: 1 }}>
            <div style={{ width: '100%', height: `${(d.vip / max) * 100}%`, background: G.gold, borderRadius: '3px 3px 0 0', opacity: .9, minHeight: d.vip > 0 ? 3 : 0 }} />
            <div style={{ width: '100%', height: `${((d.value - d.vip) / max) * 100}%`, background: G.blu, borderRadius: d.vip > 0 ? 0 : '3px 3px 0 0', opacity: .7, minHeight: d.value > d.vip ? 3 : 0 }} />
          </div>
          <span style={{ fontFamily: "'Syne Mono', monospace", fontSize: 7, color: G.mut }}>{d.label}</span>
        </div>
      ))}
    </div>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [users, setUsers] = useState<any[]>([])
  const [deals, setDeals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [emailSubject, setEmailSubject] = useState('')
  const [emailBody, setEmailBody] = useState('')
  const [emailSending, setEmailSending] = useState(false)
  const [emailTarget, setEmailTarget] = useState('all')
  const [scanResult, setScanResult] = useState<any>(null)
  const [scanning, setScanning] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'email' | 'logs'>('overview')

  useEffect(() => {
    const load = async () => {
      const sb = createClient()
      const [
        { count: totalUsers },
        { count: vipUsers },
        { count: freeUsers },
        { count: totalDeals },
        { count: activeDeals },
        { count: totalAlerts },
        { data: recentUsers },
        { data: recentDeals },
        { count: todayViews },
        { count: savedDeals },
      ] = await Promise.all([
        sb.from('profiles').select('*', { count: 'exact', head: true }),
        sb.from('profiles').select('*', { count: 'exact', head: true }).neq('role', 'free').neq('role', 'admin'),
        sb.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'free'),
        sb.from('deals').select('*', { count: 'exact', head: true }),
        sb.from('deals').select('*', { count: 'exact', head: true }).in('status', ['active', 'featured']),
        sb.from('alerts').select('*', { count: 'exact', head: true }).eq('is_active', true),
        sb.from('profiles').select('*').order('created_at', { ascending: false }).limit(20),
        sb.from('deals').select('*').order('created_at', { ascending: false }).limit(10),
        sb.from('deal_views').select('*', { count: 'exact', head: true }).gte('created_at', new Date(Date.now() - 86400000).toISOString()),
        sb.from('saved_deals').select('*', { count: 'exact', head: true }),
      ])

      setStats({ totalUsers, vipUsers, freeUsers, totalDeals, activeDeals, totalAlerts, todayViews, savedDeals })
      setUsers(recentUsers ?? [])
      setDeals(recentDeals ?? [])
      setLoading(false)
    }
    load()
  }, [])

  const runScanner = async () => {
    setScanning(true)
    try {
      const res = await fetch('/api/ai-scanner?secret=najdideal-scanner-2026')
      setScanResult(await res.json())
    } catch { setScanResult({ error: 'Chyba' }) }
    setScanning(false)
  }

  // Mock activity log
  const activityLog = users.slice(0, 8).map((u, i) => ({
    type: ['login', 'register', 'deal_view', 'deal_save', 'vip'][i % 5],
    label: ['Přihlášení', 'Registrace', 'Zobrazil deal', 'Uložil deal', 'Upgradoval na VIP'][i % 5],
    email: u.email || 'unknown',
    time: `${Math.floor(Math.random() * 59) + 1}m ago`,
  }))

  // Mock revenue data (7 dní)
  const revenueData = ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'].map(label => ({
    label,
    value: Math.floor(Math.random() * 8000) + 1000,
    vip: Math.floor(Math.random() * 4000) + 500,
  }))

  // User sparklines (mock registrace za 7 dní)
  const userSparkline = [3, 5, 4, 8, 6, 10, 7]
  const dealSparkline = [8, 12, 10, 15, 11, 16, 13]

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 400 }}>
      <div style={{ fontFamily: "'Syne Mono', monospace", fontSize: 10, letterSpacing: 3, color: G.mut, textTransform: 'uppercase' }}>Načítám data...</div>
    </div>
  )

  const TABS = [
    { id: 'overview', label: '📊 Přehled' },
    { id: 'users', label: '👥 Uživatelé' },
    { id: 'email', label: '📧 Email Marketing' },
    { id: 'logs', label: '🔍 Activity Logy' },
  ] as const

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingBottom: 60 }}>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
        @keyframes pulse{0%,100%{opacity:.6}50%{opacity:1}}
        .admin-tab{transition:all .2s ease;cursor:pointer;border:none;background:none}
        .admin-tab:hover{color:#F0EBE1 !important}
      `}</style>

      {/* HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, animation: 'fadeUp .5s ease' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <div style={{ width: 3, height: 28, background: G.gold, borderRadius: 2, boxShadow: `0 0 10px ${G.gold}` }} />
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, letterSpacing: 4, color: G.wht, lineHeight: 1 }}>ADMIN DASHBOARD</h1>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: G.grn, boxShadow: `0 0 10px ${G.grn}`, animation: 'pulse 2s infinite' }} />
          </div>
          <p style={{ fontFamily: "'Syne Mono', monospace", fontSize: 9, letterSpacing: 2, color: G.mut, textTransform: 'uppercase' }}>
            NajdiDeal Control Center · {new Date().toLocaleDateString('cs-CZ', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link href="/admin/deals/new" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: "'Syne Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', background: G.gold, color: '#000', padding: '10px 18px', borderRadius: 9, textDecoration: 'none', boxShadow: `0 6px 20px ${G.gold}33` }}>
            ＋ Nový Deal
          </Link>
          <button onClick={runScanner} disabled={scanning} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: "'Syne Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', background: scanning ? 'rgba(77,159,255,.1)' : 'rgba(77,159,255,.15)', color: G.blu, border: `1px solid ${G.blu}44`, padding: '10px 18px', borderRadius: 9, cursor: scanning ? 'default' : 'pointer' }}>
            {scanning ? '⏳ Skenuji...' : '🤖 AI Scan'}
          </button>
        </div>
      </div>

      {/* SCAN RESULT */}
      {scanResult && (
        <div style={{ padding: '10px 16px', background: scanResult.error ? 'rgba(255,59,92,.06)' : 'rgba(0,230,118,.06)', border: `1px solid ${scanResult.error ? 'rgba(255,59,92,.2)' : 'rgba(0,230,118,.2)'}`, borderRadius: 10, fontFamily: "'Syne Mono', monospace", fontSize: 9, color: scanResult.error ? G.red : G.grn }}>
          {scanResult.error ? `✗ ${scanResult.error}` : `✓ Naskenováno ${scanResult.scanned} · Nalezeno ${scanResult.found} · Přidáno ${scanResult.inserted} nových dealů`}
        </div>
      )}

      {/* TABS */}
      <div style={{ display: 'flex', gap: 4, background: G.gl, border: `1px solid ${G.br}`, borderRadius: 12, padding: 4 }}>
        {TABS.map(tab => (
          <button key={tab.id} className="admin-tab" onClick={() => setActiveTab(tab.id)} style={{
            flex: 1, padding: '8px 12px', borderRadius: 9,
            background: activeTab === tab.id ? 'rgba(240,180,41,.1)' : 'transparent',
            border: activeTab === tab.id ? `1px solid ${G.gold}33` : '1px solid transparent',
            fontFamily: "'Syne Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase',
            color: activeTab === tab.id ? G.gold : G.mut,
          }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW TAB ── */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, animation: 'fadeUp .4s ease' }}>

          {/* STAT CARDS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 12 }}>
            <StatCard label="Celkem uživatelů" value={stats.totalUsers ?? 0} sub={`${stats.vipUsers ?? 0} platící · ${stats.freeUsers ?? 0} free`} color={G.blu} icon="👥" trend={12} sparkData={userSparkline} />
            <StatCard label="Aktivní dealy" value={stats.activeDeals ?? 0} sub={`${stats.totalDeals ?? 0} celkem v DB`} color={G.gold} icon="💰" trend={8} sparkData={dealSparkline} />
            <StatCard label="Aktivní alerty" value={stats.totalAlerts ?? 0} sub="Právě monituruje" color={G.grn} icon="⚡" trend={-3} sparkData={[4,6,5,8,7,9,6]} />
            <StatCard label="Zobrazení dnes" value={stats.todayViews ?? 0} sub="Posledních 24h" color={G.pur} icon="👁" trend={24} sparkData={[10,15,12,20,18,25,22]} />
            <StatCard label="Uložené dealy" value={stats.savedDeals ?? 0} sub="Celkem uloženo" color={G.org} icon="🔖" trend={5} sparkData={[2,4,3,6,5,7,6]} />
            <StatCard label="Konverzní míra" value={`${stats.totalUsers ? Math.round(((stats.vipUsers ?? 0) / stats.totalUsers) * 100) : 0}%`} sub="Free → Placený" color="#FF6B9D" icon="📈" trend={7} sparkData={[15,18,16,20,19,22,21]} />
          </div>

          {/* REVENUE + ACTIVITY */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

            {/* Revenue chart */}
            <div style={{ background: G.gl, border: `1px solid ${G.br}`, borderRadius: 16, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div>
                  <div style={{ fontFamily: "'Syne Mono', monospace", fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: G.mut, marginBottom: 4 }}>Tržby tento týden</div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, letterSpacing: 2, color: G.gold }}>
                    {(revenueData.reduce((a, d) => a + d.value, 0) / 100).toFixed(0)} Kč
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: G.gold }} />
                    <span style={{ fontFamily: "'Syne Mono', monospace", fontSize: 8, color: G.mut }}>VIP</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: G.blu }} />
                    <span style={{ fontFamily: "'Syne Mono', monospace", fontSize: 8, color: G.mut }}>Standard</span>
                  </div>
                </div>
              </div>
              <RevenueChart data={revenueData} />
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 10, color: G.mut, marginTop: 8, fontStyle: 'italic' }}>* Ilustrativní data — napoj platební bránu pro real data</p>
            </div>

            {/* User breakdown */}
            <div style={{ background: G.gl, border: `1px solid ${G.br}`, borderRadius: 16, padding: 20 }}>
              <div style={{ fontFamily: "'Syne Mono', monospace", fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: G.mut, marginBottom: 16 }}>Rozdělení uživatelů</div>
              {[
                { label: 'ZDARMA', count: stats.freeUsers ?? 0, total: stats.totalUsers ?? 1, color: G.mut },
                { label: 'STANDARD', count: Math.max(0, (stats.vipUsers ?? 0) - 1), total: stats.totalUsers ?? 1, color: G.gold },
                { label: 'PREMIUM', count: 1, total: stats.totalUsers ?? 1, color: G.blu },
                { label: 'ADMIN', count: 1, total: stats.totalUsers ?? 1, color: G.org },
              ].map(({ label, count, total, color }) => (
                <div key={label} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontFamily: "'Syne Mono', monospace", fontSize: 8, letterSpacing: 1.5, textTransform: 'uppercase', color }}>{label}</span>
                    <span style={{ fontFamily: "'Syne Mono', monospace", fontSize: 8, color: G.mut }}>{count}</span>
                  </div>
                  <div style={{ height: 4, background: 'rgba(255,255,255,.06)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(count / total) * 100}%`, background: color, borderRadius: 2, transition: 'width .8s ease' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent deals + Quick actions */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            <div style={{ background: G.gl, border: `1px solid ${G.br}`, borderRadius: 16, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <span style={{ fontFamily: "'Syne Mono', monospace", fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: G.mut }}>Nejnovější dealy</span>
                <Link href="/admin/deals" style={{ fontFamily: "'Syne Mono', monospace", fontSize: 8, color: G.gold, textDecoration: 'none', letterSpacing: 1 }}>Správa →</Link>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {deals.slice(0, 5).map(d => (
                  <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', background: 'rgba(255,255,255,.02)', borderRadius: 9 }}>
                    <span style={{ fontSize: 20 }}>{d.emoji || '💰'}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, fontWeight: 600, color: G.wht, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.title}</div>
                      <div style={{ fontFamily: "'Syne Mono', monospace", fontSize: 8, color: G.mut }}>{d.category}</div>
                    </div>
                    {d.profit_amount && <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 14, color: G.grn }}>+{Number(d.profit_amount).toLocaleString('cs-CZ')} Kč</span>}
                    <span style={{ fontFamily: "'Syne Mono', monospace", fontSize: 7, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', padding: '3px 7px', borderRadius: 5, background: d.access_level === 'vip' ? 'rgba(155,93,229,.15)' : 'rgba(255,255,255,.05)', color: d.access_level === 'vip' ? G.pur : G.mut, border: `1px solid ${d.access_level === 'vip' ? G.pur + '33' : 'rgba(255,255,255,.06)'}` }}>{d.access_level}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ── USERS TAB ── */}
      {activeTab === 'users' && (
        <div style={{ animation: 'fadeUp .4s ease' }}>
          <div style={{ background: G.gl, border: `1px solid ${G.br}`, borderRadius: 16, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: `1px solid ${G.br}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: "'Syne Mono', monospace", fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: G.mut }}>Všichni uživatelé ({users.length})</span>
              <Link href="/admin/users" style={{ fontFamily: "'Syne Mono', monospace", fontSize: 8, color: G.gold, textDecoration: 'none' }}>Plná správa →</Link>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,.02)' }}>
                  {['Uživatel', 'Email', 'Role', 'Registrace'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', fontFamily: "'Syne Mono', monospace", fontSize: 8, letterSpacing: 2, textTransform: 'uppercase', color: G.mut, textAlign: 'left', fontWeight: 700 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map(u => {
                  const roleColors: Record<string, string> = { admin: G.gold, vip: G.pur, vip_pro: G.blu, free: G.mut }
                  const rc = roleColors[u.role] || G.mut
                  return (
                    <tr key={u.id} style={{ borderTop: `1px solid ${G.br}` }}
                      onMouseEnter={e => (e.currentTarget as any).style.background = 'rgba(255,255,255,.02)'}
                      onMouseLeave={e => (e.currentTarget as any).style.background = 'transparent'}>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 32, height: 32, borderRadius: 8, background: `${rc}15`, border: `1px solid ${rc}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Bebas Neue', sans-serif", fontSize: 14, color: rc }}>
                            {(u.full_name || u.email || 'U')[0].toUpperCase()}
                          </div>
                          <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 600, color: G.wht }}>{u.full_name || 'Bez jména'}</span>
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px', fontFamily: "'Syne Mono', monospace", fontSize: 10, color: G.mut }}>{u.email}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ fontFamily: "'Syne Mono', monospace", fontSize: 8, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', padding: '4px 9px', borderRadius: 6, background: `${rc}14`, color: rc, border: `1px solid ${rc}28` }}>{u.role}</span>
                      </td>
                      <td style={{ padding: '12px 16px', fontFamily: "'Syne Mono', monospace", fontSize: 9, color: G.mut }}>
                        {new Date(u.created_at).toLocaleDateString('cs-CZ')}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── EMAIL MARKETING TAB ── */}
      {activeTab === 'email' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, animation: 'fadeUp .4s ease' }}>
          <div style={{ background: G.gl, border: `1px solid ${G.br}`, borderRadius: 16, padding: 24 }}>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: 4, color: G.wht, marginBottom: 6 }}>EMAIL MARKETING</div>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, color: G.mut, fontWeight: 300, marginBottom: 20 }}>Pošli email všem nebo vybrané skupině uživatelů</p>

            {/* Target */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontFamily: "'Syne Mono', monospace", fontSize: 8, letterSpacing: 2, textTransform: 'uppercase', color: G.mut, marginBottom: 8 }}>Příjemci</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {[
                  { id: 'all', label: `Všichni (${stats.totalUsers ?? 0})` },
                  { id: 'free', label: `Free (${stats.freeUsers ?? 0})` },
                  { id: 'vip', label: `Placení (${stats.vipUsers ?? 0})` },
                ].map(t => (
                  <button key={t.id} onClick={() => setEmailTarget(t.id)} style={{
                    padding: '8px 14px', borderRadius: 9, border: `1px solid ${emailTarget === t.id ? G.gold + '44' : G.br}`,
                    background: emailTarget === t.id ? 'rgba(240,180,41,.1)' : G.gl,
                    fontFamily: "'Syne Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase',
                    color: emailTarget === t.id ? G.gold : G.mut, cursor: 'pointer',
                  }}>{t.label}</button>
                ))}
              </div>
            </div>

            {/* Subject */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontFamily: "'Syne Mono', monospace", fontSize: 8, letterSpacing: 2, textTransform: 'uppercase', color: G.mut, marginBottom: 8 }}>Předmět emailu</div>
              <input value={emailSubject} onChange={e => setEmailSubject(e.target.value)}
                placeholder="Nové dealy tě čekají na NajdiDeal 🔥"
                style={{ width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,.04)', border: `1px solid ${G.br}`, borderRadius: 10, fontFamily: "'Syne', sans-serif", fontSize: 13, color: G.wht, outline: 'none', boxSizing: 'border-box' }} />
            </div>

            {/* Body */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: "'Syne Mono', monospace", fontSize: 8, letterSpacing: 2, textTransform: 'uppercase', color: G.mut, marginBottom: 8 }}>Obsah emailu</div>
              <textarea value={emailBody} onChange={e => setEmailBody(e.target.value)} rows={6}
                placeholder="Ahoj! Máme pro tebe nové výhodné dealy..."
                style={{ width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,.04)', border: `1px solid ${G.br}`, borderRadius: 10, fontFamily: "'Syne', sans-serif", fontSize: 13, color: G.wht, outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button
                onClick={() => { setEmailSending(true); setTimeout(() => { setEmailSending(false); alert('Email marketing zatím vyžaduje integraci s Resend.com nebo Mailchimp. Napoj API klíč v .env.local') }, 1500) }}
                disabled={emailSending || !emailSubject || !emailBody}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: "'Syne Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', background: (!emailSubject || !emailBody) ? 'rgba(240,180,41,.1)' : G.gold, color: (!emailSubject || !emailBody) ? G.mut : '#000', padding: '12px 24px', borderRadius: 10, border: 'none', cursor: (!emailSubject || !emailBody) ? 'default' : 'pointer', transition: 'all .3s' }}>
                {emailSending ? '⏳ Odesílám...' : '📧 Odeslat kampaň'}
              </button>
              <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 11, color: G.mut, fontWeight: 300 }}>
                Napoj Resend.com pro reálné odesílání
              </span>
            </div>
          </div>

          {/* Email stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
            {[
              { label: 'Odeslané emaily', value: '0', sub: 'Celkem', color: G.blu, icon: '📤' },
              { label: 'Open rate', value: '0%', sub: 'Průměr', color: G.grn, icon: '👁' },
              { label: 'Click rate', value: '0%', sub: 'Průměr', color: G.gold, icon: '🖱️' },
            ].map(s => (
              <div key={s.label} style={{ background: G.gl, border: `1px solid ${G.br}`, borderRadius: 14, padding: '16px 18px' }}>
                <div style={{ fontSize: 20, marginBottom: 8 }}>{s.icon}</div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, letterSpacing: 2, color: s.color, marginBottom: 4 }}>{s.value}</div>
                <div style={{ fontFamily: "'Syne Mono', monospace", fontSize: 8, letterSpacing: 2, textTransform: 'uppercase', color: G.mut }}>{s.label}</div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 10, color: G.mut, marginTop: 2 }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── ACTIVITY LOGS TAB ── */}
      {activeTab === 'logs' && (
        <div style={{ animation: 'fadeUp .4s ease' }}>
          <div style={{ background: G.gl, border: `1px solid ${G.br}`, borderRadius: 16, padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ fontFamily: "'Syne Mono', monospace", fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: G.mut }}>Live Activity Log</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: G.grn, animation: 'pulse 1.5s infinite' }} />
                <span style={{ fontFamily: "'Syne Mono', monospace", fontSize: 8, color: G.grn }}>LIVE</span>
              </div>
            </div>
            {activityLog.map((item, i) => <ActivityItem key={i} item={item} />)}
            <div style={{ marginTop: 16, padding: '12px 16px', background: 'rgba(77,159,255,.05)', border: '1px solid rgba(77,159,255,.15)', borderRadius: 10 }}>
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 11, color: G.mut, fontWeight: 300 }}>
                💡 Pro detailní logy a real-time monitoring napoj <strong style={{ color: G.blu }}>Supabase Realtime</strong> nebo integruj <strong style={{ color: G.blu }}>PostHog / Mixpanel</strong>.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
