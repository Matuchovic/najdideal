const https = require('https');
const { createClient } = require('@supabase/supabase-js');

const env = require('fs').readFileSync('.env.local', 'utf8');
const getEnv = (key) => env.split('\n').find(l => l.startsWith(key + '='))?.split('=').slice(1).join('=').trim();

const supabase = createClient(
  getEnv('NEXT_PUBLIC_SUPABASE_URL'),
  getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY')
);

function fetchRSS(url) {
  return new Promise((resolve) => {
    https.get(url, { 
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' }
    }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ data, status: res.statusCode }));
    }).on('error', () => resolve({ data: '', status: 0 }));
  });
}

function parseRSS(xml) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];
    const get = (tag) => {
      const m = block.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>|<${tag}[^>]*>([^<]*)</${tag}>`));
      return m ? (m[1] || m[2] || '').trim() : '';
    };
    const title = get('title');
    const desc = get('description');
    const link = get('link');
    const priceMatch = (title + ' ' + desc).match(/(\d[\d\s]{2,})(Kč|kc|,-)/i);
    const price = priceMatch ? parseInt(priceMatch[1].replace(/\s/g, '')) : null;
    const text = (title + ' ' + desc).toLowerCase();
    let category = 'ostatni'; let emoji = '🛒';
    if (text.match(/byt|dům|chata|nemovit|pozemek|garsonka/)) { category = 'nemovitosti'; emoji = '🏠'; }
    else if (text.match(/auto|škoda|volkswagen|bmw|audi|ford|toyota|honda|mercedes|renault|opel/)) { category = 'auta'; emoji = '🚗'; }
    else if (text.match(/iphone|samsung|laptop|notebook|mac|ipad|mobil|telefon/)) { category = 'elektronika'; emoji = '📱'; }
    if (title && price && price > 500) items.push({ title, description: desc, link, price, category, emoji });
  }
  return items;
}

function isFlipDeal(item) {
  const { price, category, title, description } = item;
  const text = (title + ' ' + description).toLowerCase();
  if (category === 'nemovitosti' && price >= 100000 && price <= 10000000) {
    if (text.match(/nutný prodej|rychlý prodej|pod cenou|sleva|k opravě|rekonstrukce|nabídněte/)) return true;
    if (price < 800000) return true;
  }
  if (category === 'auta' && price >= 5000 && price <= 500000) {
    if (text.match(/nutný prodej|rychlý prodej|pod cenou|sleva|havárie|na díly/)) return true;
    if (price < 30000) return true;
  }
  if (category === 'elektronika' && price >= 500 && price <= 80000) {
    if (text.match(/nový|zabalený|nerozbalený|nepoužitý/)) return true;
    if (price < 3000) return true;
  }
  return false;
}

function estimateProfit(item) {
  const margins = { nemovitosti: 0.25, auta: 0.30, elektronika: 0.35, ostatni: 0.25 };
  const margin = margins[item.category] ?? 0.25;
  const sellPrice = Math.round(item.price * (1 + margin));
  const profit = sellPrice - item.price;
  return { sellPrice, profit, profitPercent: Math.round(margin * 100) };
}

async function run() {
  console.log('🤖 NajdiDeal AI Scanner starting...');
  const { data: rss, status } = await fetchRSS('https://www.bazos.cz/rss.php');
  console.log('📡 Bazoš RSS status:', status, '| length:', rss.length);
  if (rss.length < 100) { console.log('❌ RSS empty'); return; }
  const items = parseRSS(rss);
  console.log('📋 Items with price:', items.length);
  const flips = items.filter(isFlipDeal);
  console.log('💰 Flip deals:', flips.length);
  let inserted = 0;
  for (const deal of flips.slice(0, 8)) {
    const { sellPrice, profit, profitPercent } = estimateProfit(deal);
    const title = `🤖 AI FLIP: ${deal.title.slice(0, 90)}`;
    const { data: existing } = await supabase.from('listings').select('id').eq('title', title).maybeSingle();
    if (existing) { console.log('  ⏭ Skip:', deal.title.slice(0, 50)); continue; }
    const { error } = await supabase.from('listings').insert({
      user_id: null,
      title,
      description: `💡 Potenciální flip příležitost.\n\n📊 Nákup: ${deal.price.toLocaleString('cs-CZ')} Kč\n💰 Odhadovaný prodej: ${sellPrice.toLocaleString('cs-CZ')} Kč\n📈 Profit: +${profit.toLocaleString('cs-CZ')} Kč (${profitPercent}%)\n\n🔗 Originální inzerát: ${deal.link}\n\n⚠️ Vždy ověřte inzerát před koupí.`,
      price: deal.price,
      category: deal.category,
      location: 'Česká republika',
      status: 'active',
      is_featured: profitPercent >= 30,
      is_boosted: profitPercent >= 40,
      access_level: 'vip',
    });
    if (!error) { inserted++; console.log(`  ✅ ${deal.title.slice(0, 60)} | +${profit.toLocaleString('cs-CZ')} Kč`); }
    else console.log('  ❌ Error:', error.message);
  }
  console.log(`\n✅ Done! Inserted ${inserted} flip deals.`);
}

run().catch(console.error);
