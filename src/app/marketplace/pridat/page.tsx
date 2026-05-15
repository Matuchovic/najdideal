'use client'
import { useEffect, useState } from 'react'
import type { Profile } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, Lock } from 'lucide-react'


const G = {
  gold:'#F0B429', gold2:'rgba(240,180,41,.08)', gold4:'rgba(240,180,41,.18)',
  grn:'#00E676', blu:'#4D9FFF', pur:'#9B5DE5', org:'#FF6B35',
  wht:'#F0EBE1', mut:'rgba(240,235,225,.38)',
  gl:'rgba(255,255,255,.026)', br:'rgba(255,255,255,.07)',
}

const CATEGORIES = [
  { key: 'obleceni', label: 'Oblečení & Móda', emoji: '👗', minRole: 'free' },
  { key: 'ostatni', label: 'Ostatní', emoji: '🛒', minRole: 'free' },
  { key: 'elektronika', label: 'Elektronika', emoji: '📱', minRole: 'vip' },
  { key: 'auta', label: 'Auta & Motorky', emoji: '🚗', minRole: 'vip' },
  { key: 'nemovitosti', label: 'Nemovitosti', emoji: '🏠', minRole: 'vip_pro' },
]

const TIER_LEVEL: Record<string,number> = { free:1, vip:2, vip_pro:3, vip_ultra:4, vip_max:5, admin:99 }
const TIER_COLOR: Record<string,string> = { free:G.mut, vip:G.gold, vip_pro:G.blu, vip_ultra:G.pur, vip_max:G.org }
const TIER_LABEL: Record<string,string> = { free:'FREE', vip:'VIP', vip_pro:'VIP PRO', vip_ultra:'VIP ULTRA', vip_max:'VIP MAX' }

function hasAccess(userRole: string, required: string) {
  return (TIER_LEVEL[userRole] ?? 1) >= (TIER_LEVEL[required] ?? 1)
}

const inputStyle = { width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.09)', borderRadius: 9, color: G.wht, fontFamily: 'Syne, sans-serif', fontSize: 13, outline: 'none' }
const labelStyle = { display: 'block' as const, fontFamily: 'Syne Mono, monospace', fontSize: 8, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' as const, color: G.mut, marginBottom: 6 }

export default function AddListingPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', price: '', price_negotiable: false, category: 'ostatni', condition: '', location: '', phone: '', email: '' })
  const [images, setImages] = useState<File[]>([])
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [uploadingImages, setUploadingImages] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.push('/login'); return }
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile({ ...data, email: user.email })
      setForm(f => ({ ...f, email: user.email ?? '' }))
      setLoading(false)
    })
  }, [])

  const userRole = profile?.role ?? 'free'
  const selectedCat = CATEGORIES.find(c => c.key === form.category)
  const canSubmit = selectedCat ? hasAccess(userRole, selectedCat.minRole) : true

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, 8)
    setImages(files)
    // Preview
    const urls = files.map(f => URL.createObjectURL(f))
    setImageUrls(urls)
  }

  const uploadImages = async (userId: string): Promise<string[]> => {
    if (images.length === 0) return []
    setUploadingImages(true)
    const supabase = createClient()
    const uploaded: string[] = []
    for (const file of images) {
      try {
        const ext = file.name.split('.').pop() ?? 'jpg'
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
        const path = `${userId}/${fileName}`
        console.log('Uploading:', path, 'size:', file.size)
        const { data, error } = await supabase.storage.from('listings').upload(path, file, { 
          cacheControl: '3600', 
          upsert: true,
          contentType: file.type
        })
        console.log('Upload result:', data, error)
        if (!error && data) {
          const { data: urlData } = supabase.storage.from('listings').getPublicUrl(path)
          console.log('Public URL:', urlData.publicUrl)
          uploaded.push(urlData.publicUrl)
        } else if (error) {
          console.error('Upload error:', error)
        }
      } catch (e) {
        console.error('Upload exception:', e)
      }
    }
    setUploadingImages(false)
    console.log('Total uploaded:', uploaded.length)
    return uploaded
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    setSubmitting(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const uploadedImages = await uploadImages(user.id)
    const { error } = await supabase.from('listings').insert({
      user_id: user.id,
      title: form.title,
      description: form.description,
      price: form.price ? parseFloat(form.price.replace(/\s/g, '').replace(/\./g, '').replace(',', '.')) : null,
      price_negotiable: form.price_negotiable,
      category: form.category,
      condition: form.condition || null,
      location: form.location,
      phone: form.phone,
      email: form.email,
      images: uploadedImages,
      status: 'active',
    })
    if (error) { alert('Chyba: ' + error.message); setSubmitting(false); return }
    setSuccess(true)
    setTimeout(() => router.push('/marketplace'), 2200)
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{ width: 36, height: 36, border: '2px solid rgba(240,180,41,.2)', borderTop: '2px solid #F0B429', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  if (success) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <style>{`@keyframes scaleIn{from{opacity:0;transform:scale(.6)}to{opacity:1;transform:scale(1)}}@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(0,230,118,.08)', border: '2px solid rgba(0,230,118,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', animation: 'scaleIn .6s cubic-bezier(.34,1.56,.64,1) both', fontSize: 36 }}>✅</div>
        <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 42, letterSpacing: 4, color: G.wht, marginBottom: 8, animation: 'fadeUp .5s .3s ease both', opacity: 0 }}>INZERÁT PŘIDÁN</h2>
        <p style={{ fontSize: 13, color: G.mut, animation: 'fadeUp .5s .5s ease both', opacity: 0 }}>Přesměrovávám na marketplace…</p>
      </div>
    </div>
  )

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', paddingBottom: 80 }}>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`}</style>

      <Link href="/marketplace" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'Syne Mono, monospace', fontSize: 9, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: G.mut, textDecoration: 'none', marginBottom: 24, padding: '7px 12px', border: `1px solid ${G.br}`, borderRadius: 6, background: G.gl }}>
        <ArrowLeft size={12} /> Zpět
      </Link>

      <div style={{ marginBottom: 28, animation: 'fadeUp .5s ease both' }}>
        <div style={{ fontFamily: 'Syne Mono, monospace', fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', color: G.gold, marginBottom: 8 }}>+ Nový inzerát</div>
        <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(32px,6vw,52px)', letterSpacing: 4, color: G.wht, lineHeight: 1 }}>
          PŘIDAT <span style={{ color: G.gold }}>INZERÁT</span>
        </h1>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14, animation: 'fadeUp .5s .1s ease both', opacity: 0 }}>

        {/* CATEGORY */}
        <div style={{ background: G.gl, backdropFilter: 'blur(24px)', border: `1px solid ${G.br}`, borderRadius: 14, padding: 22, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,rgba(240,180,41,.2),transparent)' }} />
          <label style={{ ...labelStyle, marginBottom: 12 }}>Kategorie</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 8 }}>
            {CATEGORIES.map(c => {
              const allowed = hasAccess(userRole, c.minRole)
              const selected = form.category === c.key
              return (
                <button key={c.key} type="button" onClick={() => allowed && setForm(f => ({ ...f, category: c.key }))} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 10, border: `1px solid ${selected ? 'rgba(240,180,41,.35)' : (allowed ? G.br : 'rgba(255,255,255,.04)')}`, background: selected ? 'rgba(240,180,41,.08)' : (allowed ? 'rgba(255,255,255,.03)' : 'rgba(255,255,255,.01)'), color: selected ? G.gold : (allowed ? G.wht : G.mut), cursor: allowed ? 'pointer' : 'not-allowed', transition: 'all .2s', opacity: allowed ? 1 : .5 }}>
                  <span style={{ fontSize: 18 }}>{c.emoji}</span>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 12, fontWeight: 600 }}>{c.label}</div>
                    {c.minRole !== 'free' && <div style={{ fontFamily: 'Syne Mono, monospace', fontSize: 7, color: allowed ? (selected ? G.gold : G.mut) : TIER_COLOR[c.minRole], letterSpacing: 1, textTransform: 'uppercase' }}>{TIER_LABEL[c.minRole]}{!allowed && ' 🔒'}</div>}
                  </div>
                </button>
              )
            })}
          </div>
          {!canSubmit && (
            <div style={{ marginTop: 14, padding: '12px 16px', borderRadius: 10, background: 'rgba(77,159,255,.06)', border: '1px solid rgba(77,159,255,.2)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <Lock size={13} color={G.blu} />
              <span style={{ fontSize: 12, color: G.mut, fontWeight: 300 }}>Pro tuto kategorii potřebuješ {TIER_LABEL[selectedCat?.minRole ?? 'vip']}. <Link href="/vip" style={{ color: G.blu, textDecoration: 'none', fontWeight: 600 }}>Upgradovat →</Link></span>
            </div>
          )}
        </div>

        {/* BASIC INFO */}
        <div style={{ background: G.gl, backdropFilter: 'blur(24px)', border: `1px solid ${G.br}`, borderRadius: 14, padding: 22, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ position: 'absolute', display: 'none' }} />
          <div>
            <label style={labelStyle}>Název inzerátu *</label>
            <input required value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} placeholder="např. iPhone 15 Pro 256GB, Byt 2+1 Praha…" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Popis</label>
            <textarea value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} placeholder="Popiš co prodáváš, stav, co je součástí…" rows={4} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 12 }}>
            <div>
              <label style={labelStyle}>Cena (Kč)</label>
              <input value={form.price} onChange={e => setForm(f => ({...f, price: e.target.value}))} placeholder="např. 15000" type="text" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Stav</label>
              <select value={form.condition} onChange={e => setForm(f => ({...f, condition: e.target.value}))} style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="">Nevyplněno</option>
                <option value="Nové">Nové</option>
                <option value="Jako nové">Jako nové</option>
                <option value="Použité">Použité</option>
                <option value="Poškozené">Poškozené</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <input type="checkbox" id="neg" checked={form.price_negotiable} onChange={e => setForm(f => ({...f, price_negotiable: e.target.checked}))} style={{ width: 16, height: 16, cursor: 'pointer' }} />
            <label htmlFor="neg" style={{ ...labelStyle, marginBottom: 0, cursor: 'pointer', color: G.wht }}>Možná dohoda o ceně</label>
          </div>
        </div>

        {/* CONTACT */}
        <div style={{ background: G.gl, backdropFilter: 'blur(24px)', border: `1px solid ${G.br}`, borderRadius: 14, padding: 22, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ fontFamily: 'Syne Mono, monospace', fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: G.gold, marginBottom: 4 }}>📞 Kontaktní údaje</div>
          <p style={{ fontSize: 11, color: G.mut, fontWeight: 300, marginBottom: 4 }}>Tyto údaje uvidí pouze VIP PRO+ členové.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 12 }}>
            <div>
              <label style={labelStyle}>Telefon</label>
              <input value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))} placeholder="+420 777 123 456" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Email</label>
              <input value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} placeholder="vas@email.cz" style={inputStyle} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Lokalita</label>
            <input value={form.location} onChange={e => setForm(f => ({...f, location: e.target.value}))} placeholder="např. Praha, Brno, Ostrava…" style={inputStyle} />
          </div>
        </div>

        {/* FOTO UPLOAD */}
        <div style={{ background: G.gl, backdropFilter: 'blur(24px)', border: `1px solid ${G.br}`, borderRadius: 14, padding: 22, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ fontFamily: 'Syne Mono, monospace', fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: G.gold }}>📸 Fotografie (max. 8)</div>
          <p style={{ fontSize: 11, color: G.mut, fontWeight: 300, marginTop: -8 }}>Přidej fotky produktu. Inzeráty s fotkami se prodávají rychleji.</p>
          <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '28px 20px', border: '2px dashed rgba(240,180,41,.25)', borderRadius: 12, cursor: 'pointer', background: 'rgba(240,180,41,.03)', transition: 'all .2s' }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(240,180,41,.5)'; (e.currentTarget as HTMLElement).style.background = 'rgba(240,180,41,.06)' }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(240,180,41,.25)'; (e.currentTarget as HTMLElement).style.background = 'rgba(240,180,41,.03)' }}>
            <div style={{ fontSize: 32 }}>📁</div>
            <div style={{ fontFamily: 'Syne Mono, monospace', fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: G.gold }}>Klikni pro výběr fotek</div>
            <div style={{ fontFamily: 'Syne Mono, monospace', fontSize: 8, color: G.mut }}>JPG, PNG, WEBP · Max 8 fotek</div>
            <input type="file" accept="image/*" multiple onChange={handleImageChange} style={{ display: 'none' }} />
          </label>
          {imageUrls.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(100px,1fr))', gap: 8 }}>
              {imageUrls.map((url, i) => (
                <div key={i} style={{ position: 'relative', aspectRatio: '1', borderRadius: 10, overflow: 'hidden', border: `1px solid ${G.br}` }}>
                  <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button type="button" onClick={() => { setImages(p => p.filter((_,j) => j !== i)); setImageUrls(p => p.filter((_,j) => j !== i)) }} style={{ position: 'absolute', top: 4, right: 4, width: 22, height: 22, borderRadius: '50%', background: 'rgba(0,0,0,.7)', border: 'none', color: '#fff', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>✕</button>
                </div>
              ))}
            </div>
          )}
          {uploadingImages && <div style={{ fontFamily: 'Syne Mono, monospace', fontSize: 9, color: G.gold, letterSpacing: 1, textAlign: 'center' }}>⏳ Nahrávám fotky…</div>}
        </div>

        <button type="submit" disabled={submitting || !canSubmit || uploadingImages} style={{ width: '100%', padding: '16px', borderRadius: 10, border: 'none', cursor: canSubmit ? 'pointer' : 'not-allowed', fontFamily: 'Syne Mono, monospace', fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', background: canSubmit ? G.gold : 'rgba(255,255,255,.08)', color: canSubmit ? '#000' : G.mut, boxShadow: canSubmit ? '0 8px 28px rgba(240,180,41,.25)' : 'none', transition: 'all .3s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          {submitting || uploadingImages ? <><div style={{ width: 16, height: 16, border: '2px solid rgba(0,0,0,.3)', borderTop: '2px solid #000', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /> {uploadingImages ? 'Nahrávám fotky…' : 'Přidávám…'}</> : <><Plus size={16} /> Přidat inzerát</>}
        </button>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </form>
    </div>
  )
}