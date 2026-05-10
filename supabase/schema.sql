-- ============================================================
-- NajdiDeal – Kompletní databázové schema
-- Verze: 1.0.0
-- ============================================================

-- ============================================================
-- EXTENSIONS
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================================
-- ENUMS
-- ============================================================
CREATE TYPE user_role AS ENUM ('free', 'vip', 'admin');
CREATE TYPE deal_category AS ENUM ('marketplace_flip', 'ai_opportunity', 'trend_product', 'profit_alert', 'affiliate', 'dropshipping', 'crypto', 'other');
CREATE TYPE deal_status AS ENUM ('active', 'expired', 'sold_out', 'draft', 'featured');
CREATE TYPE deal_access AS ENUM ('free', 'vip');
CREATE TYPE alert_type AS ENUM ('deal', 'price_drop', 'trend', 'ai', 'system', 'vip');
CREATE TYPE membership_status AS ENUM ('active', 'cancelled', 'expired', 'trial');
CREATE TYPE notification_type AS ENUM ('deal', 'alert', 'system', 'membership', 'welcome');

-- ============================================================
-- PROFILES TABLE
-- ============================================================
CREATE TABLE profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email           TEXT NOT NULL,
  full_name       TEXT,
  username        TEXT UNIQUE,
  avatar_url      TEXT,
  role            user_role NOT NULL DEFAULT 'free',
  bio             TEXT,
  telegram_handle TEXT,
  phone           TEXT,
  city            TEXT,
  country         TEXT DEFAULT 'CZ',
  total_profit    NUMERIC(12,2) DEFAULT 0,
  deals_saved     INT DEFAULT 0,
  deals_viewed    INT DEFAULT 0,
  streak_days     INT DEFAULT 0,
  last_active     TIMESTAMPTZ DEFAULT NOW(),
  onboarded       BOOLEAN DEFAULT FALSE,
  notifications_enabled BOOLEAN DEFAULT TRUE,
  email_alerts    BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- CATEGORIES TABLE
-- ============================================================
CREATE TABLE categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  description TEXT,
  icon        TEXT,
  color       TEXT DEFAULT '#F5B800',
  deal_count  INT DEFAULT 0,
  is_active   BOOLEAN DEFAULT TRUE,
  sort_order  INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- DEALS TABLE
-- ============================================================
CREATE TABLE deals (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title           TEXT NOT NULL,
  slug            TEXT UNIQUE NOT NULL,
  description     TEXT,
  short_desc      TEXT,
  category        deal_category NOT NULL DEFAULT 'marketplace_flip',
  category_id     UUID REFERENCES categories(id),
  status          deal_status NOT NULL DEFAULT 'active',
  access_level    deal_access NOT NULL DEFAULT 'free',

  -- Pricing info
  buy_price       NUMERIC(12,2),
  sell_price      NUMERIC(12,2),
  profit_amount   NUMERIC(12,2),
  profit_percent  NUMERIC(6,2),
  original_price  NUMERIC(12,2),

  -- Media
  image_url       TEXT,
  image_urls      TEXT[] DEFAULT '{}',
  emoji           TEXT DEFAULT '💰',

  -- Meta
  source_url      TEXT,
  source_name     TEXT,
  tags            TEXT[] DEFAULT '{}',
  is_featured     BOOLEAN DEFAULT FALSE,
  is_hot          BOOLEAN DEFAULT FALSE,
  is_trending     BOOLEAN DEFAULT FALSE,
  trend_percent   NUMERIC(6,2),

  -- Stats
  view_count      INT DEFAULT 0,
  save_count      INT DEFAULT 0,
  click_count     INT DEFAULT 0,

  -- Timestamps
  expires_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  created_by      UUID REFERENCES profiles(id)
);

-- ============================================================
-- ALERTS TABLE
-- ============================================================
CREATE TABLE alerts (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title        TEXT NOT NULL,
  body         TEXT NOT NULL,
  type         alert_type NOT NULL DEFAULT 'deal',
  access_level deal_access NOT NULL DEFAULT 'free',
  deal_id      UUID REFERENCES deals(id) ON DELETE SET NULL,
  image_url    TEXT,
  cta_text     TEXT,
  cta_url      TEXT,
  is_pinned    BOOLEAN DEFAULT FALSE,
  is_active    BOOLEAN DEFAULT TRUE,
  read_count   INT DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  created_by   UUID REFERENCES profiles(id)
);

-- ============================================================
-- SAVED DEALS TABLE
-- ============================================================
CREATE TABLE saved_deals (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  deal_id    UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  notes      TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, deal_id)
);

-- ============================================================
-- MEMBERSHIPS TABLE
-- ============================================================
CREATE TABLE memberships (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status            membership_status NOT NULL DEFAULT 'active',
  plan              TEXT NOT NULL DEFAULT 'vip_monthly',
  price_paid        NUMERIC(10,2),
  currency          TEXT DEFAULT 'CZK',
  started_at        TIMESTAMPTZ DEFAULT NOW(),
  expires_at        TIMESTAMPTZ,
  cancelled_at      TIMESTAMPTZ,
  stripe_customer_id TEXT,
  stripe_sub_id     TEXT,
  auto_renew        BOOLEAN DEFAULT TRUE,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- NOTIFICATIONS TABLE
-- ============================================================
CREATE TABLE notifications (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type       notification_type NOT NULL DEFAULT 'system',
  title      TEXT NOT NULL,
  body       TEXT,
  image_url  TEXT,
  link       TEXT,
  is_read    BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- DEAL VIEWS ANALYTICS
-- ============================================================
CREATE TABLE deal_views (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deal_id    UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  user_id    UUID REFERENCES profiles(id) ON DELETE SET NULL,
  ip_hash    TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ADMIN LOGS
-- ============================================================
CREATE TABLE admin_logs (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id    UUID NOT NULL REFERENCES profiles(id),
  action      TEXT NOT NULL,
  entity_type TEXT,
  entity_id   UUID,
  details     JSONB,
  ip_address  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- USER ACTIVITY FEED
-- ============================================================
CREATE TABLE activity_feed (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  title       TEXT NOT NULL,
  subtitle    TEXT,
  icon        TEXT,
  metadata    JSONB,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_deals_status ON deals(status);
CREATE INDEX idx_deals_category ON deals(category);
CREATE INDEX idx_deals_access ON deals(access_level);
CREATE INDEX idx_deals_featured ON deals(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_deals_created ON deals(created_at DESC);
CREATE INDEX idx_deals_slug ON deals(slug);
CREATE INDEX idx_deals_tags ON deals USING GIN(tags);
CREATE INDEX idx_deals_title_search ON deals USING GIN(to_tsvector('simple', title));

CREATE INDEX idx_alerts_active ON alerts(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_alerts_type ON alerts(type);
CREATE INDEX idx_alerts_created ON alerts(created_at DESC);

CREATE INDEX idx_saved_user ON saved_deals(user_id);
CREATE INDEX idx_saved_deal ON saved_deals(deal_id);

CREATE INDEX idx_notifs_user ON notifications(user_id);
CREATE INDEX idx_notifs_unread ON notifications(user_id, is_read) WHERE is_read = FALSE;

CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_username ON profiles(username);

CREATE INDEX idx_memberships_user ON memberships(user_id);
CREATE INDEX idx_memberships_status ON memberships(status);

CREATE INDEX idx_views_deal ON deal_views(deal_id);
CREATE INDEX idx_views_created ON deal_views(created_at DESC);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER deals_updated_at    BEFORE UPDATE ON deals    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER membership_updated_at BEFORE UPDATE ON memberships FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- AUTO CREATE PROFILE ON SIGNUP
-- ============================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, username)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    lower(regexp_replace(
      COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
      '[^a-z0-9_]', '', 'g'
    ))
  );

  -- Welcome notification
  INSERT INTO notifications (user_id, type, title, body, link)
  VALUES (
    NEW.id,
    'welcome',
    'Vítej v NajdiDeal! 🎉',
    'Jsi součástí komunity, která nachází dealy jako první. Začni prozkoumávat.',
    '/dashboard'
  );

  -- Welcome activity
  INSERT INTO activity_feed (user_id, action_type, title, subtitle, icon)
  VALUES (
    NEW.id,
    'joined',
    'Připojil ses ke komunitě',
    'Vítej v NajdiDeal',
    '🎉'
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- DEAL STATS TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION update_deal_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE deals SET save_count = save_count + 1 WHERE id = NEW.deal_id;
    UPDATE profiles SET deals_saved = deals_saved + 1 WHERE id = NEW.user_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE deals SET save_count = GREATEST(save_count - 1, 0) WHERE id = OLD.deal_id;
    UPDATE profiles SET deals_saved = GREATEST(deals_saved - 1, 0) WHERE id = OLD.user_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER saved_deals_stats
  AFTER INSERT OR DELETE ON saved_deals
  FOR EACH ROW EXECUTE FUNCTION update_deal_stats();

-- ============================================================
-- CATEGORY COUNT TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION update_category_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.category_id IS NOT NULL THEN
    UPDATE categories SET deal_count = deal_count + 1 WHERE id = NEW.category_id;
  ELSIF TG_OP = 'DELETE' AND OLD.category_id IS NOT NULL THEN
    UPDATE categories SET deal_count = GREATEST(deal_count - 1, 0) WHERE id = OLD.category_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER deals_category_count
  AFTER INSERT OR DELETE ON deals
  FOR EACH ROW EXECUTE FUNCTION update_category_count();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE profiles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals           ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts          ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_deals     ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships     ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications   ENABLE ROW LEVEL SECURITY;
ALTER TABLE deal_views      ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_logs      ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_feed   ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories      ENABLE ROW LEVEL SECURITY;

-- HELPER: get current user role
CREATE OR REPLACE FUNCTION get_user_role(uid UUID)
RETURNS user_role AS $$
  SELECT role FROM profiles WHERE id = uid;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- HELPER: is admin
CREATE OR REPLACE FUNCTION is_admin(uid UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (SELECT 1 FROM profiles WHERE id = uid AND role = 'admin');
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- HELPER: is vip or admin
CREATE OR REPLACE FUNCTION is_vip_or_admin(uid UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (SELECT 1 FROM profiles WHERE id = uid AND role IN ('vip', 'admin'));
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- PROFILES POLICIES
CREATE POLICY "Profil viditelný pro všechny přihlášené"
  ON profiles FOR SELECT TO authenticated
  USING (TRUE);

CREATE POLICY "Uživatel může editovat svůj profil"
  ON profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role = (SELECT role FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Admin může editovat všechny profily"
  ON profiles FOR UPDATE TO authenticated
  USING (is_admin(auth.uid()));

-- DEALS POLICIES
CREATE POLICY "Free dealy viditelné pro všechny"
  ON deals FOR SELECT
  USING (access_level = 'free' AND status != 'draft');

CREATE POLICY "VIP dealy pro VIP a admin"
  ON deals FOR SELECT TO authenticated
  USING (
    status != 'draft' AND (
      access_level = 'free' OR
      is_vip_or_admin(auth.uid())
    )
  );

CREATE POLICY "Draft dealy jen pro admin"
  ON deals FOR SELECT TO authenticated
  USING (status = 'draft' AND is_admin(auth.uid()));

CREATE POLICY "Admin může spravovat dealy"
  ON deals FOR ALL TO authenticated
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- ALERTS POLICIES
CREATE POLICY "Free alerty pro všechny"
  ON alerts FOR SELECT
  USING (access_level = 'free' AND is_active = TRUE);

CREATE POLICY "VIP alerty pro VIP a admin"
  ON alerts FOR SELECT TO authenticated
  USING (
    is_active = TRUE AND (
      access_level = 'free' OR
      is_vip_or_admin(auth.uid())
    )
  );

CREATE POLICY "Admin spravuje alerty"
  ON alerts FOR ALL TO authenticated
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- SAVED DEALS POLICIES
CREATE POLICY "Vlastní uložené dealy"
  ON saved_deals FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin vidí všechny uložené"
  ON saved_deals FOR SELECT TO authenticated
  USING (is_admin(auth.uid()));

-- MEMBERSHIPS POLICIES
CREATE POLICY "Vlastní membership"
  ON memberships FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admin spravuje memberships"
  ON memberships FOR ALL TO authenticated
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- NOTIFICATIONS POLICIES
CREATE POLICY "Vlastní notifikace"
  ON notifications FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin může posílat notifikace"
  ON notifications FOR INSERT TO authenticated
  WITH CHECK (is_admin(auth.uid()));

-- DEAL VIEWS POLICIES
CREATE POLICY "Kdo může vkládat views"
  ON deal_views FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "Admin vidí statistiky"
  ON deal_views FOR SELECT TO authenticated
  USING (is_admin(auth.uid()));

-- ADMIN LOGS POLICIES
CREATE POLICY "Jen admin vidí logy"
  ON admin_logs FOR ALL TO authenticated
  USING (is_admin(auth.uid()));

-- ACTIVITY FEED POLICIES
CREATE POLICY "Vlastní aktivita"
  ON activity_feed FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System může vkládat aktivitu"
  ON activity_feed FOR INSERT TO authenticated
  WITH CHECK (TRUE);

-- CATEGORIES POLICIES
CREATE POLICY "Kategorie viditelné pro všechny"
  ON categories FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Admin spravuje kategorie"
  ON categories FOR ALL TO authenticated
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- ============================================================
-- SEED DATA – CATEGORIES
-- ============================================================
INSERT INTO categories (name, slug, description, icon, color, sort_order) VALUES
  ('Marketplace Flipy',  'marketplace-flipy',  'Produkty s vysokým flip potenciálem',  '🔄', '#F5B800', 1),
  ('AI Příležitosti',    'ai-prilezitosti',    'AI nástroje a affiliate programy',      '🤖', '#4D9FFF', 2),
  ('Trend Produkty',     'trend-produkty',     'Produkty s rostoucím trendem',          '📈', '#00E676', 3),
  ('Profit Alerty',      'profit-alerty',      'Exkluzivní profit příležitosti',        '⚡', '#FF4444', 4),
  ('Affiliate',          'affiliate',          'Affiliate programy a provize',          '💎', '#9C6FE4', 5),
  ('Online Business',    'online-business',    'Online podnikání a příležitosti',       '🌐', '#00BFA5', 6);

-- ============================================================
-- SEED DATA – SAMPLE DEALS
-- ============================================================
-- Note: created_by will be NULL until admin user exists
INSERT INTO deals (title, slug, description, short_desc, category, status, access_level, buy_price, sell_price, profit_amount, profit_percent, emoji, source_name, tags, is_featured, is_hot, trend_percent) VALUES
(
  'iPhone 15 Pro 256GB – Marketplace Flip',
  'iphone-15-pro-256gb-flip',
  'iPhone 15 Pro 256GB dostupný za výrazně nižší cenu než je běžná tržní cena. Skvělá příležitost pro rychlý flip na marketplace platformách. Produkt je nový, zapečetěný.',
  'Nový iPhone 15 Pro za skvělou cenu – flip potenciál +7 000 Kč',
  'marketplace_flip', 'featured', 'vip',
  15000, 22000, 7000, 46.67,
  '📱', 'Marketplace Flip',
  ARRAY['iphone', 'apple', 'flip', 'smartphone'],
  TRUE, TRUE, NULL
),
(
  '35% Recurring AI Affiliate Program',
  '35-percent-ai-affiliate-program',
  'Prémiový AI nástroj nabízí 35% recurring provizi za každého přivedeného zákazníka. Pasivní příjem měsíc co měsíc. Průměrná provize 850 Kč/zákazník/měsíc.',
  'AI affiliate s 35% recurring provizí – pasivní příjem každý měsíc',
  'ai_opportunity', 'active', 'free',
  NULL, NULL, NULL, 35,
  '🤖', 'AI Opportunity',
  ARRAY['ai', 'affiliate', 'pasivni-prijem', 'recurring'],
  TRUE, FALSE, NULL
),
(
  'Robotický vysavač – Trend +278%',
  'roboticky-vysavac-trend-278',
  'Robotický vysavač zaznamenává masivní nárůst prodejů +278% za posledních 30 dní. Ideální pro dropshipping nebo marketplace flip. Nízká konkurence, vysoká poptávka.',
  'Robotický vysavač s trendem +278% – dropshipping příležitost',
  'trend_product', 'active', 'free',
  2800, 5500, 2700, 96.4,
  '🌀', 'Trend Produkt',
  ARRAY['vysavac', 'trend', 'dropshipping', 'household'],
  FALSE, TRUE, 278
),
(
  'RTX 3060 12GB – Flip Příležitost',
  'rtx-3060-12gb-flip',
  'Grafická karta RTX 3060 12GB dostupná za 5 200 Kč, prodejní cena na marketplace 8 500 Kč. Solidní flip s průměrnou dobou prodeje 2-3 dny.',
  'RTX 3060 za 5 200 Kč – flip profit +3 300 Kč za 2-3 dny',
  'marketplace_flip', 'active', 'vip',
  5200, 8500, 3300, 63.46,
  '🎮', 'Marketplace Flip',
  ARRAY['rtx', 'gpu', 'gaming', 'flip', 'nvidia'],
  FALSE, FALSE, NULL
),
(
  'AirPods Pro 2 – Hot Deal',
  'airpods-pro-2-hot-deal',
  'AirPods Pro 2 za cenu výrazně pod tržní hodnotou. Originální produkt, nový zapečetěný. Flip na marketplace do 24 hodin.',
  'AirPods Pro 2 za 4 200 Kč – okamžitý flip profit +2 790 Kč',
  'marketplace_flip', 'active', 'vip',
  4200, 6990, 2790, 66.43,
  '🎧', 'Marketplace Flip',
  ARRAY['airpods', 'apple', 'audio', 'flip'],
  FALSE, TRUE, NULL
),
(
  'MacBook Air M2 – Prémiový Flip',
  'macbook-air-m2-premium-flip',
  'MacBook Air M2 dostupný za 26 000 Kč při standardní tržní ceně 34 990 Kč. Výborná příležitost pro flip nebo osobní použití se slevou.',
  'MacBook Air M2 za 26 000 Kč – flip profit až +8 990 Kč',
  'marketplace_flip', 'featured', 'vip',
  26000, 34990, 8990, 34.58,
  '💻', 'Marketplace Flip',
  ARRAY['macbook', 'apple', 'laptop', 'flip', 'm2'],
  TRUE, FALSE, NULL
);

-- ============================================================
-- SEED DATA – SAMPLE ALERTS
-- ============================================================
INSERT INTO alerts (title, body, type, access_level, is_pinned) VALUES
(
  '🔥 Nový TOP DEAL právě přidán!',
  'iPhone 15 Pro 256GB za 15 000 Kč. Tržní cena 22 000 Kč. Flip profit +7 000 Kč. Jedná se o limitovanou nabídku – jednej rychle!',
  'deal', 'vip', TRUE
),
(
  '📈 TikTok Trend Alert: +312% nárůst',
  'Produkt zaznamenává virální nárůst na TikTok. 312% nárůst prodejů za 7 dní. Ideální čas pro dropshipping nebo affiliate.',
  'trend', 'free', FALSE
),
(
  '🤖 Nový AI Affiliate Program – 35% provize',
  'Nový prémiový AI nástroj spustil affiliate program s 35% recurring provizí. Průměrná LTV zákazníka 24 měsíců.',
  'ai', 'vip', FALSE
),
(
  '⚡ Flash Deal – 2 hodiny',
  'Exkluzivní deal dostupný jen 2 hodiny. VIP členové mají první přístup. Profit potenciál nad 5 000 Kč.',
  'vip', 'vip', TRUE
);
