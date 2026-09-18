# HVAC Cost Guide (2026)

Independent, research-backed HVAC replacement, repair, and installation cost benchmarks for US homeowners.

## 🌟 Overview
- **Target Audience:** United States homeowners seeking accurate heating and cooling cost estimates.
- **Technology Stack:** Pure Vanilla HTML5, CSS3, and JavaScript (Zero external frameworks, blazing fast static delivery).
- **SEO & Structure:** Fully structured semantic HTML, JSON-LD schemas (WebSite, Organization, FAQPage, Article), dynamic interactive HVAC cost calculator, 47 canonical URLs in `sitemap.xml`, and customized 404 page.
- **Monetization Architecture:**
  - Integrated Amazon Associates product recommendation cards (Smart thermostats, DIY mini-splits, air filters, diagnostic meters) with FTC-compliant affiliate disclosures.
  - Reserved, non-intrusive AdSense ad slots pre-configured for instant activation upon domain approval.

## 📁 Repository Structure
```
hvac-cost-guide/
├── index.html                           # Homepage with HVAC Cost Calculator
├── 404.html                             # Custom error page
├── sitemap.xml                          # Complete XML Sitemap (47 canonical URLs)
├── robots.txt                           # Search engine crawling rules
├── assets/
│   ├── css/styles.css                   # Responsive design system & product cards
│   ├── js/calculator.js                 # Interactive pricing calculator engine
│   ├── js/hvac-data.js                  # Regional labor and equipment datasets
│   └── img/                             # SVG icons and visual assets
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
2. Add your live URL (e.g. `https://your-site.pages.dev` or custom domain).
3. Verify ownership via HTML meta tag (paste verification code into line 9 of `index.html`) or via Cloudflare DNS.
4. In the left menu, click **Sitemaps**, enter `sitemap.xml`, and click **Submit**.
