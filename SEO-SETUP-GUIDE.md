# MIGERA SEO Setup Guide
## Get migeralb.com ranking on Google

---

## STEP 1 — Add files to your website folder

Copy these 3 files into your `migera-website` folder (root, not in images):
- `robots.txt`
- `sitemap.xml`
- `inject-seo.js`

---

## STEP 2 — Run the SEO injector

Open Git Bash in your `migera-website` folder and run:

```bash
node inject-seo.js
```

This automatically adds all SEO meta tags, Open Graph, and schema to all 5 HTML pages.

---

## STEP 3 — Google Search Console (verify ownership)

1. Go to **search.google.com/search-console**
2. Sign in with **migeralb@gmail.com**
3. Click **Add Property**
4. Select **URL prefix** → type `https://www.migeralb.com` → Continue
5. Choose **HTML tag** method
6. Copy the code — it looks like: `abc123XYZdef456`
7. Open each HTML file in Notepad
8. Find this line: `content="REPLACE_WITH_YOUR_CODE"`
9. Replace `REPLACE_WITH_YOUR_CODE` with your actual code
10. Save all files

---

## STEP 4 — Push to GitHub

```bash
git add .
git commit -m "SEO full update robots sitemap schema"
git push
```

Wait 30 seconds for Render to deploy.

---

## STEP 5 — Verify in Google Search Console

1. Go back to Search Console
2. Click **Verify** on the HTML tag step
3. It should say ✅ Ownership verified

---

## STEP 6 — Submit your Sitemap

1. In Search Console → left menu → **Sitemaps**
2. Enter: `sitemap.xml`
3. Click **Submit**
4. Google will crawl your site within 24–48 hours

---

## STEP 7 — Request Indexing (speeds things up)

1. In Search Console → top bar → type your URL: `https://www.migeralb.com`
2. Press Enter → click **Request Indexing**
3. Repeat for each page:
   - `https://www.migeralb.com/services.html`
   - `https://www.migeralb.com/realestate.html`
   - `https://www.migeralb.com/meetup.html`

---

## STEP 8 — Google Business Profile (free, important for local search)

1. Go to **business.google.com**
2. Sign in with migeralb@gmail.com
3. Add your business:
   - Business name: **MIGERA**
   - Category: **Management Consulting Firm**
   - Location: Lebanon (select "no physical location open to customers" if no office)
   - Phone: +961 76 460846
   - Website: https://www.migeralb.com
4. Verify ownership (usually by phone or email)

This makes MIGERA appear in Google Maps and the right-side knowledge panel.

---

## WHAT THESE SEO IMPROVEMENTS DO

| Improvement | Impact |
|-------------|--------|
| `robots.txt` | Tells Google which pages to index |
| `sitemap.xml` | Submits all pages directly to Google |
| Meta titles (keyword-rich) | What appears in Google search results |
| Meta descriptions | The text snippet shown under your title |
| Open Graph tags | How your link looks when shared on WhatsApp, LinkedIn |
| JSON-LD Schema | Tells Google you're a business, your services, contact info |
| Google Search Console | Monitors your rankings and crawl errors |
| Google Business Profile | Appears in Maps and local search |

---

## TARGET KEYWORDS YOU WILL RANK FOR (over time)

- "F&B consulting Lebanon"
- "restaurant consultant Beirut"
- "York Towers Georgia broker Lebanon"
- "Meetup coffee shop franchise"
- "coffee shop franchise Lebanon"
- "property investment Tbilisi Lebanese investors"
- "business consulting Lebanon"
- "F&B consultant Saudi Arabia"

---

## IMPORTANT NOTES

- New websites take **3–6 months** to appear on page 1 for competitive keywords
- You will appear much faster for **"MIGERA"** and **"migeralb.com"** searches (branded)
- Posting regularly on Instagram @migeralb with your website link helps build authority
- Getting listed on directories (Yellow Pages Lebanon, Clutch, etc.) also helps
- Every time you update the website, request re-indexing in Search Console

---

*Prepared by MIGERA SEO Package — migeralb.com*
