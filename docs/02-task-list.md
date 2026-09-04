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

## Phase B: install (about 15 minutes in WordPress)

- [ ] B1 (you) Log in to hPanel; open the WordPress dashboard (Websites → Dashboard → WordPress → Overview → Edit website). Guide 1.
- [ ] B2 (you) Take a backup if the site already has content. Guide 1.
- [ ] B3 (you) Plugins → Add New Plugin → Upload Plugin → `dist/cr-luxurious-travel.zip` → Install → Activate. Guide 2.1.
- [ ] B4 (you) Settings → C&R Site → "Set Home as the front page". Guide 2.2.
- [ ] B5 (you) Settings → C&R Site → enter the inquiry email → Save. Guide 2.2.
- [ ] B6 (you) Check every row on the C&R Site screen shows Published and the C&R Blank Canvas template. Fix any "Not set" row by editing the page and choosing the template. Guide 2.2 and 4.
- [ ] B7 (you) Settings → Permalinks → Post name → Save. Guide 2.3.
- [ ] B8 (you) Flush cache in hPanel (and LiteSpeed Cache → Purge All if present). Guide 2.4.
- [ ] B9 (you) Open the site in a private window; check Home, Stays, one property + gallery, Dining filters, Experiences tabs, Contact. Guide 2.4.

## Phase C: forms and email

- [ ] C1 (you) Create the concierge mailbox in hPanel → Emails (if using a Hostinger mailbox). Guide 5.2.
- [ ] C2 (you) Install and configure WP Mail SMTP with the mailbox's SMTP settings; send the plugin's test email. Guide 5.3.
- [ ] C3 (you) Submit a test inquiry from `/contact/` and from `/weddings/`; confirm the green notice, the entry under Inquiries, and the email. Guide 2.4.

## Phase D: identity, legal and launch settings

- [ ] D1 (you) Settings → General: Site Title, Tagline, Site Icon. Guide 5.1. (Ask Claude for a 512×512 monogram PNG if you want one generated.)
- [ ] D2 (you) Settings → Privacy: select/create the Privacy Policy page and fill it in. Guide 5.1.
- [ ] D3 (you) Settings → Discussion: disable comments on new posts. Guide 5.1.
- [ ] D4 (you) Security → SSL in hPanel: certificate active, Force HTTPS on. Guide 5.4.
- [ ] D5 (you) Settings → Reading: "Discourage search engines" unticked. Guide 5.5.
- [ ] D6 (you) Optional: SEO plugin, per-page titles and descriptions. Guide 5.5.
- [ ] D7 (you) Delete or unpublish any starter pages/posts left by Hostinger's onboarding (Pages → All Pages; Posts → All Posts → "Hello world!").
- [ ] D8 (you) Phone check of every page. Guide 5.6.

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

- The claude.ai **WordPress.com** connector is not authorised in this environment and is designed for WordPress.com-hosted sites, so Claude could not create the pages on your Hostinger site directly. The plugin route replaces that step with one upload. For direct access from chat, use the WordPress REST API instead of that connector: see task E5 and guide section 8.
- The **Hostinger API MCP server** (guide 8.4) needs Node.js, which is not installed on this machine, and must be added from an interactive terminal. It covers hosting infrastructure rather than page content, so it is a convenience rather than a requirement.
- No PHP interpreter is installed on this computer, so the plugin was reviewed by reading, not executed. It uses only standard WordPress APIs (documented in the guide's sources). If activation ever reports an error, paste the message to Claude.
