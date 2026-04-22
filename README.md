# MIGERA Website — migeralb.com
**Version 2.0 — Multi-page, light theme, Google Sheets lead capture**

---

## 📁 File Structure

```
migera-website/
├── index.html           ← Homepage (hero, about, pillars, lead forms)
├── services.html        ← F&B Consulting details
├── realestate.html      ← York Towers KSA broker page
├── meetup.html          ← Interactive Meetup shop (t-shirts, accessories)
├── shop.html            ← MIGERA Shop (coming soon + email waitlist)
├── style.css            ← Global styles (light luxury theme)
├── meetup.css           ← Meetup shop-specific styles
├── script.js            ← Global JS + Google Sheets form handler
├── meetup.js            ← Shop cart, products, checkout
├── google-apps-script.js ← Paste into Google Apps Script (see below)
├── images/
│   ├── migeralogo.png
│   ├── migeralogowhite.png
│   └── herobackground.jpg
└── README.md
```

---

## 🔗 Step 1 — Set Up Google Sheets

This connects all forms to your Google Drive (migeralb@gmail.com).

### 1a. Create the Google Sheet
1. Go to [sheets.google.com](https://sheets.google.com) — logged in as **migeralb@gmail.com**
2. Create a new spreadsheet → name it **"MIGERA Leads"**
3. Copy the spreadsheet ID from the URL:
   `https://docs.google.com/spreadsheets/d/**THIS_PART**/edit`

### 1b. Create the Apps Script
1. In the spreadsheet: **Extensions → Apps Script**
2. Delete any existing code
3. Paste the entire contents of `google-apps-script.js`
4. Replace `YOUR_SPREADSHEET_ID_HERE` with your actual ID
5. Click **Save** (Ctrl+S)

### 1c. Deploy as Web App
1. Click **Deploy → New Deployment**
2. Click ⚙️ gear → **Web App**
3. Set:
   - **Execute as**: Me (migeralb@gmail.com)
   - **Who has access**: Anyone
4. Click **Deploy** → authorize permissions when prompted
5. **Copy the Web App URL** — it looks like:
   `https://script.google.com/macros/s/AKfy.../exec`

### 1d. Add URL to website
Open `script.js` and replace line 8:
```js
const GOOGLE_SCRIPT_URL = 'PASTE_YOUR_URL_HERE';
```

---

## 🚀 Step 2 — Deploy on GitHub + Render

### Push to GitHub
```bash
git init
git add .
git commit -m "MIGERA v2 - multi-page site"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/migera-website.git
git push -u origin main
```

### Deploy on Render.com
1. [render.com](https://render.com) → **New → Static Site**
2. Connect GitHub → select `migera-website`
3. Settings:
   - **Build Command**: *(leave blank)*
   - **Publish Directory**: `.`
4. Click **Create Static Site**

---

## 🌐 Step 3 — Connect GoDaddy → migeralb.com

**In Render:** Settings → Custom Domains → add `migeralb.com` and `www.migeralb.com`
Render shows you a CNAME value.

**In GoDaddy DNS:**
| Type  | Name | Value                   | TTL |
|-------|------|-------------------------|-----|
| CNAME | www  | your-site.onrender.com  | 600 |

> For the root domain (`@`): GoDaddy → Forwarding → forward `migeralb.com` → `www.migeralb.com` (301 permanent)

SSL is free and automatic via Render. Allow 10–30 min for DNS propagation.

---

## 📋 Google Sheets — What Gets Recorded

| Sheet Tab      | Triggered By              | Fields Captured |
|----------------|---------------------------|-----------------|
| `Consulting`   | Consulting form (homepage + services) | Name, Email, Phone, Business Type, Message |
| `RealEstate`   | Real estate form (homepage + realestate page) | Name, Email, Phone, Nationality, Budget, Purpose, Message |
| `Franchise`    | Franchise form (homepage) | Name, Email, Phone, Country, Franchise Type, Investment, Message |
| `MeetupOrders` | Meetup shop checkout      | Name, Email, Phone, Country, Address, Order Summary, Total |
| `ShopNotify`   | Shop coming soon waitlist | Email |

Each row also gets a **Timestamp** and **notification email** to `info@migeralb.com`.

---

## 🛍 Adding Products to Meetup Shop

Edit the `PRODUCTS` array in `meetup.js`:

```js
{
  id: 9,               // unique number
  name: 'New Product',
  category: 'tshirts', // tshirts | accessories | limited
  price: 40,
  currency: '$',
  badge: 'New',        // null | 'New' | 'Limited' | 'Sold Out'
  badgeType: 'new',    // new | limited | sold-out
  description: 'Product description here.',
  icon: '👕',          // emoji placeholder until you add real photos
  sizes: ['S','M','L','XL'],
  colors: ['Black', 'White'],
  inStock: true,
}
```

To add **real product photos**, replace the emoji placeholders:
```css
/* In meetup.css, update .product-img: */
background-image: url('images/products/product-1.jpg');
background-size: cover;
```

---

## 📦 Updates & Deployment

Any change → push to GitHub → Render auto-redeploys:
```bash
git add .
git commit -m "Update products"
git push
```

---

## 📬 Contact
- **Website**: migeralb.com
- **Email**: info@migeralb.com  
- **Instagram**: [@migeralb](https://instagram.com/migeralb)
- **Lebanon**: (+961) 76 460846
- **Saudi Arabia**: +966 569 522 777
