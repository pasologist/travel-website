=== C&R Luxurious Travel ===
Contributors: crluxurioustravel
Requires at least: 6.7
Tested up to: 6.9
Requires PHP: 7.4
Stable tag: 1.0.0
License: GPL-2.0-or-later

Installs the C&R Luxurious Travel website on a WordPress site hosted at Hostinger.

== What it does ==

* Loads Piece 1 (assets/cr-style.css) and Piece 2 (assets/cr-site.js) plus the Google Fonts on every C&R page.
* Registers the "C&R Blank Canvas" page template (block themes and classic themes) so pages render with no theme header/footer.
* Creates the ten site pages from pages/*.html on activation (never overwrites existing pages unless you ask it to).
* Adds Settings -> C&R Site with one-click actions: create missing pages, reinstall page content, set Home as the front page, choose the inquiry email.
* Handles the inquiry forms (admin-post.php?action=cr_inquiry): honeypot, time trap, rate limit, saves every inquiry under the Inquiries menu and emails it.

== Install ==

1. Plugins -> Add New Plugin -> Upload Plugin -> choose cr-luxurious-travel.zip -> Install Now -> Activate.
2. Settings -> C&R Site -> "Set Home as the front page".
3. Purge the LiteSpeed / Hostinger cache and view the site.

See docs/01-hostinger-deployment-guide.md in the repository for the full procedure.
