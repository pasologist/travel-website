# Site reference: C&R Luxurious Travel

The single place to look up how the site is built, what each file does, and what to edit when something changes. Read [01-hostinger-deployment-guide.md](01-hostinger-deployment-guide.md) for installation and [02-task-list.md](02-task-list.md) for what is still open.

## 1. Brand and design system

The design merges the warmth, palette and typography of the example files you supplied (`cr-luxurious-travel updated.html`, `piece1.html`, `piece2.html`) with the page structure and content of the reference site <https://www.lhvcresorts.com/en/>, used with the owners' permission.

### Palette (CSS custom properties on `.cr`)

| Token | Hex | Used for |
|---|---|---|
| `--sand` | #F8F2E7 | page background |
| `--sand-2` | #F1E7D5 | light accents on dark bands |
| `--sand-3` | #E7DAC1 | borders, dividers |
| `--cream` | #FFFCF6 | cards, light text on dark |
| `--ink` | #2B2117 | headings, body text, footer background |
| `--ink-soft` | #5A4C39 | secondary text |
| `--teal` / `--teal-deep` | #3E7C76 / #2E5F5A | prices, active filters, CTA band, mobile menu |
| `--brass` / `--brass-deep` | #B58A4B / #977033 | buttons, eyebrows, tier badges |
| `--clay` | #BC6A45 | script accents in headings |
| `--gold` / `--gold-soft` | #F0D49A / #EBD9B8 | script text on photos |

### Typography (Google Fonts)

- **Cormorant Garamond** 400–600: headings, prices, quotes.
- **Outfit** 300–600: body text, labels, buttons.
- **Parisienne**: script accents (`.script`).

### Voice

Warm, first-person plural, advisor-led. "Private access", "your advisor", "we confirm" rather than "membership" or "book now". Prices are always framed as published starting rates that the advisor confirms.

## 2. Page map and how it maps to the reference site

| C&R page | Slug | Mirrors on lhvcresorts.com | Notes |
|---|---|---|---|
| Home | `/` | Home | Hero, intro + stats, featured stays, all-inclusive band, experience tiles, how it works, why C&R, worldwide band, CTA |
| Stays | `/stays/` | Hotels and Villas | Filters: all, resorts & suites, villas, Puerto Plata, Cabarete. `?filter=villa` or `#villa` pre-selects |
| Stay | `/stay/?stay=<id>` | each property page | One page renders any of the 11 properties from `PROPERTIES` |
| All-Inclusive | `/all-inclusive/` | All Inclusive | Included items, VIP tier, all-inclusive resorts, FAQ |
| Dining | `/dining/` | Dining | 19 venues, filter by style and location |
| Spa & Wellness | `/spa/` | Spa | Yin Yang Spa categories |
| Experiences | `/experiences/` | Activities + Excursions | Tabs: activities, water, shore. `?tab=shore` or `#shore` pre-selects |
| Weddings & Events | `/weddings/` | Weddings | Six packages, gallery, inquiry form |
| Offers | `/offers/` | Promotions | Six offer cards |
| Contact | `/contact/` | Contact | Inquiry form, contact cards, map, FAQ. `?stay=<id>` preselects the property, `?subject=…` the subject |

Not carried over from the reference site: the live booking engine and "My Bookings" (C&R sells through advisors, so every CTA leads to the inquiry form), the Instagram feed, and the awards badge.

## 3. Repository layout

```
travel-website/
├── README.md
├── docs/
│   ├── 01-hostinger-deployment-guide.md   procedures, theme notes, troubleshooting, sources
│   ├── 02-task-list.md                    checklist for you and Claude
│   └── 03-site-reference.md               this file
├── wordpress/plugin/cr-luxurious-travel/  SINGLE SOURCE OF TRUTH
│   ├── cr-luxurious-travel.php            plugin: enqueues assets, template, page installer, admin screen, form handler
│   ├── templates/cr-blank-canvas.php      blank page template for classic themes
│   ├── assets/cr-style.css                PIECE 1 – global styles
│   ├── assets/cr-site.js                  PIECE 2 – global script (data, nav/footer, renderers, behaviour)
│   ├── pages/*.html                       PIECE 2 – one Custom HTML block per page
│   └── readme.txt
├── tools/build.ps1                        builds preview/ and dist/
├── preview/                               generated: standalone HTML pages for local review
└── dist/cr-luxurious-travel.zip           generated: upload this to WordPress
```

Run `tools\build.ps1` after every edit. `preview/` and `dist/` are build outputs; edit the plugin folder, never the outputs.

## 4. Editing guide

### Properties, prices, navigation, contact details: `assets/cr-site.js`

- `SITE` (top of file): brand name, email, phone, hours, navigation items and the CTA label.
- `PROPERTIES`: one object per property. Fields: `id` (used in URLs), `cat` (`hotel` or `villa`), `area` (`puerto-plata` or `cabarete`), `tier` (badge text), `loc`, `name`, `tagline`, `price` (`from $X / night` is auto-formatted; anything else is shown as-is), `glance` (chips), `short` (card text), `desc` (array of paragraphs), `feats` (bullet list), `gallery` (image ids; the first is the card and hero image).
- To add a property: copy an object, give it a new `id`, add it to `data-featured` on the home page if it should be featured, and add a link in `all-inclusive.html` if it is an all-inclusive resort.

### Page copy and images: `pages/*.html`

Plain HTML. Each file starts with `<div class="cr" data-page="…">` and must keep that wrapper. Useful conventions:

- Links between pages use `data-href="stays"` (plus `data-stay="crown-villas"`, `data-filter-link="villa"`, `data-hash="inquiry"`), so the same file works in WordPress and in the local preview.
- Hero images are set with `style="--hero-img:url('…')"` on the `.hero` / `.page-hero` element; band backgrounds with `--band-img`.
- Filterable grids: a container with `data-filter-group data-filter-target="#id"` holding `.filter-btn[data-filter]` buttons; items carry `data-cat="token token"`.
- Tabs: a container with `data-tabs`, `.tab-btn[data-tab]` buttons and `.tab-panel[data-panel]` panels.
- Galleries with a lightbox: any container with `data-lightbox`; optional `data-full` on images for the large version.
- Forms: `<form data-cr-form>` with the hidden fields shown in `contact.html`. The plugin posts them to `admin-post.php?action=cr_inquiry`; previews fall back to a pre-filled email.

### Design: `assets/cr-style.css`

Sections are numbered in the file header. Every selector is prefixed with `.cr`; keep that prefix on new rules so theme styles cannot interfere. Breakpoints: 1180px (tighter nav), 1080px (mobile menu), 980px (two columns), 620px (one column).

## 5. Images

All photography is served from the reference site's CDN, `https://cdn2.paraty.es/lhvc-corpo/images/<id>=s<size>`, with the site owners' permission. The `=s` suffix asks the CDN for a resized copy: `s800` for cards, `s1200` for feature rows, `s1400` for galleries, `s1900` for heroes. If you later prefer to host images yourself, upload them to the WordPress Media Library and replace the URLs (in `cr-site.js` for properties, in the page files for everything else).

## 6. Content to verify before launch

These values were taken from the reference site on 2 September 2026 and should be confirmed with the resorts or replaced:

- **Starting rates** per property (`price` in `cr-site.js`): Tropical $89, Cofresi Palm $147, Crown & Residence $118, Presidential $100, Cabarete $79, Sunrise $300, Royal Suites $300, Crown Villas $1,920, Cliff $1,920, Royal Villas $1,600, Villa Park $153.
- **Wedding packages** (`pages/weddings.html`): $1,100 / $1,850 / $5,950 / $7,500 / $9,000 / $11,500. The reference page listed the two "Love in Paradise" tiers in an order that looked swapped; the site shows the Supreme tier as the higher price.
- **Excursion prices** (`pages/experiences.html`) and **restaurant hours** (`pages/dining.html`).
- **Offers** (`pages/offers.html`): 5×4, up to 40%, flight + hotel up to 45%, extra 5% non-refundable, extra 10% loyalty. The sixth card (villa reunion rates) is a C&R offer, not a resort promotion.
- **Contact details**: email and phone placeholders (see the deployment guide, 5.2). Resort address Cofresí Beach #1, Puerto Plata 57000.
- **Statistics** on the home page: 11 properties, 1,180+ rooms, 14 pools, 2 beaches, 7 hotels, 11 restaurants, 13 bars (from the reference site), and 300,000+ exchange destinations / 110+ countries (from your example files).

## 7. Behaviour reference (what the script does)

1. Adds `cr-html` / `cr-body` classes, injects the navigation at the top of `.cr` and the footer at the bottom.
2. Renders the featured grid on Home, the full grid on Stays, and the whole property page on Stay (also sets the browser title).
3. Resolves `data-href` links, smooth-scrolls in-page anchors, fills `select[data-properties]` with the property list.
4. Wires filters, tabs, the lightbox, reveal-on-scroll animations, the mobile menu (Escape closes it) and the transparent-to-solid navigation on scroll.
5. Prepares forms: sets the time-trap field, points the form at the plugin handler (or email fallback), and shows the success/error notice from `?cr_sent=1` / `?cr_error=code`.

The script exposes `window.CR` (`site`, `properties`, `url()`, `img()`, `config`) for debugging in the browser console.
