'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function LogoutButton() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const logout = async () => {
    setLoading(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }
  return (
    <button onClick={logout} disabled={loading} style={{display:'inline-flex',alignItems:'center',justifyContent:'center',fontSize:15,color:'rgba(255,59,92,.6)',cursor:'pointer',width:32,height:32,border:'1px solid rgba(255,59,92,.16)',borderRadius:8,background:'rgba(255,59,92,.04)',flexShrink:0,transition:'all .2s'}}>
      {loading ? '…' : '🚪'}
    </button>
  )
}