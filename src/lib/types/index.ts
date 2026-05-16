// ============================================================
// NajdiDeal – Kompletní TypeScript typy
// ============================================================

export type UserRole = 'free' | 'vip' | 'admin'
export type DealCategory = 'marketplace_flip' | 'ai_opportunity' | 'trend_product' | 'profit_alert' | 'affiliate' | 'dropshipping' | 'crypto' | 'other'
export type DealStatus = 'active' | 'expired' | 'sold_out' | 'draft' | 'featured'
export type DealAccess = 'free' | 'vip'
export type AlertType = 'deal' | 'price_drop' | 'trend' | 'ai' | 'system' | 'vip'
export type MembershipStatus = 'active' | 'cancelled' | 'expired' | 'trial'
export type NotificationType = 'deal' | 'alert' | 'system' | 'membership' | 'welcome'

// ============================================================
// DATABASE TYPES
// ============================================================

export interface Profile {
  id: string
  email: string
  full_name: string | null
  username: string | null
  avatar_url: string | null
  role: UserRole
  bio: string | null
  telegram_handle: string | null
  phone: string | null
  city: string | null
  country: string
  total_profit: number
  deals_saved: number
  deals_viewed: number
  streak_days: number
  last_active: string
  onboarded: boolean
  notifications_enabled: boolean
  email_alerts: boolean
  created_at: string
  updated_at: string
}

export interface Deal {
  id: string
  title: string
  slug: string
  description: string | null
  short_desc: string | null
  category: DealCategory
  category_id: string | null
  status: DealStatus
  access_level: DealAccess
  buy_price: number | null
  sell_price: number | null
  profit_amount: number | null
  profit_percent: number | null
  original_price: number | null
  image_url: string | null
  image_urls: string[]
  emoji: string
  source_url: string | null
  source_name: string | null
  tags: string[]
  is_featured: boolean
  is_hot: boolean
  is_trending: boolean
  trend_percent: number | null
  view_count: number
  save_count: number
  click_count: number
  expires_at: string | null
  created_at: string
  updated_at: string
  created_by: string | null
}

export interface Alert {
  id: string
  title: string
  body: string
  type: AlertType
  access_level: DealAccess
  deal_id: string | null
  image_url: string | null
  cta_text: string | null
  cta_url: string | null
  is_pinned: boolean
  is_active: boolean
  read_count: number
  created_at: string
  created_by: string | null
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  color: string
  deal_count: number
  is_active: boolean
  sort_order: number
  created_at: string
}

export interface SavedDeal {
  id: string
  user_id: string
  deal_id: string
  notes: string | null
  created_at: string
  deal?: Deal
}

export interface Membership {
  id: string
  user_id: string
  status: MembershipStatus
  plan: string
  price_paid: number | null
  currency: string
  started_at: string
  expires_at: string | null
  cancelled_at: string | null
  stripe_customer_id: string | null
  stripe_sub_id: string | null
  auto_renew: boolean
  created_at: string
  updated_at: string
}

export interface Notification {
  id: string
  user_id: string
  type: NotificationType
  title: string
  body: string | null
  image_url: string | null
  link: string | null
  is_read: boolean
  created_at: string
}

export interface ActivityItem {
  id: string
  user_id: string
  action_type: string
  title: string
  subtitle: string | null
  icon: string | null
  metadata: Record<string, unknown> | null
  created_at: string
}

export interface AdminLog {
  id: string
  admin_id: string
  action: string
  entity_type: string | null
  entity_id: string | null
  details: Record<string, unknown> | null
  ip_address: string | null
  created_at: string
}

// ============================================================
// FORM TYPES
// ============================================================

export interface LoginForm {
  email: string
  password: string
}

export interface RegisterForm {
  email: string
  password: string
  full_name: string
  username?: string
}

export interface DealForm {
  title: string
  description: string
  short_desc: string
  category: DealCategory
  category_id?: string
  status: DealStatus
  access_level: DealAccess
  buy_price?: number
  sell_price?: number
  profit_amount?: number
  profit_percent?: number
  original_price?: number
  image_url?: string
  emoji: string
  source_url?: string
  source_name?: string
  tags: string[]
  is_featured: boolean
  is_hot: boolean
  is_trending: boolean
  trend_percent?: number
  expires_at?: string
}

export interface AlertForm {
  title: string
  body: string
  type: AlertType
  access_level: DealAccess
  deal_id?: string
  image_url?: string
  cta_text?: string
  cta_url?: string
  is_pinned: boolean
}

export interface ProfileUpdateForm {
  full_name?: string
  username?: string
  bio?: string
  telegram_handle?: string
  phone?: string
  city?: string
  notifications_enabled?: boolean
  email_alerts?: boolean
}

// ============================================================
// API RESPONSE TYPES
// ============================================================

export interface ApiResponse<T> {
  data: T | null
  error: string | null
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  pageSize: number
  hasMore: boolean
}

// ============================================================
// DASHBOARD STATS
// ============================================================

export interface DashboardStats {
  totalDeals: number
  newDealsToday: number
  savedDeals: number
  unreadNotifications: number
  memberSince: string
  role: UserRole
  totalProfit: number
  streakDays: number
}

export interface AdminStats {
  totalUsers: number
  vipUsers: number
  freeUsers: number
  totalDeals: number
  activeDeals: number
  totalAlerts: number
  totalSaves: number
  todayViews: number
  monthlyRevenue: number
  newUsersToday: number
}

// ============================================================
// UI TYPES
// ============================================================

export interface NavItem {
  label: string
  href: string
  icon: string
  badge?: number
  vipOnly?: boolean
  adminOnly?: boolean
}

export interface DealCardProps {
  deal: Deal
  isSaved?: boolean
  onSave?: (dealId: string) => void
  showVipBadge?: boolean
  compact?: boolean
}

export interface FilterOptions {
  category?: DealCategory
  access?: DealAccess
  status?: DealStatus
  sortBy?: 'newest' | 'profit' | 'popular' | 'trending'
  search?: string
  page?: number
  pageSize?: number
}

// ============================================================
// CATEGORY META
// ============================================================

export const CATEGORY_META: Record<DealCategory, { label: string; icon: string; color: string; badgeClass: string }> = {
  marketplace_flip: { label: 'Bazar & Flip',     icon: '🔄', color: '#F0B429', badgeClass: 'badge-gold' },
  ai_opportunity:   { label: 'Elektronika',      icon: '📱', color: '#4D9FFF', badgeClass: 'badge-blue' },
  trend_product:    { label: 'Auta & Moto',      icon: '🚗', color: '#00E676', badgeClass: 'badge-green' },
  profit_alert:     { label: 'Sport & Outdoor',  icon: '⚽', color: '#FF4444', badgeClass: 'badge-red' },
  affiliate:        { label: 'Oblečení',         icon: '👕', color: '#9C6FE4', badgeClass: 'badge-purple' },
  dropshipping:     { label: 'Nábytek & Dům',   icon: '🛋️', color: '#00BFA5', badgeClass: 'badge-teal' },
  crypto:           { label: 'Dětské',           icon: '🧸', color: '#F7931A', badgeClass: 'badge-orange' },
  other:            { label: 'Ostatní',          icon: '📦', color: '#888',    badgeClass: 'badge-gray' },
}

export const ALERT_TYPE_META: Record<AlertType, { label: string; icon: string; color: string }> = {
  deal:        { label: 'Deal',        icon: '💰', color: '#F5B800' },
  price_drop:  { label: 'Pokles ceny', icon: '📉', color: '#00E676' },
  trend:       { label: 'Trend',       icon: '📈', color: '#4D9FFF' },
  ai:          { label: 'AI',          icon: '🤖', color: '#9C6FE4' },
  system:      { label: 'Systém',      icon: '🔔', color: '#888' },
  vip:         { label: 'VIP',         icon: '👑', color: '#F5B800' },
}

export const ROLE_META: Record<UserRole, { label: string; icon: string; color: string }> = {
  free:  { label: 'Free',  icon: '🆓', color: '#888' },
  vip:   { label: 'VIP',   icon: '👑', color: '#F5B800' },
  admin: { label: 'Admin', icon: '⚙️', color: '#FF4444' },
}

export interface Listing {
  id: string
  user_id: string
  title: string
  description: string | null
  price: number
  original_price: number | null
  category: string
  condition: string
  images: string[]
  location: string | null
  is_active: boolean
  is_boosted: boolean
  boost_until: string | null
  boost_expires_at: string | null
  view_count: number
  views_count: number
  save_count: number
  price_negotiable: boolean
  phone: string | null
  email: string | null
  created_at: string
  updated_at: string
  profiles?: Profile
}

export interface ListingMessage {
  id: string
  conversation_id: string
  listing_id: string
  sender_id: string
  receiver_id: string
  message: string
  content: string | null
  is_read: boolean
  created_at: string
  sender?: Profile
}

export interface ChatMessage {
  id: string
  session_id: string
  role: 'user' | 'admin'
  message: string
  created_at: string
}
