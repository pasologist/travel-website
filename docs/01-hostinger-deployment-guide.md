# Hostinger WordPress deployment guide

This is the step-by-step procedure for putting the C&R Luxurious Travel site onto a WordPress installation hosted, built and managed at Hostinger. It is written so Claude can walk you through it later in this project, one step at a time. Tick items off in [02-task-list.md](02-task-list.md) as you go.

Everything you upload comes from this repository. Nothing here requires editing PHP by hand.

---

## 0. How the site is put together (read once)

The site follows the same "two pieces" split as the example files you supplied:

| Piece | What it is | Where it lives in the repo | Where it goes in WordPress |
|---|---|---|---|
| **Piece 1** | Global stylesheet. Palette, fonts, every component. | `wordpress/plugin/cr-luxurious-travel/assets/cr-style.css` | Loaded once, site-wide |
| **Piece 2** | Global script (property data, navigation + footer, gallery, forms) **plus** one HTML file per page. | `assets/cr-site.js` and `pages/*.html` in the same folder | Script loaded once, site-wide; each HTML file becomes one WordPress page holding a single **Custom HTML** block |

Every page's HTML starts with `<div class="cr" data-page="…">`. The stylesheet only styles things inside `.cr`, and the script only runs when it finds that wrapper, so the WordPress theme and the C&R design never interfere with each other.

There are **two ways** to install. Route A is recommended; Route B exists so you can do everything by copy-and-paste if a plugin upload is ever not possible.

- **Route A, the plugin (recommended, about 15 minutes).** Upload `dist/cr-luxurious-travel.zip`. The plugin loads Piece 1 and Piece 2, registers a "C&R Blank Canvas" page template (no theme header or footer), creates the ten pages, and handles the inquiry forms.
- **Route B, manual (about 60 minutes).** Paste Piece 1 into WPCode as a CSS snippet, Piece 2 as a JavaScript snippet, and each page's HTML into a Custom HTML block on a page that uses a blank template.

---

## 1. Prerequisites

1. Your Hostinger account (hPanel) login: <https://hpanel.hostinger.com>.
2. A WordPress site already installed on the hosting plan (Hostinger's onboarding does this; the AI builder may already have created a starter site, which is fine).
3. The WordPress admin login. From hPanel: **Websites → (your site) Dashboard → WordPress → Overview → Edit website** opens the dashboard without a password.
4. This repository on your computer, with a fresh build: run `tools\build.ps1` (right-click → Run with PowerShell, or `powershell -ExecutionPolicy Bypass -File tools\build.ps1`). It produces `dist/cr-luxurious-travel.zip` and the `preview/` folder.
5. Optional but recommended: open `preview/index.html` in a browser first and click through every page. What you see locally is what the live site will look like.

Before changing anything on a site that already has content, take a backup: **hPanel → Websites → Dashboard → Files → Backups → Generate new backup** (or use the WordPress → Overview page's backup card).

---

## 2. Route A: install the plugin

### 2.1 Upload and activate

1. WordPress admin → **Plugins → Add New Plugin → Upload Plugin**.
2. **Choose File** → select `dist/cr-luxurious-travel.zip` → **Install Now**.
3. Click **Activate Plugin**.
4. A green notice confirms the pages were created. Click the link to **Settings → C&R Site**, or navigate there yourself.

On activation the plugin creates these pages (it never overwrites a page that already exists with the same slug):

| Page | URL | Content |
|---|---|---|
| Home | `/` (after step 2.2) | Hero, collection, all-inclusive, experiences, how it works, why C&R |
| Stays | `/stays/` | Filterable grid of all 11 properties |
| Stay | `/stay/?stay=crown-villas` | One page that renders any property from the data in Piece 2 |
| All-Inclusive | `/all-inclusive/` | What is included, VIP tier, resorts, FAQ |
| Dining | `/dining/` | 19 venues with filters, reservation notes |
| Spa & Wellness | `/spa/` | Yin Yang Spa menu categories |
| Experiences | `/experiences/` | Resort activities, water and shore excursions (tabs) |
| Weddings & Events | `/weddings/` | Six packages, gallery, inquiry form |
| Offers | `/offers/` | Current promotions |
| Contact | `/contact/` | Inquiry form, contact cards, map, FAQ |

### 2.2 Settings → C&R Site

This screen shows every page, whether it exists, and whether the blank-canvas template is applied. Use the buttons:

1. **Set "Home" as the front page.** This sets *Settings → Reading → Your homepage displays → A static page → Home*. Do this now.
2. **Send inquiries to**: enter the mailbox that should receive form submissions and click **Save email**. Every submission is also stored under the **Inquiries** menu in the admin sidebar, so nothing is lost even if email delivery fails.
3. If any page shows **Template: Not set**, open it (Edit) and choose the template as described in section 4 for your theme type, then Update.

### 2.3 Permalinks

**Settings → Permalinks → Post name → Save Changes.** The site's links assume `/stays/`, `/dining/` and so on. (Hostinger installs usually have this set already.)

### 2.4 Purge caches and look

1. **hPanel → Websites → Dashboard → WordPress → Overview → Flush cache** (Core card). If the LiteSpeed Cache plugin is installed, also **LiteSpeed Cache → Toolbox → Purge All** in WordPress.
2. Open the site in a private/incognito window. Check the home page, then Stays → any property → the gallery lightbox → Contact.
3. Send yourself a test inquiry from `/contact/`. You should land back on the page with a green "Thank you" notice, see the entry under **Inquiries**, and receive the email. If the email does not arrive, see section 5.3.

That is the whole install. Continue with section 5 (finishing touches).

---

## 3. Route B: manual copy-and-paste (fallback)

Use this only if you cannot upload a plugin. It needs the free **WPCode** plugin (Plugins → Add New Plugin → search "WPCode – Insert Headers and Footers" → Install → Activate).

### 3.1 Fonts (header)

Code Snippets → **+ Add Snippet** → **Add Your Custom Code (New Snippet)** → **+ Add Custom Snippet** → code type **HTML Snippet**. Title "C&R Fonts". Paste:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Outfit:wght@300;400;500;600&family=Parisienne&display=swap" rel="stylesheet">
```

Insert Method **Auto Insert**, Location **Site Wide Header**. Toggle **Active**, **Save Snippet**.

### 3.2 Piece 1, the stylesheet

Same path, code type **CSS Snippet**, title "C&R Piece 1 – Styles". Open `wordpress/plugin/cr-luxurious-travel/assets/cr-style.css`, select all, paste. Location **Site Wide Header**. Activate and save.

Alternative without WPCode: **Appearance → Customize → Additional CSS** (classic themes) or **Appearance → Editor → Styles → ⋮ menu → Additional CSS** (block themes). Paste the same file and Publish/Save.

### 3.3 Piece 2, the script

Code type **JavaScript Snippet**, title "C&R Piece 2 – Script". Paste the whole of `assets/cr-site.js`. Location **Site Wide Footer**. Activate and save.

The script does nothing on pages that do not contain a `.cr` wrapper, so loading it site-wide is safe. (If you prefer to restrict it, enable **Smart Conditional Logic → Page URL → contains →** and add one rule per page slug; this is free in WPCode Lite.)

### 3.4 The ten pages

For each file in `wordpress/plugin/cr-luxurious-travel/pages/`:

1. **Pages → Add New Page.** Title as in the table in section 2.1. In the right sidebar under **Summary/URL**, set the slug (`stays`, `stay`, `all-inclusive`, `dining`, `spa`, `experiences`, `weddings`, `offers`, `contact`, and `home` for the home page).
2. Type `/html` in the editor and choose **Custom HTML**. Open the page's `.html` file, select all, paste into the block.
3. Choose the blank template for your theme (section 4).
4. **Publish**.

Finally **Settings → Reading → A static page → Homepage: Home**, and **Settings → Permalinks → Post name**.

### 3.5 Forms in Route B

Without the plugin there is no server-side form handler. The forms fall back to opening the visitor's email app with the request pre-filled (they still work). To get real form delivery without the plugin, install **WPForms Lite**, build a form with the same fields, and add its shortcode block above the form in the Contact and Weddings pages; then delete the HTML `<form>` from those two Custom HTML blocks.

---

## 4. Blank page template by theme type

Hostinger's WordPress onboarding installs its own **Hostinger AI theme** and lets you pick between the block editor (Gutenberg) and Elementor. Find out which you have: **Appearance → Themes** shows the active theme; if **Appearance → Editor** exists it is a block theme, if **Appearance → Customize** exists it is a classic theme.

### 4.1 Block theme (Twenty Twenty-Five, Hostinger AI theme with Gutenberg, etc.)

With the plugin active, the template is registered automatically. On each page: right sidebar → **Page** tab → **Template** → click the template name → **Swap template** → choose **C&R Blank Canvas** → **Update**.

Without the plugin: **Appearance → Editor → Templates → + (Add New Template) → Page** (custom template, name it "Blank Canvas"), delete the Header and Footer template parts so only **Content** remains, save, then choose it on each page as above. If the theme's Content block constrains width, select the Content block → Layout → untick "Inner blocks use content width".

### 4.2 Classic theme (Astra, Hostinger AI theme with Elementor, etc.)

With the plugin active: page sidebar → **Template** dropdown → **C&R Blank Canvas** → Update.

Without the plugin, use what the theme provides:

- **Elementor installed:** Template dropdown → **Elementor Canvas** (blank, no header/footer).
- **Astra:** the **Astra Settings** box below the editor → *Disable Sections*: tick Primary Header, Title, Footer; *Content Layout*: Full Width / Stretched.
- **Any other classic theme:** upload the file `wordpress/plugin/cr-luxurious-travel/templates/cr-blank-canvas.php` into your (child) theme folder via **hPanel → Files → File Manager → public_html/wp-content/themes/<theme>/**, then pick "C&R Blank Canvas" from the Template dropdown.

### 4.3 If the layout looks squeezed

The theme is wrapping the content in a narrow column. Either apply the blank template (above) or, in the editor, wrap the Custom HTML block in a **Group** block and set the Group's alignment to **Full width**.

---

## 5. Finishing touches

### 5.1 Site identity

- **Settings → General**: Site Title "C&R Luxurious Travel", Tagline "Private access to the Caribbean's finest", and **Site Icon** (a 512×512 PNG of the C&R monogram; on older versions the icon is under Appearance → Customize → Site Identity).
- **Settings → Privacy**: select or create the Privacy Policy page. The site footer links to it automatically.
- **Settings → Discussion**: untick "Allow people to submit comments on new posts" (the C&R pages already have comments closed).

### 5.2 Contact details

The email `concierge@crluxurioustravel.com` and the phone `+1 (914) 481-3073` (both confirmed on 3 September 2026) are set in **two places**: the `SITE` object at the top of `assets/cr-site.js` (navigation, footer, mailto fallback) and the contact cards in `pages/contact.html`. Change both, rebuild, re-upload the plugin (section 6). Create the mailbox in **hPanel → Emails** if it does not exist yet.

### 5.3 Reliable form email (SMTP)

Shared hosting often sends form mail straight to spam. Install **WP Mail SMTP** (Plugins → Add New Plugin) and configure it with a mailbox from hPanel → Emails:

- SMTP host `smtp.hostinger.com`, encryption SSL, port 465 (or TLS, port 587), authentication on, the mailbox address and its password. Check **hPanel → Emails → Manage → Configuration settings** for the exact values shown for your account.
- Use the plugin's "Send a test email" tool, then resend a test inquiry from the site.

### 5.4 Caching, CDN and SSL

- **hPanel → Websites → Dashboard → Security → SSL**: confirm the certificate is active and **Force HTTPS** is on.
- After any content change: **WordPress → Overview → Flush cache** in hPanel, and **LiteSpeed Cache → Toolbox → Purge All** if that plugin is present. If Hostinger's CDN is enabled, purge it too (**hPanel → Performance → CDN**).
- Do not enable LiteSpeed's "CSS/JS combine" or "defer JS" for the C&R pages before testing; the script must run after the page HTML exists (it is loaded in the footer for that reason).

### 5.5 Search engines

- **Settings → Reading**: make sure "Discourage search engines from indexing this site" is unticked when you go live.
- Install an SEO plugin if you want per-page titles and descriptions (Rank Math or Yoast; Hostinger's onboarding may already have installed one). Suggested title pattern: "Page name · C&R Luxurious Travel".

### 5.6 Mobile check

Open the site on a phone. The navigation collapses to a menu button at 1080px and the grids go to one column at 620px. The hero uses a fixed background on desktop only.

---

## 6. Updating the site later

All content lives in this repository, so the workflow is always the same:

1. Edit the source. Copy and images: `pages/*.html`. Properties, prices, navigation, contact details: `assets/cr-site.js` (the `SITE` and `PROPERTIES` objects at the top). Colours and layout: `assets/cr-style.css`.
2. Run `tools\build.ps1`. Open the page in `preview/` to check it.
3. Bump the version number in `cr-luxurious-travel.php` (the `Version:` header and `CRLT_VERSION`) so browsers fetch the new CSS/JS.
4. WordPress → **Plugins → Add New Plugin → Upload Plugin** → upload the new zip → WordPress offers **Replace current with uploaded** → confirm.
5. If a page's HTML changed: **Settings → C&R Site → Reinstall page content from plugin files**. This overwrites the ten pages with the bundled HTML (edits made inside the WordPress editor are lost, which is why editing in the repo is the recommended workflow).
6. Flush caches (5.4).

Small text edits can also be made directly in WordPress: open the page, click into the Custom HTML block, edit, Update. Remember to copy the same change back into the repo file so the next reinstall does not undo it.

To let Claude push page updates directly through the WordPress REST API in a future session, create an Application Password (**Users → Profile → Application Passwords → New Application Password**) and keep it somewhere safe; you would provide the site URL, username and that password when asked.

---

## 7. Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Page shows raw text with the theme's header and footer, no styling | Piece 1 not loaded, or the page is not recognised as a C&R page | Route A: check Plugins shows the plugin active and the page slug is one of the ten. Route B: check the CSS snippet is Active and Site Wide Header. Purge caches. |
| Styling present but no navigation/footer, cards empty | Piece 2 not loaded or blocked | Route A: view page source, look for `cr-site.js`. Route B: JavaScript snippet Active, Site Wide Footer. Disable "defer/delay JS" in caching/optimisation plugins for these pages. |
| Theme header/footer appear above and below the C&R page | Blank template not applied | Section 4. |
| Content is a narrow column | Theme content width | Section 4.3. |
| Fonts look wrong (Times / Arial) | Google Fonts blocked or snippet missing | Route B: fonts snippet (3.1). Check nothing blocks fonts.googleapis.com. |
| Images missing | CDN blocked or an image id was mistyped | Open the image URL directly; ids are in `cr-site.js` and the page files. |
| Form returns "could not be sent" | PHP mail failing | Section 5.3 (SMTP). The submission is still saved under Inquiries. |
| Form returns "could not be verified" | Honeypot/time trap tripped (form submitted within 3 s, or autofill filled the hidden field) | Retry slowly; if it persists, disable browser autofill for the site. |
| Changes not visible | Server or browser cache | 5.4, then hard-refresh (Ctrl+Shift+R). |
| "Template: Not set" on the C&R Site screen | Page created before the template existed | Edit the page, choose C&R Blank Canvas, Update. |
| Property page shows the Crown Villas for every link | The `?stay=` parameter is being stripped | Check Settings → Permalinks is "Post name" and no security plugin strips query strings. |

---

## Sources consulted

- Hostinger, *How to add custom CSS to WordPress (4 methods)*: <https://www.hostinger.com/tutorials/wordpress-custom-css>
- Hostinger, *How to create a custom WordPress page template*: <https://www.hostinger.com/tutorials/wordpress-page-template/>
- Hostinger, *How to clear cache at Hostinger* and *Cache Manager*: <https://www.hostinger.com/support/1583501-how-to-clear-cache-in-hostinger/>, <https://www.hostinger.com/support/6215624-how-to-use-cache-manager-at-hostinger/>
- Hostinger, *AI Website Builder for WordPress*: <https://www.hostinger.com/support/how-to-use-hostinger-ai-website-builder-for-wordpress/>
- WPCode, *How to add scripts to specific pages*: <https://wpcode.com/how-to-add-scripts-to-specific-pages-in-wordpress/>
- WordPress.org support, *Best practice: CSS + JS in Custom HTML block*: <https://wordpress.org/support/topic/best-practice-cssjs-in-custom-html-block/>
- WordPress Developer Blog, *Registering block templates via plugins in WordPress 6.7*: <https://developer.wordpress.org/news/2024/08/registering-block-templates-via-plugins-in-wordpress-6-7/>
- WordPress Developer Reference, `theme_page_templates` hook: <https://developer.wordpress.org/reference/hooks/theme_page_templates/>
- WPBeginner, *Best contact form plugins* (WPForms Lite recommendation): <https://www.wpbeginner.com/plugins/5-best-contact-form-plugins-for-wordpress-compared/>
- Reference site (used with the owners' permission): <https://www.lhvcresorts.com/en/>
