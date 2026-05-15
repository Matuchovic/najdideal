'use client'
import { useEffect, useState } from 'react'
import type { Listing } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react'

const G = {
  gold:'#F0B429', grn:'#00E676', blu:'#4D9FFF', pur:'#9B5DE5', org:'#FF6B35', red:'#FF3B5C',
  wht:'#F0EBE1', mut:'rgba(240,235,225,.38)',
  gl:'rgba(255,255,255,.026)', br:'rgba(255,255,255,.07)',
}

const inputStyle = { width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.09)', borderRadius: 9, color: G.wht, fontFamily: 'Syne, sans-serif', fontSize: 13, outline: 'none' }
const labelStyle = { display: 'block' as const, fontFamily: 'Syne Mono, monospace', fontSize: 8, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' as const, color: G.mut, marginBottom: 6 }

export default function EditListingPage({ params }: { params: { id: string } }) {
  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [newImages, setNewImages] = useState<File[]>([])
  const [newImageUrls, setNewImageUrls] = useState<string[]>([])
  const [existingImages, setExistingImages] = useState<string[]>([])
  const [form, setForm] = useState({ title: '', description: '', price: '', price_negotiable: false, condition: '', location: '', phone: '', email: '' })
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.push('/login'); return }
      const { data } = await supabase.from('listings').select('*').eq('id', params.id).eq('user_id', user.id).single()
      if (!data) { router.push('/marketplace/moje'); return }
      setListing(data)
      setExistingImages(data.images ?? [])
      setForm({
        title: data.title ?? '',
        description: data.description ?? '',
        price: data.price ? String(data.price) : '',
        price_negotiable: data.price_negotiable ?? false,
        condition: data.condition ?? '',
        location: data.location ?? '',
        phone: data.phone ?? '',
        email: data.email ?? '',
      })
      setLoading(false)
    })
  }, [params.id])

  const handleNewImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, 8 - existingImages.length)
    setNewImages(files)
    setNewImageUrls(files.map(f => URL.createObjectURL(f)))
  }

  const removeExisting = (url: string) => setExistingImages(p => p.filter(u => u !== url))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Upload nové fotky
    const uploaded: string[] = []
    for (const file of newImages) {
      const ext = file.name.split('.').pop()
      const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error } = await supabase.storage.from('listings').upload(path, file)
      if (!error) {
        const { data } = supabase.storage.from('listings').getPublicUrl(path)
        uploaded.push(data.publicUrl)
      }
    }

    await supabase.from('listings').update({
      title: form.title,
      description: form.description,
      price: form.price ? parseFloat(form.price.replace(/\s/g, '').replace(/\./g, '').replace(',', '.')) : null,
      price_negotiable: form.price_negotiable,
      condition: form.condition || null,
      location: form.location,
      phone: form.phone,
      email: form.email,
      images: [...existingImages, ...uploaded],
      updated_at: new Date().toISOString(),
    }).eq('id', params.id)

    setSuccess(true)
    setTimeout(() => router.push('/marketplace/moje'), 1800)
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{ width: 36, height: 36, border: '2px solid rgba(240,180,41,.2)', borderTop: '2px solid #F0B429', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  if (success) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <div>
        <div style={{ fontSize: 64, marginBottom: 20 }}>✅</div>
        <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 42, letterSpacing: 4, color: G.wht, marginBottom: 8 }}>INZERÁT UPRAVEN</h2>
        <p style={{ fontSize: 13, color: G.mut }}>Přesměrovávám…</p>
      </div>
    </div>
  )

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', paddingBottom: 80 }}>
      <Link href="/marketplace/moje" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'Syne Mono, monospace', fontSize: 9, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: G.mut, textDecoration: 'none', marginBottom: 24, padding: '7px 12px', border: `1px solid ${G.br}`, borderRadius: 6, background: G.gl }}>
        <ArrowLeft size={12} /> Zpět na moje inzeráty
      </Link>

      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: 'Syne Mono, monospace', fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', color: G.gold, marginBottom: 8 }}>✏️ Úprava inzerátu</div>
        <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(32px,6vw,52px)', letterSpacing: 4, color: G.wht, lineHeight: 1 }}>
          UPRAVIT <span style={{ color: G.gold }}>INZERÁT</span>
        </h1>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* ZÁKLADNÍ INFO */}
        <div style={{ background: G.gl, backdropFilter: 'blur(24px)', border: `1px solid ${G.br}`, borderRadius: 14, padding: 22, display: 'flex', flexDirection: 'column', gap: 14, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,rgba(240,180,41,.2),transparent)' }} />
          <div>
            <label style={labelStyle}>Název inzerátu *</label>
            <input required value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Popis</label>
            <textarea value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} rows={4} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 12 }}>
            <div>
              <label style={labelStyle}>Cena (Kč)</label>
              <input value={form.price} onChange={e => setForm(f => ({...f, price: e.target.value}))} style={inputStyle} />
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

        {/* FOTKY */}
        <div style={{ background: G.gl, backdropFilter: 'blur(24px)', border: `1px solid ${G.br}`, borderRadius: 14, padding: 22, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ fontFamily: 'Syne Mono, monospace', fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: G.gold }}>📸 Fotografie</div>

          {/* Existující fotky */}
          {existingImages.length > 0 && (
            <div>
              <label style={{ ...labelStyle, marginBottom: 10 }}>Současné fotky</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(90px,1fr))', gap: 8 }}>
                {existingImages.map((url, i) => (
                  <div key={i} style={{ position: 'relative', aspectRatio: '1', borderRadius: 10, overflow: 'hidden', border: `1px solid ${G.br}` }}>
                    <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button type="button" onClick={() => removeExisting(url)} style={{ position: 'absolute', top: 4, right: 4, width: 22, height: 22, borderRadius: '50%', background: 'rgba(255,59,92,.8)', border: 'none', color: '#fff', fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Nové fotky */}
          {existingImages.length < 8 && (
            <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '20px', border: '2px dashed rgba(240,180,41,.25)', borderRadius: 12, cursor: 'pointer', background: 'rgba(240,180,41,.03)' }}>
              <div style={{ fontSize: 24 }}>📁</div>
              <div style={{ fontFamily: 'Syne Mono, monospace', fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: G.gold }}>Přidat další fotky</div>
              <div style={{ fontFamily: 'Syne Mono, monospace', fontSize: 8, color: G.mut }}>Max {8 - existingImages.length} fotek</div>
              <input type="file" accept="image/*" multiple onChange={handleNewImages} style={{ display: 'none' }} />
            </label>
          )}

          {newImageUrls.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(90px,1fr))', gap: 8 }}>
              {newImageUrls.map((url, i) => (
                <div key={i} style={{ position: 'relative', aspectRatio: '1', borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(0,230,118,.2)' }}>
                  <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button type="button" onClick={() => { setNewImages(p => p.filter((_,j) => j !== i)); setNewImageUrls(p => p.filter((_,j) => j !== i)) }} style={{ position: 'absolute', top: 4, right: 4, width: 22, height: 22, borderRadius: '50%', background: 'rgba(0,0,0,.7)', border: 'none', color: '#fff', fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* KONTAKT */}
        <div style={{ background: G.gl, backdropFilter: 'blur(24px)', border: `1px solid ${G.br}`, borderRadius: 14, padding: 22, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ fontFamily: 'Syne Mono, monospace', fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: G.gold }}>📞 Kontakt</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 12 }}>
            <div>
              <label style={labelStyle}>Telefon</label>
              <input value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))} placeholder="+420 777 123 456" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Email</label>
              <input value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} style={inputStyle} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Lokalita</label>
            <input value={form.location} onChange={e => setForm(f => ({...f, location: e.target.value}))} style={inputStyle} />
          </div>
        </div>

        <button type="submit" disabled={saving} style={{ width: '100%', padding: '16px', borderRadius: 10, border: 'none', cursor: 'pointer', fontFamily: 'Syne Mono, monospace', fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', background: G.gold, color: '#000', boxShadow: '0 8px 28px rgba(240,180,41,.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          {saving ? <><div style={{ width: 16, height: 16, border: '2px solid rgba(0,0,0,.3)', borderTop: '2px solid #000', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /> Ukládám…</> : <><Save size={16} /> Uložit změny</>}
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </button>
      </form>
    </div>
  )
}