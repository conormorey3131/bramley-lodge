# Bramley Lodge — Website Rebuild Brief

> **Kick-off prompt (paste this into Claude Code in this folder):**
> *Read BRIEF.md in full before writing any code. Then build the complete website it specifies, following the build order in §12. Use ONLY the content in §8 — never invent menu items, prices, opening hours, or facts. Where the brief marks something TODO, use the placeholder and flag it to me at the end. Self-verify against the checklist in §15 before telling me you're done.*

---

## 1. Project summary

Replace **bramleylodge.ie** (dated single-page WordPress site) with a top-of-the-range, hand-built static site for **Bramley Lodge** — a family-run restaurant & bar operating since 2009 on the edge of Fota Island at Tullagreen, Carrigtwohill, Co. Cork. They serve breakfast through dinner seven days a week, with a more refined "Orangery" evening menu, a busy bar (cocktails, draught), and an in-house bakery/coffee counter.

The site's jobs, in order: (1) rank and convert for local searches — people deciding where to eat near Carrigtwohill / Fota / East Cork; (2) present the menus beautifully and accurately; (3) make calling to book effortless, especially on mobile; (4) feel as premium as the food photography.

Client of Morey Digital. Built and maintained by Conor via Claude Code.

## 2. Hard requirements (non-negotiables)

- **Mobile-first.** Most traffic will be phones. Design at 390px first, enhance upward. Thumb-reachable call CTA.
- **Best-in-class SEO** — see §9. Semantic HTML, per-page metadata, structured data, sitemap, fast Core Web Vitals.
- **Lighthouse ≥ 95 in all four categories** on Home and one menu page, mobile emulation.
- **Modern, warm, elegant design** with tasteful motion (§5–6). It must NOT look like a template.
- **Accurate content.** Menus in §8 are the single source of truth. No invented dishes, prices, hours, or claims.
- **Accessible** (§11) and fully usable with JS disabled (menus, hours, phone number all in plain HTML).

## 3. Tech stack & hosting

- **Vanilla HTML + CSS + JS. No frameworks, no jQuery, no Bootstrap/Tailwind, no build step for the site itself.** Multi-page static site — this is the fastest option and the easiest to maintain.
- One shared stylesheet `assets/css/style.css`; one small script `assets/js/main.js` (< ~15 KB min). Node scripts are allowed as *one-off tooling* (image resizing, favicon generation) but must not be needed to serve the site.
- **Hosting: GitHub Pages** with the custom domain **bramleylodge.ie** (§13). Consequences:
  - No server-side code → no forms. Contact = phone + email links. Careers = email link.
  - Include `CNAME` file (containing `bramleylodge.ie`), `.nojekyll`, and a designed `404.html`.
- Git repo rooted in this folder. **Add `July / `, `july-photos/`, and `*.MOV` masters to `.gitignore`** — only optimized derivatives in `assets/` get committed.

## 4. Site map & URL structure

Pretty URLs via folder-based `index.html` files:

| URL | Page | H1 |
|---|---|---|
| `/` | Home | Bramley Lodge (visually: logo + tagline hero) |
| `/menus/` | Menus overview + coffee & tea + allergen key | Our Menus |
| `/menus/breakfast/` | Breakfast menu | Breakfast at Bramley Lodge |
| `/menus/lunch-dinner/` | The 2026 all-day menu | Lunch & Dinner Menu |
| `/menus/orangery-evening/` | Orangery evening menu | The Orangery Evening Menu |
| `/gallery/` | Photo gallery with lightbox | Gallery |
| `/about/` | Our Story + About (one narrative page) | Our Story |
| `/careers/` | Join Our Team | Join Our Team |
| `/contact/` | Contact, hours, map, directions | Contact & Find Us |
| `/404.html` | Not found (on-brand, links home + menus) | — |

- Global header nav: Menus · Gallery · Our Story · Careers · Contact + a distinct **"Call to Book"** button (`tel:+353214882499`).
- Home sections: hero → intro/story teaser → menu cards (Breakfast / Lunch & Dinner / Orangery Evening, each linking to its page) → food & drink photo band → "The Bar" band (cocktails) → social/follow band (§7 videos) → visit us (hours + address + map link) → footer.
- Footer on every page: cream logo variant, address, phone, hours summary, social icons (Instagram, TikTok, Facebook), © Bramley Lodge 2026. Optional small "Website by Morey Digital" link → https://moreydigital.ie.
- The old site was one page with anchors (`/#our-menu` etc.) so inbound deep links all resolve to `/` — no redirects needed. Keep `index.html` at root.

## 5. Design direction — "warm & elegant, dark accents"

The interiors are the design brief: deep green panelling, dark timber-slatted ceilings, marble bar tops, brass details, patterned tiles, chalkboards, and a hand-illustrated apple logo. The site should feel like the room.

**Palette (CSS custom properties):**

| Token | Hex | Use |
|---|---|---|
| `--ink` | `#20241F` | Charcoal — headings, body on light |
| `--green-deep` | `#1E3A2C` | Bottle green — dark bands, footer, evening menu page accents |
| `--cream` | `#F6F2E9` | Primary light background (never pure white for large areas) |
| `--white` | `#FFFFFF` | Cards on cream |
| `--apple` | `#A9BF4F` | Logo apple green — small accents only (hover states, dividers, tags) |
| `--brass` | `#B58A4C` | Fine rules, ornaments, link underlines on dark |

Check every pairing for WCAG AA; darken/lighten tokens if needed (e.g. apple green is decorative only, never body text on cream).

**Typography:** self-hosted Google Fonts as subset woff2 (download once via tooling; no runtime Google request):
- Display/headings: **Fraunces** (soft, warm serif — sits beautifully with the hand-drawn logo). Use optical sizing, weights 400–600. Large H1s (clamp ~2.2rem→4.5rem), tight leading.
- Body/UI: **Inter** 400/500/600. 1.05–1.125rem body, relaxed line-height (1.6).
- Menu item names in Fraunces small-caps or 500; prices aligned right with dot leaders omitted (clean flex row); allergen numbers in small muted superscript-style spans.
- `font-display: swap`, preload the two primary woff2 files.

**Feel:** generous whitespace; full-bleed photography with slow-zoom; alternating cream and deep-green bands; thin brass rules as section ornaments (like the PDF menu's diamond dividers); the apple logo used properly (§7). Dark green sections give the "evening" register; cream sections the "daytime bakery" register — Home should flow day → night down the page.

**Header:** transparent over the hero (cream logo + cream links), transitioning on scroll to a compact solid charcoal/green bar with subtle `backdrop-filter: blur`. Mobile: logo + hamburger → full-screen slide-in drawer (staggered link reveal) + persistent compact "Call" button.

**Mobile extra:** a discreet sticky bottom bar (or floating pill) on phone widths with "📞 Call to book" — visible after scrolling past the hero, hidden when the footer is in view.

## 6. Motion & transitions

Tasteful and physical, never busy. All motion wrapped in `@media (prefers-reduced-motion: no-preference)`.

- **Scroll reveals:** IntersectionObserver adds `.is-visible`; elements rise 20–24px and fade over ~600ms `cubic-bezier(0.22,1,0.36,1)`, staggered ~80ms within a group. Fire once.
- **Hero:** on load, logo/headline/CTA stagger in; hero image does a slow 8s scale from 1.06→1 (Ken Burns, subtle).
- **Cross-page:** View Transitions API via the CSS `@view-transition { navigation: auto; }` rule for a ~250ms cross-fade between pages — progressive enhancement, zero JS; browsers without support just navigate normally.
- **Header** height/background transition on scroll (~300ms).
- **Cards/images:** hover lift (translateY(-4px) + shadow) and inner image scale 1.00→1.04 (~450ms). Focus-visible gets the same treatment.
- **Gallery lightbox:** fade + scale-from-thumbnail feel; ESC/arrow keys; built on `<dialog>`, no library.
- **Menu pages:** sticky in-page section nav (Starters / Mains / …) with a sliding active indicator; smooth-scroll to sections (`scroll-margin-top` set).
- Videos in the social band: lazy, muted, looped, `playsinline`, play only while in viewport (IntersectionObserver), paused entirely under reduced motion — posters always shown first.

## 7. Assets

All source material is in this folder. **Note: the raw folder is named `July ` — with a trailing space.** Always quote it in shell commands. A clean copy of all photos already exists at `july-photos/` — **work from `july-photos/` for images**; the videos remain only in `"July "`.

### Logo — `logo.PNG` (use it prominently)
Hand-illustrated green bramley apple + hand-drawn charcoal "bramley lodge" wordmark, transparent background, 610KB.
- Create optimized derivatives: trimmed SVG-sized PNGs/WebP at 2× for header + footer; a **cream/off-white recolour of the wordmark** (keep the apple green) for dark backgrounds; an **apple-only crop** for favicons, apple-touch-icon (180px), `icon-512` + `site.webmanifest`, and as a small ornamental motif (e.g. section divider mark).
- The og-image (§9) should compose logo + a hero food photo.

### Photos — `july-photos/` (55 professional images, shot July 2026)
Categorized inventory — use this to place images meaningfully (P=portrait, L=landscape):

- **Interiors:** `DSC09388` (L — orangery dining room, timber-slat ceiling, patterned tiles; **primary hero candidate**), `DSC09389` (P, same room), `DSC09508` (L — orangery corner with flamingo mural + garden windows), `DSC09464`, `DSC09465` (L — moody dark-panelled dining room, green LED glow; use for Orangery Evening page), `DSC09450`, `DSC09452` (P — set tables with dishes).
- **Bar & spirits:** `DSC09394` (P — branded menu on marble bar), `DSC09400` (P — two pints on the bar), `DSC09413` (P — glassware rack + timber ceiling), `DSC09415`, `DSC09420`, `DSC09422`, `DSC09423`, `DSC09425` (P — back-bar spirit shelves).
- **Cocktails:** `DSC09476`, `DSC09498` (P — mojito close-ups), `DSC09484` (L — mojito on bar), `DSC09487` (P — spritz at the tap), `DSC09494` (L — cocktail trio, selective-colour), `DSC09499` (L — martini + shot + spritz), `DSC09501` (P — pornstar martini). Use for "The Bar" band.
- **Coffee & bakery:** `DSC09405` (P — cake/deli counter with staff), `DSC09407` (P — barista + chalkboards), `DSC09411` (P — coffee machine), `DSC09503` (P — steaming milk), `DSC09504` (P — cappuccino by the cake counter). Use for Breakfast page + bakery mentions.
- **Food:** curry-skewer bowl `DSC09427/28/29/48/54/62` (`09429` is a striking top-down — great menu-card image), plated king prawns `DSC09434/36/45/57/58/59`, salads/poke `DSC09438/41/43`, chicken-skewer salad `DSC09467/68/70`, ravioli `DSC09475` (L), table spreads `DSC09464/65`.
- **Dessert:** `DSC09514/15/19` (P), `DSC09521` (L) — plated cake, lovely for a "baked in-house daily" moment.
- **Aerials (drone):** `DJI_..._0005–0008` (building, terrace umbrellas, car park — shows free parking and scale), `DJI_..._0009` (L — wide countryside + estuary view; perfect for the Our Story "edge of Fota Island" band).

Gaps to respect: **no breakfast-dish photos** (use coffee/scone/bakery shots on the Breakfast page, not unrelated dinner plates) and no staff portraits beyond the barista/counter shots.

### Videos — in `"July "` (masters; do not commit)
`Bramley Lodge bar mohito reel.mp4` (29MB), `Coffe cake reel.mp4` (27MB), `PMartini edit .mp4` (26MB — note trailing space in name), `3b7c42da….MOV` (26MB — inspect it; if it's good b-roll, consider it too).
For the **social/follow band**: compress with ffmpeg → H.264, 720p max, CRF ~28, audio stripped, `+faststart`, target ≤ 4MB each, plus a jpg poster frame. Three portrait loop cards linking out to Instagram/TikTok.

### Image pipeline (one-off script, run before building pages)
- Generate **AVIF + WebP + JPEG fallback** at widths 480 / 800 / 1200 / 1600 (hero also 2000), quality ~65–75, EXIF stripped, into `assets/img/`.
- Serve via `<picture>` + `srcset/sizes`; every `<img>` gets `width`/`height` (no CLS), `loading="lazy"` + `decoding="async"` (except the LCP hero: eager + `fetchpriority="high"` + `<link rel="preload">`).
- Meaningful `alt` text everywhere (describe the dish/room, not "photo of food"); decorative ornaments get `alt=""`.

## 8. Content — single source of truth

Menus below were extracted from the client's **2026 printed menu PDF** (lunch & dinner — authoritative, includes prices) and the current live site (breakfast, evening, coffee — no prices published). Reproduce faithfully. Obvious print typos have been corrected; anything genuinely uncertain is marked **[confirm]**. Do not "improve" dish names or descriptions beyond this.

### Business facts
- **Name:** Bramley Lodge (restaurant & bar). Family-run since 2009.
- **Address:** Tullagreen, Carrigtwohill, Co. Cork, T45 K338, Ireland — on the edge of Fota Island.
- **Phone:** +353 21 488 2499 (display: `021 488 2499`; links: `tel:+353214882499`)
- **Hours:** Sun–Wed 9:00am–7:30pm (food orders until 7:00pm) · Thu–Sat 9:00am–10:30pm (food orders until 9:00pm). Open seven days, breakfast through dinner.
- **Socials:** Instagram https://www.instagram.com/bramleylodge_food/ · TikTok https://www.tiktok.com/@bramleylodge · Facebook https://www.facebook.com/BramleyLodge
- **Careers email:** bookings@bramleylodge.ie (confirmed by Conor, Aug 2026)
- **Contact email:** bookings@bramleylodge.ie (confirmed by Conor, Sep 2026) — shown on Contact and in every footer; phone stays the primary booking CTA.
- **Positioning phrases** (usable in copy): "the very best of countryside dining" · locally sourced ingredients, local farmers and artisans · everything baked in-house daily · Ballycotton seafood, Clonakilty pudding, Skeaghanore duck (real supplier names from the menus — use naturally, don't overdo).

### About / Our Story (base copy — light polish allowed, meaning unchanged)
> There's nothing quite like the taste of wholesome, nutritious, and traditionally cooked food using the finest ingredients and recipes handed down through the generations. We take the very best locally sourced produce and apply our craft as only we can — nothing added but a dollop of skill and a generous sprinkling of passion, bringing you the natural flavours you love.
>
> Bramley Lodge is a family-run restaurant and bar, operating since 2009 on the edge of Fota Island at Tullagreen. We serve locally sourced food because we believe in supporting local businesses, working closely with local farmers and artisans for the freshest produce possible. Open from breakfast to dinner, seven days a week.

### Careers page copy (base)
> We're always interested in hearing from hardworking, motivated people. We offer a healthy work–life balance, a transparent pay structure, and real opportunities for advancement. Send us your details and CV at **bookings@bramleylodge.ie**.

### Allergen key (show on every menu page)
1 Gluten · 2 Crustaceans · 3 Eggs · 4 Fish · 5 Peanuts · 6 Soy beans · 7 Milk · 8 Nuts · 9 Celery · 10 Mustard · 11 Sesame seeds · 12 Sulphur dioxide & sulphites · 13 Lupin · 14 Molluscs
Note under each menu: allergen numbers are shown in brackets beside each dish.

### MENU 1 — Breakfast *(from live site; no prices published — leave prices off, TODO if client supplies them)*

**Breakfast**
- **Bramley Full** — 2 bacon, 2 sausage, black & white pudding, portobello mushroom, crispy potato, free-range egg, sourdough toast (1,3)
- **Eggs Benedict** — bacon, poached eggs, toasted sourdough, hollandaise sauce, crispy potatoes (1,3,7)
- **Eggs n Hash** — poached eggs, toasted sourdough, Clonakilty black pudding, crispy potatoes, hollandaise sauce (1,3,9,10,12)
- **Turkish Eggs** — garlicky Greek yogurt, poached eggs, lightly spiced chilli oil, served with flatbread (1,3)
- **Scrambled Eggs** — three eggs scrambled on sourdough toast (1,3,7)
- **Avo on Sourdough** — 2 poached eggs, crushed avocado, toasted seeds, roast carrot hummus, toasted sourdough, spiced potatoes (1,3,13) · add crispy bacon

**Breakfast Light**
- **Bramley Pancakes** — homemade chocolate sauce or maple syrup (1,3,7)
- **Organic Overnight Oats** — almond milk, fresh berries, toasted hazelnuts, honey drizzle (1)
- **Homemade Scone** — plain or fruit, freshly whipped cream, raspberry jam, Irish butter (1,3,7)
- **For the Kids** — poached egg on sourdough (1,3) · add bacon or sausage

### MENU 2 — Lunch & Dinner *(2026 menu — authoritative, with prices in €)*

**Starters**
- **Soup of the Day** — soda bread, butter — 7.00 (1,7,8,9)
- **Pear & Goat Cheese Empanada** — thyme & hazelnut pesto, crème fraîche, raisins — 10.95 (1,3,7,8)
- **Thai Sticky Chicken Wings** — chilli & lime BBQ sauce, furikake — 11.50 (1,6,11,13)
- **Seafood Chowder** — Ballycotton seafood, soda bread — large 14.50 / small 11.00 (1,4,7,9,14)
- **Chicken Liver Parfait** — marjoram butter, Cumberland sauce, rustic bread — 11.95 (1,7)
- **Coconut King Prawn Tacos** — pineapple salsa, harissa mayo — 11.50 (1,2,3,7)
- **Wild Mushroom Tortelloni** — mushroom velouté, sage crumb, pesto, aged Parmesan — 10.95 (1,3,7,8,13)

**Mains**
- **Fillet of Hake** — colcannon galette, tenderstem broccoli, chervil & mussel velouté — 19.95 (2,4,5,7,8,11,14)
- **Grilled Seafood Skewers** — red rice & quinoa salad, orange, rocket, watermelon, cashews, pomegranate & orange dressing — 19.95 (1,2,4,5,6,8)
- **Pasta Salsiccia e Friarielli** — Italian sausage, wilted greens, pancetta, Parmesan, saffron — 18.50 (1,7,8,13)
- **Angus 8oz Beef Burger** — crispy pancetta, red pepper & fenugreek chutney, tomato, fried onions, cheese, pickles, chips — 19.95 (1,3,7)
- **Fish n Chips** — rosemary sea salt fries, tartar sauce — 19.95 (1,2,3,4,13,14)
- **Thai Chicken Curry** — lemongrass jasmine rice — 19.95 (4,14)
- **Miso Chicken Salad** — mixed leaves, pomegranate, feta cheese, crispy lardons, roasted potato cubes, mustard dressing — 18.95 (1,3,6,7,8,11,13)

**Poke Bowls** *(vegan option available)* — all served on: sushi rice, braised eggs, avocado, edamame beans, pickled red cabbage & radish, tofu, pineapple, peanuts, furikake, sambal oelek, vegan mayo
- **Tempura Broccoli** — 15.50 (1,3,5,6,8,11)
- **Tempura Prawns** — 18.95 (1,2,3,5,6,8,11,14)
- **Panko Chicken** — 18.95 (1,3,5,6,8,11)

**Hummus Plate**
- **Lebanese Chicken Skewer** — za'atar flatbread, hummus, Middle Eastern salad, almonds, pomegranate, nuts, curry leaf oil, lemon & tahini yoghurt — 17.95 (1,6,7,8,11,13)

**Sandwich**
- **Chicken Katsu Flatbread** — Asian slaw, toasted sesame seeds, curry mayonnaise, rosemary sea salt fries — 16.95 (1,3,7,8,11)

**Kids Menu** *(under 12s)*
- **Chicken Tenders** — chips — 10.50 (1,3,12,13)
- **Linguine Pasta with Tomato Sauce** — garlic bread, Parmesan cheese — 10.50 (1,3,7,9,13)
- **Fish and Chips** — haddock & chips — 10.50 (1,4,12,13)

**Granny Grant** *(cup of soup + sandwich + cake of the day — set as printed **[confirm structure]**)*
- **Swedish Prawn Sandwich** — 14.95 (1,3,7,8) **or** **Basil Chicken Sandwich** — 15.50 (1,3,7,8)
- Cup of Soup (1,3,7,8,13) · Cake of the Day (1,7,8,9,10,13)

**Sides** — all 5.50: Chips · Jasmine Rice · Maple Glazed Vegetables · Organic Green Salad

### MENU 3 — The Orangery Evening Menu *(from live site; no prices published — TODO. Serving days/times not published — TODO, do not guess)*

**Starters**
- **Pork Belly & Scallion Skewer (Yakiton)** — miso peanut sauce, togarashi, furikake, micro coriander (1,4,5,6,8,11) **[confirm allergens — site prints "1,45,6,8,11"]**
- **Konro-Grilled King Prawns** — nam jim dressing, peanuts (1,2,4,6,8,11)
- **Squid Kara-age** — sambal kewpie mayo, smoked paprika, lime (1,6,7,14)
- **Vegetable Gyoza** — ponzu sauce, pickled ginger, sesame seeds (1,6,11)
- **Pear & Goat Cheese Empanada** — thyme & hazelnut pesto, crème fraîche (1,4,7,8,11,13)

**Mains**
- **Fillet of Seabass** — sea urchin cream sauce, basil, mussels, prawn, tenderstem broccoli (1,2,3,7,11,14) **[confirm wording — site prints "Sorrisi basil"]**
- **Grilled 8oz Rib Eye Steak** — portobello mushroom, crispy onions, pepper sauce, chips (1,7,9)
- **Grilled 10oz Steak** — portobello mushroom, crispy onions, pepper sauce, chips (1,7,9)
- **Skeaghanore Duck Breast** — cardamom carrot purée, fondant potato, raspberry compote, baby carrots, duck jus (7,9,12)
- **Japanese Chicken Skewers (Ton Negima)** — saffron coconut cream sauce, lemongrass, kaffir lime leaves, jasmine rice (1,7,9,12) **[confirm name — "tori" is chicken, "ton" is pork]**
- **Fish & Chips** — gribiche sauce, pea purée (1,2,4,13,14)
- **Kale & Mango Salad with Spicy Prawns** — seaweed kewpie dressing, avocado, quinoa, pomegranate, almonds (1,3,7)
- **Burrata Cheese & Spinach Ravioli** — cherry tomatoes, oregano butter sauce, basil, pangrattato, Parmesan (1,3,7)

**Dessert**
- **Vanilla Crème Brûlée** (3,7) · **Chocolate Brownie** (1,3,7) · **Strawberry Gâteau** (1,3,7)

### Coffee & Tea *(on `/menus/` overview; no prices published)*
Americano · Cappuccino · Flat White · Latte · Mocha · Espresso · Double Espresso · Decaf Coffee · Barry's Tea · Selection of Herbal Teas · Hot Chocolate

### The Bar (short copy block, not a priced menu)
Full bar with cocktails made to order (mojitos, spritzes, pornstar martinis pictured in the gallery), draught beers, wines and Irish whiskeys. Do not publish a priced drinks list — none exists yet.

## 9. SEO spec

**Local search intent to win:** restaurant Carrigtwohill · restaurant near Fota Island / Fota Wildlife Park · breakfast & brunch East Cork · lunch Carrigtwohill · evening meal / dinner Cork · family restaurant Cork · bar food Carrigtwohill. Work these into headings, intro copy, and metadata *naturally* — no keyword stuffing, no hidden text.

**Per-page `<title>` + meta description** (write descriptions ~150 chars, benefit-led, include locality; titles as below):
- `/` — `Bramley Lodge | Restaurant & Bar in Carrigtwohill, Cork`
- `/menus/` — `Our Menus | Bramley Lodge, Carrigtwohill`
- `/menus/breakfast/` — `Breakfast Menu | Bramley Lodge, Carrigtwohill, Cork`
- `/menus/lunch-dinner/` — `Lunch & Dinner Menu | Bramley Lodge, Carrigtwohill, Cork`
- `/menus/orangery-evening/` — `The Orangery Evening Menu | Bramley Lodge, Cork`
- `/gallery/` — `Gallery | Bramley Lodge Restaurant & Bar`
- `/about/` — `Our Story | Bramley Lodge — Family-Run Since 2009`
- `/careers/` — `Join Our Team | Bramley Lodge, Carrigtwohill`
- `/contact/` — `Contact & Opening Hours | Bramley Lodge, Carrigtwohill`

**Technical:**
- One `<h1>` per page; logical h2/h3 hierarchy; semantic landmarks (`header/nav/main/section/footer`); descriptive internal anchor text; breadcrumb trail on menu subpages.
- `rel="canonical"` on every page (absolute `https://bramleylodge.ie/...`), trailing-slash URLs consistently.
- Open Graph + Twitter card on every page; generate a branded 1200×630 `og-image` (logo + hero food shot) plus page-specific og images for the three menu pages.
- `sitemap.xml` (all 9 pages) + `robots.txt` referencing it.
- **JSON-LD on every page:** `Restaurant` — name, `servesCuisine` ["Irish","European","Asian"], `priceRange` "€€", address (T45 K338), `telephone` "+353214882499", `openingHoursSpecification` (two blocks per §8 hours), `sameAs` [Instagram, TikTok, Facebook], `image` (2–3 absolute URLs), `hasMenu` → menu section URLs, `acceptsReservations` "True" with phone. Add `geo` coordinates from their Google Business Profile pin — **TODO Conor supplies; leave commented-out if unknown, do not guess**. Menu pages additionally get `Menu`/`MenuSection`/`MenuItem` structured data generated from §8 (including `offers` with price+`priceCurrency: EUR` where prices exist). `BreadcrumbList` on subpages.
- Validate all JSON-LD with Google's Rich Results test rules (well-formed, no fabricated fields).

## 10. Performance budget (enforced, not aspirational)

- Lighthouse mobile ≥ 95 across Performance / Accessibility / Best Practices / SEO on `/` and `/menus/lunch-dinner/`.
- LCP < 2.0s (throttled mobile), CLS < 0.05, TBT < 100ms.
- Per page: HTML ≤ 30KB, CSS one file ≤ 30KB, JS ≤ 15KB (all pre-gzip); hero image ≤ 180KB (AVIF); total first-load ≤ 1MB on Home.
- Two woff2 font files preloaded, subset to latin; no third-party scripts, no analytics, no cookie banner (nothing sets cookies), no external embeds (Google Maps is a static image/photo linking out to the Maps place — no iframe).
- Test with `python3 -m http.server` + Lighthouse CLI (`npx lighthouse`) locally.

## 11. Accessibility

- WCAG 2.1 AA contrast throughout (check brass/apple accents especially).
- Skip-to-content link; visible focus states matching the design; logical tab order; hamburger + lightbox fully keyboard operable with correct `aria-expanded`/`aria-label`s; `dialog` for lightbox.
- Menus are real text in semantic lists — never images of menus. Allergen numbers get an accessible explanation (`<abbr>` or a linked key).
- `prefers-reduced-motion` disables reveals, Ken Burns, autoplaying video loops.
- `lang="en-IE"` on `<html>`.

## 12. Build order

1. **Asset prep:** inspect `july-photos/` + `"July "` videos (peek at the unnamed `.MOV`); run the image pipeline (§7) via a one-off Node script using `sharp` (`npm i -D sharp`, keep out of runtime); ffmpeg the three reels; generate favicons + cream logo variant + og images.
2. **Design system:** `style.css` tokens (palette, type scale, spacing, container widths), base elements, buttons, cards, bands, header/footer.
3. **Pages** in §4 order, content strictly from §8.
4. **JS:** nav drawer, header condense, scroll reveals, lightbox, in-viewport video play, sticky call bar. Everything must degrade gracefully without JS.
5. **SEO artifacts** (§9): metas, JSON-LD, sitemap, robots, 404, CNAME, .nojekyll.
6. **Self-review:** serve locally; take Playwright (or manual) screenshots at 390 / 768 / 1280 / 1600 of every page and *look at them* — fix anything that looks template-y, cramped, or unbalanced before calling it done. Run Lighthouse and iterate until ≥95×4. Validate HTML (e.g. `npx html-validate`). Click every link; test keyboard-only; test reduced motion; test JS disabled.
7. **Git & deploy (ask Conor before pushing):** repo with sensible `.gitignore` (§3); push to GitHub; enable Pages (deploy from branch, root); confirm `CNAME` file present. DNS (Conor does at registrar): apex `A` records → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`; `www` CNAME → `<github-username>.github.io`; then enable "Enforce HTTPS" in repo settings. The old WordPress site goes offline at DNS switch — time it with the client.

## 13. Do NOT

- Do not invent menu items, prices, hours, awards, reviews, delivery services, or booking systems.
- Do not use stock photography, placeholder lorem ipsum, emoji in headings, or generic hero slogans ("Welcome to our website").
- Do not add frameworks, jQuery, Bootstrap/Tailwind, Google Fonts runtime requests, iframes, analytics, or cookie consent.
- Do not ship the raw `July `/`july-photos` masters in the repo or deploy.
- Do not carry over the old site's footer credit ("Wall Web Design") — this is a Morey Digital site now.
- Do not publish the Orangery serving times, geo coordinates, or careers email until Conor confirms them.

## 14. Nice-to-haves (only after everything above is done)
- Print stylesheet for the three menu pages (restaurant menus get printed).
- `theme-color` meta (deep green) + tasteful dark-mode via `prefers-color-scheme` (optional; light is primary).
- Subtle apple-motif SVG dividers drawn from the logo.

## 15. Definition of done — verify before reporting back
- [ ] All 9 pages + 404 built, responsive 320→1920px, no horizontal scroll anywhere.
- [ ] Every §8 menu item present, spelled as specified, with correct price + allergens — diff-check against this brief.
- [ ] Lighthouse mobile ≥95 ×4 on `/` and `/menus/lunch-dinner/` (paste scores).
- [ ] Valid HTML; JSON-LD parses; sitemap/robots/canonicals/OG present on every page.
- [ ] Keyboard-only pass + reduced-motion pass + JS-off pass all usable.
- [ ] `tel:` links work; all social links correct (IG `bramleylodge_food`, TikTok `@bramleylodge`, FB `BramleyLodge`).
- [ ] Screenshots of every page at mobile + desktop shown to Conor.
- [ ] List of remaining TODOs for Conor (careers email, evening times/prices, geo coords, Granny Grant structure, flagged [confirm] items, DNS switch timing).

## 16. Open questions for Conor (carry through, don't block on them)
1. ~~Careers email address for the Join Our Team page.~~ Resolved: bookings@bramleylodge.ie (also the general contact email).
2. Breakfast + Orangery evening prices — publish or keep unpriced?
3. Orangery Evening Menu serving days/times.
4. Exact map coordinates / Google Business Profile link.
5. Granny Grant: confirm it's a set (soup + sandwich + cake) at the sandwich price.
6. The two **[confirm]** dish flags in §8 (Yakiton allergens, "Sorrisi basil", "Ton/Tori Negima").
7. GitHub repo name + when to switch DNS.
