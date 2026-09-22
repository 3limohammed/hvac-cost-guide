# HVAC Cost Guide (2026)

Independent, research-backed HVAC replacement, repair, and installation cost benchmarks for US homeowners.

## 🌟 Overview
- **Target Audience:** United States homeowners seeking accurate heating and cooling cost estimates.
- **Technology Stack:** Pure Vanilla HTML5, CSS3, and JavaScript (Zero external frameworks, blazing fast static delivery).
- **SEO & Structure:** Fully structured semantic HTML, JSON-LD schemas (`WebSite`, `Organization`, `FAQPage`, `Article`, `HowTo`, `GovernmentService`), dynamic interactive HVAC cost calculator, 50 canonical URLs in `sitemap.xml`, and customized 404 page.
- **Monetization Architecture:**
  - Integrated Amazon Associates product recommendation cards (Smart thermostats, DIY mini-splits, air filters, diagnostic meters) with FTC-compliant affiliate disclosures.
  - Standard IAB-compliant `ads.txt` and layout-stable AdSense container architecture (Zero CLS).
- **Edge Performance:** Configured for Cloudflare Pages with immutable asset caching (`Cache-Control: public, max-age=31536000`), security headers (`_headers`), and canonical redirects (`_redirects`).

## 📁 Repository Structure
```
hvac-cost-guide/
├── index.html                           # Homepage with HVAC Cost Calculator
├── 404.html                             # Custom error page
├── sitemap.xml                          # Complete XML Sitemap (50 canonical URLs)
├── robots.txt                           # Search engine crawling rules
├── ads.txt                              # Google AdSense authorized sellers file
├── _headers                             # Cloudflare Pages edge cache & security headers
├── _redirects                           # Cloudflare Pages 301 redirect map
├── assets/
│   ├── css/styles.css                   # Responsive design system & ad containers
│   ├── js/calculator.js                 # Interactive pricing calculator engine
│   ├── js/hvac-data.js                  # Regional labor and equipment datasets
│   └── img/                             # SVG icons and visual assets
├── ac-blowing-warm-air/                 # Emergency cooling troubleshooting & HowTo
├── furnace-blowing-cold-air/            # Emergency heating troubleshooting & safety
├── heat-pump-tax-credits-2026/          # Inflation Reduction Act & 25C tax credit guide
├── ac-repair-cost/                      # AC repair pricing & diagnostic parts
├── mini-split-installation-cost/        # Ductless mini-split guide & DIY equipment
├── smart-thermostat-installation-cost/  # Smart thermostats & hardware guide
├── hvac-maintenance-cost/               # Tune-up checklist & air filter guides
├── hvac-by-state/                       # Regional cost multipliers for all 50 states
├── ... [40+ topic guides]
└── docs/                                # Technical audits, research, and roadmap
```

## 🚀 Instant Deployment (100% Free - Zero Cost)

### Option 1: Cloudflare Pages (Recommended - Free & Fast Edge CDN)
1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/) and go to **Workers & Pages**.
2. Click **Create Application** > **Pages** > **Connect to Git**.
3. Select this `hvac-cost-guide` repository.
4. Set **Build command** to: *(leave empty)*
5. Set **Build output directory** to: `.` or `/`
6. Click **Save and Deploy**. Your site will be live across 300+ global data centers with free SSL!

### Option 2: GitHub Pages (Free)
1. Go to repository **Settings** > **Pages**.
2. Under **Build and deployment** > **Source**, choose **Deploy from a branch**.
3. Select `main` branch and `/ (root)` folder.
4. Click **Save**. Your site will be accessible at `https://<username>.github.io/hvac-cost-guide/`.

---

## 🔍 Google Search Console Setup

1. Go to [Google Search Console](https://search.google.com/search-console).
2. Add your live URL (e.g. `https://3limohammed.github.io/hvac-cost-guide/` or custom domain).
3. Verify ownership via HTML meta tag or verification file.
4. In the left menu, click **Sitemaps**, enter `sitemap.xml`, and click **Submit**.
