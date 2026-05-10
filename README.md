# NajdiDeal – Ultra Premium SaaS Platform

> Nejprémiornější deal komunita v České republice a Slovensku.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Jazyk**: TypeScript
- **Styling**: Tailwind CSS
- **Animace**: Framer Motion
- **Backend**: Supabase (Auth + PostgreSQL)
- **Deployment**: Vercel

---

## Rychlý start

### 1. Klonování projektu

```bash
git clone https://github.com/vas-username/najdideal.git
cd najdideal
npm install
```

### 2. Nastavení Supabase

1. Jdi na [supabase.com](https://supabase.com) a vytvoř nový projekt
2. Zkopíruj `Project URL` a `anon public key` z **Settings → API**
3. Zkopíruj `service_role key` (jen pro server)

### 3. Environment variables

```bash
cp .env.local.example .env.local
```

Vyplň `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Databáze – spuštění schema

1. V Supabase dashboardu jdi na **SQL Editor**
2. Vlož celý obsah souboru `supabase/schema.sql`
3. Klikni **Run**

Schema vytvoří:
- Všechny tabulky (profiles, deals, alerts, atd.)
- RLS politiky (Row Level Security)
- Triggery (auto-create profile, statistiky)
- Seed data (kategorie + ukázkové dealy)

### 5. Spuštění lokálně

```bash
npm run dev
```

Otevři [http://localhost:3000](http://localhost:3000)

---

## Vytvoření admin účtu

1. Zaregistruj se normálně na `/register`
2. V Supabase SQL Editoru spusť:

```sql
UPDATE profiles
SET role = 'admin'
WHERE email = 'tvuj@email.cz';
```

3. Přihlaš se znovu – admin panel bude dostupný na `/admin`

---

## Struktura projektu

```
najdideal/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Landing page (homepage)
│   │   ├── login/                # Přihlášení
│   │   ├── register/             # Registrace
│   │   ├── reset-password/       # Reset hesla
│   │   ├── dashboard/            # Hlavní dashboard
│   │   ├── alerts/               # Live alerty
│   │   ├── deals/                # Všechny dealy + detail
│   │   ├── saved/                # Uložené dealy
│   │   ├── notifications/        # Notifikace
│   │   ├── search/               # Vyhledávání
│   │   ├── profile/              # Profil uživatele
│   │   ├── settings/             # Nastavení účtu
│   │   ├── membership/           # VIP členství / pricing
│   │   └── admin/                # Admin panel
│   │       ├── page.tsx          # Admin přehled
│   │       ├── deals/            # Správa dealů
│   │       ├── users/            # Správa uživatelů
│   │       ├── analytics/        # Analytika
│   │       └── alerts/           # Správa alertů
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppNavbar.tsx     # Navigační lišta
│   │   │   ├── AppSidebar.tsx    # Boční menu
│   │   │   └── MobileNav.tsx     # Mobilní navigace
│   │   ├── deals/
│   │   │   └── DealCard.tsx      # Karta dealu
│   │   └── effects/
│   │       ├── CursorProvider.tsx # Custom cursor
│   │       └── NoiseOverlay.tsx   # Texture overlay
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts         # Browser Supabase client
│   │   │   ├── server.ts         # Server Supabase client
│   │   │   └── actions.ts        # Server actions (login, register...)
│   │   ├── hooks/
│   │   │   └── index.ts          # React hooks (useAuth, useDeals...)
│   │   ├── utils/
│   │   │   └── index.ts          # Utility funkce
│   │   └── types/
│   │       └── index.ts          # TypeScript typy
│   ├── middleware.ts              # Auth + role middleware
│   └── styles/
│       └── globals.css            # Globální CSS + design system
├── supabase/
│   └── schema.sql                # Kompletní databázové schema
├── .env.local.example
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── vercel.json
```

---

## Deployment na Vercel

### Automaticky (doporučeno)

1. Push projekt na GitHub
2. Jdi na [vercel.com](https://vercel.com) → **New Project**
3. Importuj GitHub repo
4. Přidej environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_APP_URL` (tvoje Vercel URL)
5. Klikni **Deploy**

### Manuálně přes CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

---

## Supabase Auth nastavení

V Supabase dashboardu → **Authentication → Settings**:

1. **Site URL**: nastav na tvoji produkční URL (např. `https://najdideal.cz`)
2. **Redirect URLs**: přidej `https://najdideal.cz/**`
3. **Email confirmations**: dle potřeby (pro vývoj lze vypnout)

---

## Systém rolí

| Role  | Popis                          | Přístup                        |
|-------|-------------------------------|-------------------------------|
| free  | Běžný registrovaný uživatel   | Free dealy, free alerty        |
| vip   | VIP člen (platící)            | Vše + VIP dealy, VIP alerty    |
| admin | Správce platformy             | Vše + admin panel              |

Změna role uživatele (v Supabase SQL Editor):
```sql
UPDATE profiles SET role = 'vip' WHERE email = 'user@email.cz';
```

---

## Databázové tabulky

| Tabulka       | Popis                              |
|---------------|------------------------------------|
| profiles      | Profily uživatelů (rozšiřuje auth) |
| deals         | Dealy a příležitosti               |
| alerts        | Live alerty                        |
| categories    | Kategorie dealů                    |
| saved_deals   | Uložené dealy uživatelů            |
| memberships   | VIP členství                       |
| notifications | Notifikace                         |
| deal_views    | Analytika zobrazení                |
| activity_feed | Aktivita uživatelů                 |
| admin_logs    | Logy admin akcí                    |

---

## Přizpůsobení

### Barvy
Edituj `tailwind.config.ts` – hlavní brand barva je `gold-500` (#F5B800).

### Texty
Všechny texty jsou v Czech locale, přímo v page/component souborech.

### Pricing
Změň ceny v `src/app/membership/page.tsx` a `src/app/page.tsx`.

### Logo
Nahraď `ND` text v `AppNavbar.tsx`, `AppSidebar.tsx` a `page.tsx` za SVG logo.

---

## Lokální vývoj – tipy

```bash
# Type check
npm run type-check

# Lint
npm run lint

# Build (otestuj před deploym)
npm run build
```

---

## Kontakt & podpora

- Web: [najdideal.cz](https://najdideal.cz)
- Email: info@najdideal.cz
- Telegram: t.me/najdideal

---

© 2026 NajdiDeal. Všechna práva vyhrazena.
