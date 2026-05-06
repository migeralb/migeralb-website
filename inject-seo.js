/**
 * MIGERA SEO Injector
 * Run: node inject-seo.js
 * This script adds all SEO meta tags, schema, and OG tags to your HTML files
 */

const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://www.migeralb.com';

// ── Per-page SEO config ──
const pages = {
  'index.html': {
    title: 'MIGERA | F&B Consulting, Property Investment & Franchise Development — Lebanon',
    desc: 'MIGERA is a Lebanese consulting firm specialising in F&B consulting, restaurant concept development, York Towers property investment in Georgia, and the Meetup Coffee Shop franchise. Based in Lebanon, active across Saudi Arabia and the GCC.',
    keywords: 'F&B consulting Lebanon, restaurant consultant Beirut, business consulting Lebanon, coffee shop franchise Lebanon, York Towers Georgia broker, property investment Tbilisi, Meetup coffee shop franchise, hospitality consulting Lebanon, consulting firm Beirut, F&B consultant Saudi Arabia',
    canonical: '/',
    ogImage: '/images/herobackground.jpg',
    schema: `[
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "MIGERA",
        "alternateName": "MIGERA Consulting and Management",
        "url": "${SITE_URL}",
        "logo": "${SITE_URL}/images/migeralogowhite.png",
        "description": "Lebanese consulting and management firm specialising in F&B consulting, property investment in Georgia, and the Meetup Coffee Shop franchise.",
        "areaServed": ["Lebanon","Saudi Arabia","UAE","Kuwait","Qatar","Bahrain","Georgia"],
        "contactPoint": [
          {"@type":"ContactPoint","telephone":"+961-76-460846","contactType":"customer service","areaServed":"LB","availableLanguage":["Arabic","English"]},
          {"@type":"ContactPoint","telephone":"+966-569-522777","contactType":"customer service","areaServed":"SA","availableLanguage":["Arabic","English"]}
        ],
        "email": "info@migeralb.com",
        "sameAs": ["https://www.instagram.com/migeralb"]
      },
      {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        "name": "MIGERA",
        "url": "${SITE_URL}",
        "telephone": "+961-76-460846",
        "email": "info@migeralb.com",
        "address": {"@type":"PostalAddress","addressCountry":"LB","addressRegion":"Lebanon"},
        "priceRange": "$$",
        "description": "F&B consulting, property investment advisory, and franchise development. Based in Lebanon, active across Saudi Arabia and the GCC.",
        "sameAs": ["https://www.instagram.com/migeralb"]
      }
    ]`
  },
  'services.html': {
    title: 'F&B Consulting & Restaurant Management Services | MIGERA Lebanon',
    desc: 'Expert F&B consulting services in Lebanon and Saudi Arabia. Specialising in restaurant concept development, menu engineering, operational review, franchise development, and staff training for hospitality businesses.',
    keywords: 'F&B consulting Lebanon, restaurant consultant Beirut, menu engineering Lebanon, franchise development Lebanon, restaurant concept development, hospitality consulting Beirut, operational turnaround Lebanon, coffee shop consultant Lebanon',
    canonical: '/services.html',
    ogImage: '/images/herobackground.jpg',
    schema: `[{
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "F&B Consulting & Restaurant Management",
      "provider": {"@type":"Organization","name":"MIGERA","url":"${SITE_URL}"},
      "areaServed": ["Lebanon","Saudi Arabia","GCC"],
      "description": "End-to-end F&B consulting including concept development, menu engineering, operational review, franchise development, and staff training.",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "F&B Consulting Services",
        "itemListElement": [
          {"@type":"Offer","itemOffered":{"@type":"Service","name":"Concept Development & Brand Identity"}},
          {"@type":"Offer","itemOffered":{"@type":"Service","name":"Operational Review & Turnaround"}},
          {"@type":"Offer","itemOffered":{"@type":"Service","name":"Menu Engineering & Design"}},
          {"@type":"Offer","itemOffered":{"@type":"Service","name":"Franchise Development"}},
          {"@type":"Offer","itemOffered":{"@type":"Service","name":"Staff Training & Management"}},
          {"@type":"Offer","itemOffered":{"@type":"Service","name":"Marketing & Guest Experience"}}
        ]
      }
    }]`
  },
  'realestate.html': {
    title: 'Property Investment in Georgia | York Towers Broker | MIGERA Lebanon',
    desc: 'MIGERA is an authorised broker for York Towers, Georgia. We guide Lebanese and Arab investors through premium property acquisition in Tbilisi and Batumi. Apartments, villas, and land plots with strong rental yields and 0% property tax.',
    keywords: 'York Towers Georgia broker, property investment Tbilisi, property investment Batumi, real estate Georgia Lebanon, buy apartment Tbilisi, Georgia property for Lebanese investors, York Towers Lebanon, invest in Georgia real estate, Tbilisi apartments for sale, Batumi property investment',
    canonical: '/realestate.html',
    ogImage: '/images/herobackground.jpg',
    schema: `[{
      "@context": "https://schema.org",
      "@type": "RealEstateAgent",
      "name": "MIGERA — York Towers Authorised Broker",
      "url": "${SITE_URL}/realestate.html",
      "telephone": "+961-76-460846",
      "email": "info@migeralb.com",
      "description": "Authorised broker for York Towers Georgia. Assisting Lebanese and Arab investors in acquiring premium property in Tbilisi and Batumi.",
      "areaServed": ["Georgia","Lebanon","Saudi Arabia","GCC"]
    }]`
  },
  'meetup.html': {
    title: 'Meetup Coffee Shop Franchise Lebanon | Open Your Own Coffee Shop | MIGERA',
    desc: 'Meetup Coffee Shop is a Lebanese coffee brand with locations in Dekwaneh and Kaslik, serving over 10,000 customers. Now offering franchise opportunities across Lebanon, the Gulf, and the wider MENA region. Managed by MIGERA.',
    keywords: 'Meetup coffee shop franchise, coffee shop franchise Lebanon, Lebanese coffee franchise, franchise opportunity Lebanon, coffee shop franchise GCC, Meetup Lebanon, Dekwaneh coffee shop, Kaslik coffee shop, Lebanon F&B franchise, open coffee shop Lebanon',
    canonical: '/meetup.html',
    ogImage: '/images/herobackground.jpg',
    schema: `[{
      "@context": "https://schema.org",
      "@type": "FoodEstablishment",
      "name": "Meetup Coffee Shop",
      "url": "${SITE_URL}/meetup.html",
      "servesCuisine": "Coffee, Beverages",
      "description": "Lebanese coffee shop brand with locations in Dekwaneh and Kaslik. Now franchising across Lebanon, the Gulf, and MENA.",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Meetup Franchise Opportunity"
      },
      "location": [
        {"@type":"Place","address":{"@type":"PostalAddress","addressLocality":"Dekwaneh","addressCountry":"LB"}},
        {"@type":"Place","address":{"@type":"PostalAddress","addressLocality":"Kaslik","addressCountry":"LB"}}
      ]
    }]`
  },
  'shop.html': {
    title: 'MIGERA Shop — Coming Soon | Meetup Brand Merchandise',
    desc: 'The MIGERA Shop is coming soon. Sign up to be notified when Meetup brand merchandise and limited edition drops go live.',
    keywords: 'Meetup merchandise, MIGERA shop, Lebanese brand merchandise',
    canonical: '/shop.html',
    ogImage: '/images/herobackground.jpg',
    schema: `[{"@context":"https://schema.org","@type":"WebPage","name":"MIGERA Shop — Coming Soon","url":"${SITE_URL}/shop.html"}]`
  }
};

// ── Build SEO head block ──
function buildSEOBlock(page, config) {
  const url = `${SITE_URL}${config.canonical}`;
  const imageUrl = `${SITE_URL}${config.ogImage}`;
  
  return `
  <!-- ═══ SEO ═══ -->
  <title>${config.title}</title>
  <meta name="description" content="${config.desc}">
  <meta name="keywords" content="${config.keywords}">
  <meta name="author" content="MIGERA">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${url}">

  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="${url}">
  <meta property="og:title" content="${config.title}">
  <meta property="og:description" content="${config.desc}">
  <meta property="og:image" content="${imageUrl}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:site_name" content="MIGERA">
  <meta property="og:locale" content="en_GB">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="${url}">
  <meta name="twitter:title" content="${config.title}">
  <meta name="twitter:description" content="${config.desc}">
  <meta name="twitter:image" content="${imageUrl}">

  <!-- Google Search Console — REPLACE with your verification code -->
  <meta name="google-site-verification" content="REPLACE_WITH_YOUR_CODE">

  <!-- Structured Data (JSON-LD) -->
  <script type="application/ld+json">
  ${config.schema}
  </script>
  <!-- ═══ End SEO ═══ -->
`;
}

// ── Process each HTML file ──
let updated = 0;
for (const [filename, config] of Object.entries(pages)) {
  const filepath = path.join(__dirname, filename);
  if (!fs.existsSync(filepath)) {
    console.log(`⚠️  ${filename} not found — skipping`);
    continue;
  }

  let html = fs.readFileSync(filepath, 'utf8');

  // Remove any existing title/meta description to avoid duplicates
  html = html.replace(/<title>.*?<\/title>/is, '');
  html = html.replace(/<meta name="description"[^>]*>/gi, '');
  html = html.replace(/<meta name="keywords"[^>]*>/gi, '');
  html = html.replace(/<meta name="author"[^>]*>/gi, '');
  html = html.replace(/<meta name="robots"[^>]*>/gi, '');
  html = html.replace(/<link rel="canonical"[^>]*>/gi, '');
  html = html.replace(/<meta property="og:[^>]*>/gi, '');
  html = html.replace(/<meta name="twitter:[^>]*>/gi, '');
  html = html.replace(/<meta name="google-site-verification"[^>]*>/gi, '');
  html = html.replace(/<!-- ═══ SEO ═══ -->[\s\S]*?<!-- ═══ End SEO ═══ -->/g, '');
  html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '');

  // Inject after <head> or after charset/viewport
  const seoBlock = buildSEOBlock(filename, config);
  
  if (html.includes('<meta name="viewport"')) {
    html = html.replace(/(<meta name="viewport"[^>]*>)/, `$1\n${seoBlock}`);
  } else {
    html = html.replace(/<head>/, `<head>\n${seoBlock}`);
  }

  fs.writeFileSync(filepath, html, 'utf8');
  console.log(`✅ ${filename} — SEO injected`);
  updated++;
}

console.log(`\nDone. ${updated} files updated.`);
console.log('\n📋 NEXT STEPS:');
console.log('1. Get Google verification code from search.google.com/search-console');
console.log('2. Replace REPLACE_WITH_YOUR_CODE in each HTML file');
console.log('3. Run: git add . && git commit -m "SEO update" && git push');
console.log('4. Submit sitemap at search.google.com/search-console → Sitemaps');
console.log('   URL to submit: https://www.migeralb.com/sitemap.xml');
