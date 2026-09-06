# Task list: C&R Luxurious Travel on Hostinger WordPress

Work through the phases in order. Each item names the section of [01-hostinger-deployment-guide.md](01-hostinger-deployment-guide.md) that has the click-by-click detail. When you reach a step you want help with, tell Claude the task number (for example "walk me through B3") and Claude will guide you through it in this chat.

Legend: `[ ]` to do · `[x]` done · **(you)** must be done by you in hPanel/WordPress · **(Claude)** can be done in this repo by Claude.

## Phase A: prepare (done in this repo)

- [x] A1 (Claude) Research the reference site and Hostinger/WordPress mechanics.
- [x] A2 (Claude) Build Piece 1 (global stylesheet) and Piece 2 (global script + ten page files).
- [x] A3 (Claude) Build the WordPress plugin, blank-canvas template, page installer and inquiry-form handler.
- [x] A4 (Claude) Build script, local previews (`preview/`) and plugin zip (`dist/`).
- [x] A5 (Claude) Write this task list, the deployment guide and the site reference.
- [x] A6 (you) Open `preview/index.html` in a browser and click through every page. Note anything to change before going live.
- [x] A7 (you) Contact details confirmed on 3 September 2026: `concierge@crluxurioustravel.com` and `+1 (914) 481-3073`. Applied to `cr-site.js` and `contact.html`, rebuilt. Guide 5.2.
- [ ] A8 (you) Confirm the "from" rates and the wedding package prices you want shown, or ask Claude to remove prices entirely. See "Content to verify" in [03-site-reference.md](03-site-reference.md).

## Phase B: install — DONE, deployed remotely on 6 September 2026

Claude installed the site over SFTP and the WordPress REST API rather than through the browser. Guide section 8 explains that route; `tools/wp-deploy.sh` and `tools/wp-connect.sh` are the scripts.

- [x] B1 Access established: REST API with an application password, plus SFTP on port 65002 with a verified host key.
- [x] B2 Nothing to back up: the site had no pages and one starter post.
- [x] B3 Plugin uploaded to `wp-content/plugins/cr-luxurious-travel` and activated. All eleven pages created, published, on the C&R Blank Canvas template.
- [x] B4 Home is the front page (page 65).
- [ ] B5 Inquiry destination is **rpasols3@gmail.com** (the admin address, a working inbox). Change it to `concierge@crluxurioustravel.com` once that mailbox exists — see C1.
- [x] B6 Every page verified on the blank-canvas template; no theme header or footer.
- [x] B7 Permalinks already `/%postname%/`.
- [x] B8 LiteSpeed and object caches purged after each change.
- [x] B9 All eleven URLs return HTTP 200 and render correctly; checked in a headless browser at desktop and small-screen widths.

Two problems found and fixed during deployment, both recorded in guide section 7:

- The Hostinger AI theme ships a `front-page` template, which WordPress prefers over a page's own template. The home page was therefore rendering with the theme's header and footer. The plugin now filters `frontpage_template_hierarchy`.
- LiteSpeed Cache was rewriting every script to `type="litespeed/javascript"`, so `cr-site.js` never executed and the navigation, footer and stay cards never appeared. The plugin now marks its own assets `data-no-optimize` / `data-no-defer` / `data-no-delay`.

## Phase C: forms and email

- [ ] C1 (you) Create the `concierge@crluxurioustravel.com` mailbox in hPanel → Emails, then tell Claude to switch the inquiry destination (B5). Guide 5.2.
- [ ] C2 (you) Install and configure WP Mail SMTP with that mailbox's SMTP settings. Until then mail leaves via PHP `mail()` and may be filtered as spam. Guide 5.3.
- [x] C3 Test inquiry submitted to `/contact/`: redirected to `?cr_sent=1`, saved under Inquiries, and `wp_mail()` reported success. **Check your inbox and spam folder** to confirm it actually arrived; that is the part only you can see.

## Phase D: identity, legal and launch settings

- [x] D1 Site Title "C&R Luxurious Travel" and tagline "Private access to the Caribbean's finest" set. **Site Icon is still empty** — ask Claude for a 512×512 monogram and it will upload and set it.
- [x] D2 A privacy notice written for this site's actual data handling is published at `/privacy/` and registered as the WordPress privacy page. **Please read it and correct anything that does not match how you operate.** WordPress's own placeholder draft was left in the trash.
- [ ] D3 (you) Settings → Discussion: disable comments on new posts. Guide 5.1.
- [x] D4 The site serves over HTTPS; every page checked returns 200 over TLS.
- [x] D5 `blog_public` is 1, so search engines are not discouraged.
- [ ] D6 (you) Optional: per-page titles and descriptions. All in One SEO is already installed and is generating titles such as "Dining - C&R Luxurious Travel". Guide 5.5.
- [x] D7 The "Hello world!" starter post is in the trash.
- [ ] D8 (you) Open the site on a real phone. Claude verified programmatically that no page overflows horizontally at small widths, but headless screenshots could not render a true 390px viewport, so a human eye on a real device is still worth having.
- [ ] D9 (you) Decide what to do about `https://crluxurioustravel.com/cr-luxurious-travel.html` — an older standalone copy of the site sitting in the web root, publicly reachable and indexable. Claude can delete it over SFTP on your word.

## Phase E: content polish (Claude, on request)

- [ ] E1 Replace any resort images you would rather not use with your own (upload to Media Library, give Claude the URLs).
- [ ] E2 Adjust copy, prices, offers or packages; Claude edits the repo files and rebuilds.
- [ ] E3 Add a Terms / Booking Conditions page and link it from the footer (currently plain text).
- [ ] E4 Add Instagram/Facebook links to the footer once the accounts exist.
- [ ] E5 Optional: give Claude direct access so it can do Phase B and later edits for you. Guide 8 explains the four routes and what each unlocks. Shortest useful pair: a **WordPress Application Password** (guide 8.1) plus **SFTP credentials** (guide 8.2), which together cover B3, B4, B6, D7 and all of Phase E and F.

## Phase F: routine updates

- [ ] F1 Edit in repo → `tools\build.ps1` → bump plugin version → upload zip → "Reinstall page content" if HTML changed → flush cache. Guide 6.
- [ ] F2 Review Offers page each season; update `pages/offers.html`.
- [ ] F3 Review Inquiries in WordPress weekly and archive handled ones.

## Blocked or unavailable in this session

- The **Hostinger API MCP server** (guide 8.4) needs Node.js, which is not installed on this machine, and must be added from an interactive terminal. It covers hosting infrastructure rather than page content, and the SFTP + REST route made it unnecessary.
- **SMTP delivery** cannot be configured without the mailbox password, which only you should type. Until C2 is done, inquiry email leaves via PHP `mail()`.
- **Headless screenshots at true phone widths** were not possible: this machine's headless browser clamps the viewport to about 489 CSS pixels, so mobile images come out cropped. Overflow was instead verified programmatically (`scrollWidth === clientWidth`, zero offending elements). D8 covers the human check.
- No PHP interpreter is installed on this computer, so the plugin was reviewed by reading, not executed. It uses only standard WordPress APIs (documented in the guide's sources). If activation ever reports an error, paste the message to Claude.
