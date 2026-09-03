# travel-website · C&R Luxurious Travel

Source for the **C&R Luxurious Travel** website: a luxury-travel site offering private, advisor-led access to the resorts and villas of the Dominican Republic's Amber Coast (Puerto Plata and Cabarete), built to be published as pages on a **WordPress site hosted, built and managed at Hostinger**.

The design merges the warm sand-and-teal palette and the Cormorant Garamond / Outfit / Parisienne typography of the original C&R concept files with the page flow and content of the reference site <https://www.lhvcresorts.com/en/>, which is used with the site owners' permission. The build keeps the concept's "two pieces" split: **Piece 1** is one global stylesheet, **Piece 2** is one global script plus one HTML file per page.

## What is in the repo

| Path | Purpose |
|---|---|
| `wordpress/plugin/cr-luxurious-travel/` | The site itself, packaged as a WordPress plugin: `assets/cr-style.css` (Piece 1), `assets/cr-site.js` (Piece 2), `pages/*.html` (ten pages), a blank-canvas page template, a one-click page installer and the inquiry-form handler |
| `dist/cr-luxurious-travel.zip` | Built plugin, ready for **Plugins → Add New Plugin → Upload Plugin** |
| `preview/` | Built standalone pages; open `preview/index.html` to review the site locally |
| `tools/build.ps1` | Rebuilds `preview/` and `dist/` from the plugin folder |
| `docs/01-hostinger-deployment-guide.md` | Step-by-step install on Hostinger WordPress (plugin route and manual route), theme notes, troubleshooting, sources |
| `docs/02-task-list.md` | Checklist of what is done, what you do in hPanel/WordPress, and what Claude can do next |
| `docs/03-site-reference.md` | Design system, page map, file layout, editing guide, content to verify |

## Pages

Home · Stays · Stay (one page renders all 11 properties) · All-Inclusive · Dining · Spa & Wellness · Experiences · Weddings & Events · Offers · Contact.

## Quick start

1. Open `preview/index.html` in a browser and click through.
2. Upload `dist/cr-luxurious-travel.zip` in WordPress, activate, then **Settings → C&R Site → Set Home as the front page**.
3. Follow `docs/02-task-list.md` from Phase B.

To change anything, edit the files under `wordpress/plugin/cr-luxurious-travel/`, run `tools\build.ps1`, and upload the new zip (details in the deployment guide, section 6).

## Status

Built on 2 September 2026. Not yet installed on the Hostinger site; the contact phone number is a placeholder and prices are the resorts' published starting rates pending confirmation (see `docs/03-site-reference.md`, section 6).
