# Portfolio site: what changed and how to deploy

## Deploy
Copy the contents of this folder over your repo root, commit, push. GitHub Pages
serves it as-is (`.nojekyll` is present). No build step.

`style.css` and `app.js` were not modified, so the `?v=26` cache string does not
need bumping.

## 1. Favicon (the reason it never appeared)
The old favicon was an inline SVG data URI. Google Search does not support data
URI favicons at all, and Safari plus several Android browsers ignore SVG-only
icons. There was no `favicon.ico` and no Apple touch icon, and the web manifest
listed the 1200x630 OG image as an app icon, which browsers reject because icons
must be square.

New files: `favicon.ico` (7 sizes, at the site root where crawlers look first),
`favicon.svg`, `assets/favicon-16x16.png`, `favicon-32x32.png`,
`favicon-48x48.png`, `favicon-96x96.png`, `apple-touch-icon.png` (180px, opaque),
`icon-192.png`, `icon-512.png`, `icon-512-maskable.png`. All 16 pages link them.

Paths are root-relative (`/favicon.ico`). That is correct for a user site served
at `mgjillanimughal.github.io`. If you ever move the site into a project
subfolder, those paths need a prefix.

Google refreshes favicons on its own crawl schedule, so allow a few days after
deploy before the icon appears in search results.

## 2. SEO and technical
- 404 page was set to `index,follow`. Now `noindex,follow`.
- `robots.txt` disallows `/404.html` and keeps the sitemap reference.
- `sitemap.xml` lastmod updated to 2026-08-08.
- Added `og:image:type` and `twitter:image:alt` to every page.
- Upgraded the icon-font CDN hint from dns-prefetch to preconnect.
- Web manifest rebuilt with valid square icons plus a maskable variant.
- Hero image was a 2 MB 1530x1025 PNG rendered at 96x96. Replaced with a
  face-centred crop: 10 KB WebP with an 18 KB JPEG fallback and a 2x source.
  That was the largest load-speed problem on the site.
- Fixed a broken link: `jillanisofttech.medium.com/-587e1f1b9c00` has no slug and
  returns a 404. It now points at the Medium profile. Send the real article URL
  and swap it back in.

## 3. Presentation
- Removed every emoji, over 300 instances, including inside the FAQ schema
  markup. Where an emoji was acting as an icon it became a Font Awesome glyph.
- All 59 em dashes and 2 en dashes removed, including inside JSON-LD.
- Spelled-out numbers converted to digits sitewide, in body copy and in meta
  descriptions: "two full days now takes two minutes" to "2 full days now takes
  2 minutes", "seven channels" to "7 channels", "Nine production AI systems" to
  "9 production AI systems", "Four to six weeks" to "4 to 6 weeks".

## 4. Content
Homepage previously ran hero, credentials, metrics, value props, engagement
models, CTA. A visitor saw claims about you before any evidence for them. Now:

- Hero opens on the buyer's problem rather than your CV.
- New section "The Demo Passed. Production Did Not." names the 4 reasons AI
  programmes stall and what the build method does about each, each one anchored
  to a real figure from your work.
- New section "3 Systems, 3 Numbers That Moved" puts 3 case studies with hard
  metrics on the homepage, each linking into the existing case study page.
- Value props section reframed as what the averages are measured against.
- CTA rewritten to say what the buyer walks away with, including the line that
  you will say so when generative AI is the wrong tool.
- About page founder story rewritten around a concrete turning point instead of
  a summary of credentials.
- Work page intro now leads with constraints and metrics.

All new markup reuses existing CSS classes. Nothing in `style.css`, `app.js`,
the layout, class names or IDs was touched.

## 5. Two claims I changed, revert if you disagree
- The metric tile "24/7 Support Coverage" is now "99.9% Production Uptime",
  which is in your canonical fact sheet. A 24/7 support promise is hard to
  defend in procurement for a founder-led studio.
- About page "24/7 monitoring and support" is now "Monitoring, alerting and
  drift detection from day 1".

## 6. Pricing, realigned to jillanisoftech.com
Pricing now matches the company site and reads as scoped rather than fixed-cheap.
The old $2,400 sprint, $9,800 pilot, $19,500 ownership and $45/hr line are gone.

| Card | Price | Duration |
|---|---|---|
| Scoping Call | Free | 30 minutes |
| RAG or Automation Build | from $3,500 | 2 to 4 weeks |
| Enterprise AI Platform | $15K to $60K+ | 8 to 16 weeks |
| Retainer and Team Augmentation | $4.8K to $6K per month | rolling, 6 months or longer |

The page now leads with why a range is a range: data volume and sensitivity,
integration count and compliance load, with the final number confirmed in writing
after the free scoping call. The hourly band no longer publishes a rate; it says
the rate is set per engagement and agreed in writing, which stops a low headline
number anchoring an enterprise negotiation.

Engagement names were renamed to match across the homepage, services page, case
study metadata, pricing FAQ and the Offer and FAQPage schema, so nothing on the
site still refers to a Readiness Sprint or Managed AI.

## 7. AMD AI Developer Program
Added as a membership everywhere the NVIDIA programme already appeared: homepage
marquee, hero badge, the Recognized on row, About achievements grid, About
affiliations list, contact page recognition list, and a `memberOf` entry in the
Person schema on all 16 pages. The recognition card links to
`amd.com/en/developer/ai-dev-program.html`.

## 8. WhatsApp, and a broken icon bug worth understanding
Every WhatsApp link on the site now uses your format:

    https://wa.me/923211179584?text=Hi%2C%20I%20am%20interested%20in%20your%20AI...

Buttons read **Chat on WhatsApp** with the brand icon.

**The missing icon was a real bug, not a styling choice.** Your stylesheet
defines `.fab` for the floating action button (`position:fixed; opacity:0`).
Font Awesome uses `.fab` for its brands font family. So every
`<i class="fab fa-whatsapp">` inherited the floating-button rules and became an
invisible fixed-position element. Verified in a browser against your original
files: those icons computed to `position:fixed, opacity:0`.

It hit 16 icons, not just WhatsApp: 5 WhatsApp icons and the 10 GitHub icons on
the work page. Everything using the `fa-brands` spelling was unaffected, which
is why LinkedIn, Kaggle and Medium looked fine and WhatsApp did not.

Fix: all `class="fab fa-*"` changed to `class="fa-brands fa-*"`. No CSS touched.
**When you add brand icons in future, always write `fa-brands`, never `fab`, on
this site.**

## 9. Support-coverage wording
Automated monitoring still says 24/7, which is accurate for a system. What
changed is the promises a person has to keep: the services page KPI now reads
Automated Monitoring, Alerting and Drift Detection, and the support FAQ says
maintenance runs on a retainer with a response window agreed in the contract.

## 10. Final pass before launch
- AMD added to the About certifications grid as well, sitting beside NVIDIA and
  labelled **Developer Program** rather than a certification, and the section
  intro now says certifications are marked as certifications and memberships as
  memberships. That distinction is what keeps the whole grid credible when a
  buyer checks one card.
- 3 meta descriptions ran past the ~160 character snippet limit and were cut to
  fit. No 2 pages share a title or description.
- Case study pages now declare `og:type=article` for correct social previews.
- Added a `<noscript>` rule so the preloader can never trap the page if the
  script fails to load.
- `app.js` had 1 emoji and 3 em dashes in user-facing strings. Cleaned.
- Cache string bumped from `?v=26` to `?v=27` on all 16 pages, since `app.js`
  changed. Do not skip this on future JS or CSS edits.
- Ran every page through a headless browser: no JavaScript errors, 1 h1 per
  page, every image has alt text, every internal path resolves, all 41 JSON-LD
  blocks parse.

## 11. Per-page SEO state at launch

Every indexable page has: a unique title and description within snippet limits,
a self-referencing canonical, `og` and `twitter` tags with an absolute image,
exactly 1 `h1`, `lang="en"`, and valid structured data. All 15 real pages are in
`sitemap.xml`; `404.html` is `noindex,follow` and excluded, which is correct.

| Page | Title | Desc | Words | Schema |
|---|---|---|---|---|
| index | 59 | 157 | 1,662 | Person, ProfessionalService, Breadcrumb, WebSite |
| services | 46 | 148 | 1,368 | + FAQPage |
| work | 47 | 127 | 1,125 | + ItemList of 9 case studies |
| about | 49 | 161 | 953 | Person, ProfessionalService, Breadcrumb |
| pricing | 65 | 160 | 744 | + FAQPage, OfferCatalog |
| 9 case studies | 42 to 61 | 137 to 146 | 432 to 599 | + Article |
| contact | 50 | 145 | 218 | + ContactPage |

Fixed in this pass:
- **Duplicate structured data on all 9 case studies.** Each carried the Person,
  ProfessionalService and BreadcrumbList blocks twice, including 2 competing
  breadcrumb trails, 1 of which stopped at Work instead of naming the case
  study. Kept the complete trail and 1 copy of each entity.
- **Added an ItemList to the work page** so the 9 case studies are read as a
  collection rather than 9 unrelated links.
- **Added `dateModified` to every Article** so the case studies carry a freshness
  signal.

Known and deliberate:
- Internal links point at `index.html` while the canonical is the bare `/`. The
  canonical consolidates them, and the active-nav script matches on
  `index.html`, so changing the links would break the Home highlight for no real
  gain.
- The contact page goes from `h1` to `h3`. The `h3` styling is element-based, so
  promoting them to `h2` would change the design for a negligible signal.
- Word count on the contact page is low by design. It is a conversion page, not
  a ranking page.

## 12. Still open
- **Certification links.** 3 of the 4 cards on the homepage point at your Credly
  profile rather than the individual badge, with `SWAP LATER` comments in the
  source. Send the badge URLs and I will wire them up.
- **Medium article link.** One case study link had no slug and 404d; it now
  points at your Medium profile.
- **The contact form does not send anything.** It builds a `mailto:` link and
  hands off to the visitor's mail app. Anyone on webmail without a configured
  desktop client sees nothing happen, and you never learn they tried. This is
  the single biggest conversion leak left on the site. Give me a Formspree
  endpoint (or reuse the one on jillanisoftech.com) and it becomes a real POST
  with a thank-you state.
- **Analytics and Search Console.** Neither is installed. Without them you
  cannot see whether any of this is working, and Search Console is also how you
  submit the sitemap and check that the favicon and rich results are picked up.
