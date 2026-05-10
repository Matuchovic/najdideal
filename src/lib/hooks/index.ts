'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/lib/types'

export function useAuth() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchProfile = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    setProfile(data)
  }, [supabase])

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) fetchProfile(user.id)
      else setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) fetchProfile(session.user.id)
      else { setProfile(null); setLoading(false) }
    })
    return () => subscription.unsubscribe()
  }, [fetchProfile, supabase])

  useEffect(() => { if (profile !== null) setLoading(false) }, [profile])

  return {
    profile,
    loading,
    isVip: profile?.role === 'vip' || profile?.role === 'admin',
    isAdmin: profile?.role === 'admin',
    isFree: profile?.role === 'free',
    isLoggedIn: !!profile,
    refetch: () => profile && fetchProfile(profile.id),
  }
}

export function useDeals(filters?: {
  category?: string
  access?: string
  featured?: boolean
  limit?: number
}) {
  const [deals, setDeals] = useState<import('@/lib/types').Deal[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    let query = supabase
      .from('deals')
      .select('*')
      .neq('status', 'draft')
      .order('created_at', { ascending: false })

    if (filters?.category) query = query.eq('category', filters.category)
    if (filters?.access)   query = query.eq('access_level', filters.access)
    if (filters?.featured) query = query.eq('is_featured', true)
    if (filters?.limit)    query = query.limit(filters.limit)

    query.then(({ data }) => {
      setDeals(data ?? [])
      setLoading(false)
    })
  }, [JSON.stringify(filters)])

  return { deals, loading }
}

export function useSavedDeals() {
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase.from('saved_deals').select('deal_id').eq('user_id', user.id)
        .then(({ data }) => {
          setSavedIds(new Set(data?.map(d => d.deal_id) ?? []))
        })
    })
  }, [])

  const toggleSave = async (dealId: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    if (savedIds.has(dealId)) {
      await supabase.from('saved_deals').delete()
        .eq('user_id', user.id).eq('deal_id', dealId)
      setSavedIds(prev => { const n = new Set(prev); n.delete(dealId); return n })
    } else {
      await supabase.from('saved_deals').insert({ user_id: user.id, deal_id: dealId })
      setSavedIds(prev => new Set([...prev, dealId]))
    }
  }

  return { savedIds, toggleSave, isSaved: (id: string) => savedIds.has(id) }
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<import('@/lib/types').Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase.from('notifications').select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20)
        .then(({ data }) => {
          setNotifications(data ?? [])
          setUnreadCount(data?.filter(n => !n.is_read).length ?? 0)
        })

      // Realtime subscription
      const channel = supabase.channel('notifications')
        .on('postgres_changes', {
          event: 'INSERT', schema: 'public', table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        }, payload => {
          setNotifications(prev => [payload.new as import('@/lib/types').Notification, ...prev])
          setUnreadCount(prev => prev + 1)
        })
        .subscribe()

      return () => { supabase.removeChannel(channel) }
    })
  }, [])

  const markAllRead = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('notifications').update({ is_read: true })
      .eq('user_id', user.id).eq('is_read', false)
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
    setUnreadCount(0)
  }

  return { notifications, unreadCount, markAllRead }
}
