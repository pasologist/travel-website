/* ==========================================================================
   C&R LUXURIOUS TRAVEL · PIECE 2 · GLOBAL SCRIPT  (v1.0.0)
   --------------------------------------------------------------------------
   One file, loaded on every C&R page. The C&R plugin enqueues it in the
   footer and injects window.CR_CONFIG. Manual route: paste the whole file
   into WPCode → "JavaScript Snippet" (Auto Insert · Site Wide Footer).

   Each page's HTML (pages/*.html) is a plain <div class="cr" data-page="…">.
   This script injects the shared navigation and footer, renders data-driven
   parts (stay cards, the property page), and wires shared behaviour
   (filters, tabs, lightbox, reveal animations, inquiry forms).

   Sections: 1 config · 2 site settings · 3 property data · 4 helpers ·
             5 nav & footer · 6 renderers · 7 shared behaviour · 8 boot
   ========================================================================== */
(function () {
  'use strict';
  if (window.__CR_BOOTED) { return; }
  window.__CR_BOOTED = true;

  /* ---------- 1. Config (injected by the plugin or the preview builder) ---------- */
  var CFG = { base: '/', ext: '', home: '', urls: {}, formAction: '', formMode: 'mailto', preview: false };
  if (window.CR_CONFIG) { for (var key in window.CR_CONFIG) { if (Object.prototype.hasOwnProperty.call(window.CR_CONFIG, key)) { CFG[key] = window.CR_CONFIG[key]; } } }
  CFG.urls = CFG.urls || {};

  /* ---------- 2. Site settings — edit freely ---------- */
  var SITE = {
    name: 'C & R',
    sub: 'Luxurious Travel',
    legal: 'C&R Luxurious Travel',
    email: 'concierge@crluxurioustravel.com',
    phone: '+1 (914) 481-3073',
    phoneHref: '+19144813073',
    hours: 'Advisors available daily, 8am to 8pm ET',
    tagline: 'Private access to the Caribbean’s finest resorts and villas, and 300,000+ destinations worldwide.',
    nav: [
      { label: 'Stays', page: 'stays' },
      { label: 'All-Inclusive', page: 'all-inclusive' },
      { label: 'Dining', page: 'dining' },
      { label: 'Spa', page: 'spa' },
      { label: 'Experiences', page: 'experiences' },
      { label: 'Weddings', page: 'weddings' },
      { label: 'Offers', page: 'offers' }
    ],
    cta: { label: 'Plan Your Escape', page: 'contact' }
  };

  /* ---------- 3. Property data — edit everything here ---------- */
  /* Images are served from the resorts' CDN (used with the site owners' permission).
     Any image id accepts a size suffix: =s800 (cards) · =s1400 (galleries) · =s1900 (heroes). */
  var CDN = 'https://cdn2.paraty.es/lhvc-corpo/images/';
  function img(id, size) { return CDN + id + '=s' + (size || 1400); }

  var PROPERTIES = [
    {
      id: 'crown-villas', cat: 'villa', area: 'puerto-plata', tier: 'Crown Tier',
      loc: 'Cofresí Beach · Puerto Plata', name: 'The Crown Villas', tagline: 'The jewel of the collection',
      price: 'from $1,920 / night', glance: ['3–7 bedrooms', 'Up to 14 guests', 'Private pool', 'Maid, butler & chef'],
      short: 'Ninety five-star private estates of three to seven bedrooms, each with its own pool, maid, butler and in-house chef.',
      desc: [
        'The Crown Villas are the ultimate expression of luxury and exclusivity on Cofresí Beach. Each is a private estate home with sumptuous three-to-seven bedroom layouts, every bedroom appointed with a king bed and a full private bath.',
        'All villas feature a private swimming pool, shaded terrace, veranda and full kitchen, with classic Mediterranean architecture set against lush tropical gardens. Your dedicated maid, butler and in-house chef ensure every moment is effortless, whether you are hosting a family reunion or a milestone celebration.'
      ],
      feats: ['3 to 7 bedroom private estates', 'Private swimming pool per villa', 'Personal maid, butler & in-house chef', 'King beds with en-suite baths', 'Classic Mediterranean design', 'Ideal for large family reunions'],
      gallery: ['c487a243f7c1de5', '0e2a19af098b28f', '950f6626a6dbfff', '0d16b01b92db561', 'd752ef0149c57d9']
    },
    {
      id: 'cliff-villas', cat: 'villa', area: 'puerto-plata', tier: 'Villa',
      loc: 'Cofresí Peninsula · Puerto Plata', name: 'The Cliff Villas', tagline: 'Where the infinity pool meets the horizon',
      price: 'from $1,920 / night', glance: ['6–7 bedrooms', 'Up to 8 guests', '500 m²', 'Infinity pool'],
      short: 'Minimalist beachside villas on a dramatic peninsula, designed around the art of outdoor living.',
      desc: [
        'The Cliff offers the pinnacle of modern luxury, set within a dramatic and awe-inspiring setting on a peninsula along the coast of Cofresí Beach. Modern design meets the tropics in these gorgeous beachside villas, built around the art of outdoor living.',
        'Six to seven opulent bedrooms open from a grand foyer beneath a two-story vaulted ceiling. Lounge in your infinity pool as it seamlessly meets the horizon of the Caribbean Sea; the minimalist design never blocks the view. Every bedroom includes a spacious walk-in closet and a bathroom with modern fixtures, while a butler, maid and in-house chef make the experience unforgettable.'
      ],
      feats: ['Private infinity pools', 'Unobstructed Caribbean sea views', 'Butler, maid & in-house chef', 'Walk-in closets in every bedroom', 'Grand foyer & two-story vaulted ceiling', 'Outdoor BBQ & terrace living'],
      gallery: ['9ccc3031f5d68fa', '706a26db2e91bbf', '2aa6edebbf3f56f', 'f04b64925aa14c3', 'f1950f6cfa790bb', 'b08a9dc5903080c', '24aa0f00783c5d9', 'e5db9980d40168c']
    },
    {
      id: 'royal-villas', cat: 'villa', area: 'puerto-plata', tier: 'Villa',
      loc: 'Cofresí Beach · Puerto Plata', name: 'Royal Villas', tagline: 'Classical Mediterranean, modern flair',
      price: 'from $1,600 / night', glance: ['3–6 bedrooms', 'Private pool', 'Maid, butler & chef', 'VIP resort access'],
      short: 'Spanish-Mediterranean villas with exotic archways, authentic brick and thriving tropical gardens.',
      desc: [
        'The Royal Villas offer the ultimate in elegant, exclusive villa living, blending classical Spanish-Mediterranean style with chic modern flair. Elegant exteriors feature exotic archways, authentic brick and classic stucco, complemented by distinctive stone and thriving tropical gardens.',
        'Guests enjoy access to all resort facilities plus VIP services, including a personal maid, butler and in-house chef, so days flow between your private pool, the VIP beaches and the resorts’ restaurants without a single detail to arrange.'
      ],
      feats: ['Spanish-Mediterranean architecture', 'Exotic archways & authentic brick', 'Private pool & tropical gardens', 'Personal maid, butler & chef', 'Full VIP resort access', 'Private BBQ & mountain views'],
      gallery: ['d73931604c2057d', '0bf56b8f2cac01f', 'de59e44c7c3165e', '0ad0818802f9ba4', '7345e61ed6d72f5']
    },
    {
      id: 'villa-park', cat: 'villa', area: 'puerto-plata', tier: 'Villa',
      loc: 'Cofresí Beach · Puerto Plata', name: 'Villa Park', tagline: 'Lavish living amid mountains & sky',
      price: 'from $153 / night', glance: ['3–6 bedrooms', 'Private pool', 'Maid, butler & chef', 'Mountain views'],
      short: 'Three-to-six bedroom villas set amid dramatic mountains and exotic tropical flora.',
      desc: [
        'Villa Park offers the ultimate in lavish lifestyle, set within the beauty of the resort in Puerto Plata and surrounded by dramatic mountains, sweeping skies and the exotic lush flora of the area.',
        'Each three-to-six bedroom villa is beautifully appointed and fully equipped for easy living, featuring tile floors throughout, comfortable seating in separate living areas, a dining area, spacious bedrooms and lavish baths. Your own maid, butler and in-house chef make every stay exceptional.'
      ],
      feats: ['3 to 6 bedroom villas', 'Personal maid, butler & in-house chef', 'Separate living & dining areas', 'Mountain & garden surroundings', 'Fully equipped for easy living', 'Beautiful tilework throughout'],
      gallery: ['ed5aa264f6e29e3', '101ac584e0a4167', '783eaa57249964f', '24adb4d352be1f1', '3d0616c6f567a0c']
    },
    {
      id: 'lifestyle-tropical', cat: 'hotel', area: 'puerto-plata', tier: 'All-Inclusive',
      loc: 'Playa Cofresí · Puerto Plata', name: 'Lifestyle Tropical Beach Resort & Spa', tagline: 'A true tropical experience',
      price: 'from $89 / night', glance: ['Oceanfront', 'All-inclusive', '1.5 miles of beach', 'Families & couples'],
      short: 'One and a half miles of golden sand on the Amber Coast, with gourmet dining and oceanfront entertainment.',
      desc: [
        'Set along 1.5 miles of golden sand in Playa Cofresí on the Amber Coast, the Tropical is the essence of a true Caribbean beach experience. This oceanfront five-star, all-inclusive resort offers rooms, suites and villas in a variety of sizes, perfect for families, couples and groups.',
        'Enjoy the Casablanca and Pearl buffets, the Indochine and Blue Lagoon à la carte restaurants, nightly entertainment, resort pools and upscale service throughout your stay.'
      ],
      feats: ['Oceanfront 5-star, all-inclusive', '1.5 miles of golden beach', 'Two buffets & two à la carte restaurants', 'Resort pools & beach clubs', 'Daily live entertainment', 'Rooms, suites & villas'],
      gallery: ['58215e76a00c07a', '72848c8b34f66fa', '8f41d661af4a859', 'dffdcc54778f7e9', 'c188b10002e7bfd']
    },
    {
      id: 'cofresi-palm', cat: 'hotel', area: 'puerto-plata', tier: 'All-Inclusive',
      loc: 'Playa Cofresí · Puerto Plata', name: 'Cofresi Palm Beach & Spa Resort', tagline: 'Opulent, relaxed, unmistakably Caribbean',
      price: 'from $147 / night', glance: ['All-inclusive', 'Full-service spa', 'Beachfront', 'Five restaurants'],
      short: 'An opulent yet relaxed retreat with a full-service spa and the easy elegance the coast is known for.',
      desc: [
        'Cofresi Palm provides the easy, relaxed ambience of the Caribbean in an opulent and elegant setting. It delivers the service and features that define the collection, with a full-service spa, beachfront access and a range of accommodations for couples and families alike.',
        'Dining here is a highlight: Moomtaz Thai, El Pilón Dominican, Rodizio Brazilian churrascaría and the Tapas Lounge are all steps from your room.'
      ],
      feats: ['Full-service spa & wellness', 'Beachfront access', 'Five restaurants on site', 'Family-friendly accommodations', 'Resort pools', 'VIP services available'],
      gallery: ['157c079e1d0690f', 'c7f98f0be6e0344', 'a32259edc608309', '881edcc56ff055f', '5b1bb2a4f712086']
    },
    {
      id: 'crown-residence-suites', cat: 'hotel', area: 'puerto-plata', tier: 'All-Inclusive',
      loc: 'Cofresí · Puerto Plata', name: 'Lifestyle Crown & Residence Suites', tagline: 'The comforts of home, five-star service',
      price: 'from $118 / night', glance: ['All-inclusive', 'Full kitchens', 'Longer stays', 'Bellini Italian on site'],
      short: 'Residence-style suites blending the comforts of home with five-star resort service.',
      desc: [
        'The Crown & Residence Suites offer sophisticated, residence-style living that blends the comforts of home with five-star resort service. Fully equipped kitchens, chic contemporary design and resort pools make these suites ideal for longer stays and families who want space without sacrificing service.',
        'Bellini, the resort’s Italian restaurant, serves breakfast, lunch and dinner right at the Residence Suites.'
      ],
      feats: ['Fully equipped kitchens', 'Chic contemporary design', 'Resort pools', 'Ideal for longer stays', 'Five-star resort service', 'All-inclusive plan'],
      gallery: ['fe7975493429820', 'f61a20a716396a8', '1bbe44d423db17e', 'c40a76ae6f2a32d', '2cf4b2c7c17470e']
    },
    {
      id: 'presidential-suites', cat: 'hotel', area: 'puerto-plata', tier: 'Suites',
      loc: 'Cofresí · Puerto Plata', name: 'Presidential Suites', tagline: 'Service beyond compare',
      price: 'from $100 / night', glance: ['Studios to 2 bedrooms', 'Central location', 'Concierge', 'Jazz bistro on site'],
      short: 'Studios and suites dramatically appointed with rich wood and stainless-steel finishes.',
      desc: [
        'The Presidential Suites offer a unique luxury accommodations experience with service and features beyond compare, in the easy, relaxed ambience of the Caribbean.',
        'Studios and suites are dramatically decorated with dark, rich wood and stainless-steel accents, every detail crafted for comfort, from studios up to two-bedroom presidential suites. The Jazz French Bistro and the Blues restaurant are right at the property.'
      ],
      feats: ['Dark rich-wood interiors', 'Studios to 2-bedroom presidential suites', 'Stainless-steel finishes', 'Premium central location', 'Concierge service', 'All-inclusive plan available'],
      gallery: ['cb07fb5f7ee5332', 'd64672772000e20', '542662dcbc0ff7e', '80c4bba028d029c', '43a48f0390273c1']
    },
    {
      id: 'royal-suites', cat: 'hotel', area: 'puerto-plata', tier: 'Suites',
      loc: 'Cofresí · Puerto Plata', name: 'The Royal Suites', tagline: 'Elevated suite living, refined',
      price: 'from $300 / night', glance: ['Ocean & mountain views', 'VIP facilities', 'Spacious layouts', 'Concierge'],
      short: 'Refined Caribbean style with full access to the resort’s VIP facilities.',
      desc: [
        'The Royal Suites deliver elevated suite living with refined Caribbean style. Spacious layouts showcase ocean and mountain views, and guests enjoy full access to the resort’s VIP facilities and services.',
        'With Trapiche Paradise on site and the VIP beaches minutes away, it is a sophisticated home base for exploring everything the Amber Coast has to offer.'
      ],
      feats: ['VIP resort access', 'Spacious refined layouts', 'Ocean & mountain views', 'Contemporary Caribbean style', 'Trapiche Paradise restaurant', 'Concierge support'],
      gallery: ['4bfb2f3cb062a4e', '0cac0f1194f0bbe', '89381896721dfeb', 'dc4c626eb499a0e', 'bf2765c8b506e5f']
    },
    {
      id: 'sunrise-suites', cat: 'hotel', area: 'puerto-plata', tier: 'Suites',
      loc: 'Cofresí · Puerto Plata', name: 'Sunrise Suites', tagline: 'Sea, sun, sand & sunrise views',
      price: 'from $300 / night', glance: ['1–4 bedrooms', 'Private balconies', 'Full kitchens', 'Penthouse available'],
      short: 'A four-story luxury building with mountain and ocean views over the entire complex.',
      desc: [
        'Sunrise Suites is ideally located in a four-story luxury building with stunning mountain and ocean views overlooking the entire complex in Puerto Plata. Sea, sun, sand and fun surround you here.',
        'Choose from one-bedroom suites, two-bedroom suites and a four-bedroom luxury penthouse. Each features a king bed, private balcony, full kitchen, minibar, safe and coffee machine; select suites add a private plunge pool.'
      ],
      feats: ['1 & 2 bedroom suites', '4-bedroom luxury penthouse', 'Private balconies with ocean views', 'Full kitchens & minibars', 'Private plunge pools in select suites', 'Modern minimalist pool deck'],
      gallery: ['447444bf7ed14a2', '27789c3c0ee4913', '97e5dcfd29a74a4', 'e912ea6cf37e697', '019969c253013d2', '4770522201793fb', '240a6c87585c624', '9d67c2834c1a59c']
    },
    {
      id: 'cabarete', cat: 'hotel', area: 'cabarete', tier: 'Suites',
      loc: 'Cabarete · North Coast', name: 'Presidential Suites Cabarete', tagline: 'A windsurfer’s turquoise paradise',
      price: 'from $79 / night', glance: ['Apartment-style suites', 'Beachfront', 'Kite & windsurfing', 'Brick Oven dining'],
      short: 'Breathtaking apartment-style units in a paradise of turquoise water and golden beach.',
      desc: [
        'Cabarete is the ideal spot for a true vacation adventure. With turquoise waters, an ever-present breeze, golden beaches and a tropical climate, it is a paradise for windsurfers and kite surfers from around the world, and scuba diving is popular too.',
        'The Presidential Suites in Cabarete are breathtaking, with spacious apartment-style units, the rooftop Mila’s Sky Lounge and the artisan Brick Oven restaurant on site.'
      ],
      feats: ['Turquoise-water beachfront', 'Kite & windsurfing capital', 'Spacious apartment-style units', 'Brick Oven artisan dining', 'Rooftop sky lounge', 'North Coast adventure base'],
      gallery: ['0cdb444daab1c7c', '4328fee2bb5291f', 'f7f97eae0e80095', 'a1621f38cfa242c', 'ac285383519ebd0']
    }
  ];
  var CAT_LABEL = { hotel: 'Resort & Suites', villa: 'Private Villa' };

  /* ---------- 4. Helpers ---------- */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function url(page, params, hash) {
    var u;
    if (!page || page === 'home') { u = CFG.home || CFG.urls.home || CFG.base || '/'; }
    else if (CFG.urls[page]) { u = CFG.urls[page]; }
    else { u = (CFG.base || '/') + page + (CFG.ext ? CFG.ext : '/'); }
    if (params) {
      var q = [];
      for (var k in params) { if (params[k] != null && params[k] !== '') { q.push(encodeURIComponent(k) + '=' + encodeURIComponent(params[k])); } }
      if (q.length) { u += (u.indexOf('?') > -1 ? '&' : '?') + q.join('&'); }
    }
    if (hash) { u += '#' + hash; }
    return u;
  }
  function param(name) {
    var m = new RegExp('[?&]' + name + '=([^&#]*)').exec(window.location.search);
    return m ? decodeURIComponent(m[1].replace(/\+/g, ' ')) : null;
  }
  function priceHtml(price) {
    if (!price) { return ''; }
    var m = /^(from\s+)?(\$[\d,]+)\s*\/\s*(night|week|stay)$/i.exec(String(price).trim());
    if (m) { return esc((m[1] || '') + m[2]) + '<small> / ' + m[3].toLowerCase() + '</small>'; }
    return esc(price);
  }
  function findProp(id) { for (var i = 0; i < PROPERTIES.length; i++) { if (PROPERTIES[i].id === id) { return PROPERTIES[i]; } } return null; }
  function cardImg(p) { return img(p.gallery[0], 800); }
  function heroImg(p) { return img(p.gallery[0], 1900); }

  /* ---------- 5. Nav & footer ---------- */
  function logoHtml(extra) {
    return '<a class="logo' + (extra ? ' ' + extra : '') + '" href="' + esc(url('home')) + '" aria-label="' + esc(SITE.legal) + ' home">' +
      '<span class="logo-mark" aria-hidden="true"><span class="lm-text">C<em class="lm-amp">&amp;</em>R</span></span>' +
      '<span class="logo-words"><span class="lw-name">' + esc(SITE.name) + '</span><span class="lw-sub">' + esc(SITE.sub) + '</span></span></a>';
  }
  function navHtml(current) {
    var links = '';
    for (var i = 0; i < SITE.nav.length; i++) {
      var n = SITE.nav[i];
      var cur = n.page === current ? ' aria-current="page"' : '';
      links += '<li><a href="' + esc(url(n.page)) + '"' + cur + '>' + esc(n.label) + '</a></li>';
    }
    links += '<li><a href="' + esc(url(SITE.cta.page)) + '" class="nav-cta">' + esc(SITE.cta.label) + '</a></li>';
    return '<nav class="nav" id="crNav" aria-label="Primary">' + logoHtml('') +
      '<ul class="nav-links" id="crNavLinks">' + links + '</ul>' +
      '<button class="menu-btn" id="crMenuBtn" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="crNavLinks"><span></span><span></span><span></span></button>' +
      '</nav><div class="nav-backdrop" id="crNavBackdrop"></div>';
  }
  function footerHtml() {
    var year = new Date().getFullYear();
    var privacy = CFG.urls.privacy || ((CFG.base || '/') + 'privacy-policy/');
    return '<footer class="footer" id="crFooter">' +
      '<div class="foot-top">' +
        '<div class="foot-brand">' + logoHtml('foot-logo') + '<p>' + esc(SITE.tagline) + '</p></div>' +
        '<div class="foot-col"><h4>Stays</h4>' +
          '<a href="' + esc(url('stays', { filter: 'hotel' })) + '">Resorts &amp; Suites</a>' +
          '<a href="' + esc(url('stays', { filter: 'villa' })) + '">Private Villas</a>' +
          '<a href="' + esc(url('stay', { stay: 'crown-villas' })) + '">The Crown Villas</a>' +
          '<a href="' + esc(url('stay', { stay: 'cabarete' })) + '">Cabarete</a>' +
          '<a href="' + esc(url('all-inclusive')) + '">All-Inclusive</a></div>' +
        '<div class="foot-col"><h4>Discover</h4>' +
          '<a href="' + esc(url('dining')) + '">Dining</a>' +
          '<a href="' + esc(url('spa')) + '">Spa &amp; Wellness</a>' +
          '<a href="' + esc(url('experiences')) + '">Experiences</a>' +
          '<a href="' + esc(url('weddings')) + '">Weddings &amp; Events</a>' +
          '<a href="' + esc(url('offers')) + '">Offers</a></div>' +
        '<div class="foot-col"><h4>Contact</h4>' +
          '<a href="mailto:' + esc(SITE.email) + '">' + esc(SITE.email) + '</a>' +
          '<a href="tel:' + esc(SITE.phoneHref) + '">' + esc(SITE.phone) + '</a>' +
          '<a href="' + esc(url('contact')) + '">Plan Your Escape</a></div>' +
      '</div>' +
      '<div class="foot-bottom"><span>&copy; ' + year + ' ' + esc(SITE.legal) + '. All rights reserved.</span>' +
      '<span><a href="' + esc(privacy) + '">Privacy</a> &nbsp;·&nbsp; Terms &nbsp;·&nbsp; Booking Conditions</span></div>' +
      '</footer>';
  }

  /* ---------- 6. Renderers ---------- */
  function cardHtml(p, i) {
    return '<a class="card reveal" href="' + esc(url('stay', { stay: p.id })) + '" data-cat="' + esc(p.cat + ' ' + p.area) + '" style="transition-delay:' + ((i % 3) * 0.08) + 's">' +
      '<div class="card-img"><span class="card-cat">' + esc(CAT_LABEL[p.cat] || '') + '</span>' + (p.tier ? '<span class="card-tier">' + esc(p.tier) + '</span>' : '') +
      '<img src="' + esc(cardImg(p)) + '" alt="' + esc(p.name) + '" loading="lazy"></div>' +
      '<div class="card-body"><div class="loc">' + esc(p.loc) + '</div><div class="ctag">' + esc(p.tagline) + '</div><h3>' + esc(p.name) + '</h3><p>' + esc(p.short) + '</p>' +
      '<div class="card-foot"><span class="price">' + priceHtml(p.price) + '</span><span class="more">View Stay →</span></div></div></a>';
  }
  function renderCards(container, list) {
    if (!container) { return; }
    var html = '';
    for (var i = 0; i < list.length; i++) { html += cardHtml(list[i], i); }
    container.innerHTML = html || '<div class="empty">No stays match this filter yet.</div>';
  }
  function miniHtml(p) {
    return '<a class="mini" href="' + esc(url('stay', { stay: p.id })) + '"><img src="' + esc(cardImg(p)) + '" alt="' + esc(p.name) + '" loading="lazy">' +
      '<div class="mini-b"><div class="loc">' + esc(p.loc) + '</div><h4>' + esc(p.name) + '</h4></div></a>';
  }

  function renderHome(root) {
    var grid = $('#crFeatured', root);
    if (!grid) { return; }
    var ids = (grid.getAttribute('data-featured') || '').split(',');
    var list = [];
    for (var i = 0; i < ids.length; i++) { var p = findProp(ids[i].trim()); if (p) { list.push(p); } }
    if (!list.length) { list = PROPERTIES.slice(0, 6); }
    renderCards(grid, list);
  }

  function renderStays(root) {
    var grid = $('#crGrid', root);
    if (!grid) { return; }
    renderCards(grid, PROPERTIES);
    var initial = param('filter') || (window.location.hash ? window.location.hash.replace('#', '') : '') || 'all';
    var btn = $('.filter-btn[data-filter="' + initial + '"]', root);
    if (btn) { $$('.filter-btn', root).forEach(function (b) { b.classList.remove('active'); }); btn.classList.add('active'); }
    applyFilter(grid, btn ? initial : 'all');
  }

  function renderProperty(root) {
    var id = param('stay') || (window.location.hash ? window.location.hash.replace('#', '') : '');
    var p = findProp(id) || PROPERTIES[0];
    var el;
    document.title = p.name + ' · ' + SITE.legal;
    if ((el = $('#crHeroImg', root))) { el.src = heroImg(p); el.alt = p.name; }
    if ((el = $('#crBcName', root))) { el.textContent = p.name; }
    if ((el = $('#crTier', root))) { el.textContent = p.tier || CAT_LABEL[p.cat]; }
    if ((el = $('#crName', root))) { el.textContent = p.name; }
    if ((el = $('#crTagline', root))) { el.textContent = p.tagline; }
    if ((el = $('#crLoc', root))) { el.textContent = p.loc; }
    if ((el = $('#crAboutTitle', root))) { el.innerHTML = 'Discover <span class="script">' + esc(p.name) + '</span>'; }
    if ((el = $('#crDesc', root))) {
      var paras = Array.isArray(p.desc) ? p.desc : [p.desc];
      el.innerHTML = paras.map(function (t) { return '<p>' + esc(t) + '</p>'; }).join('');
    }
    if ((el = $('#crGlance', root))) { el.innerHTML = (p.glance || []).map(function (g) { return '<span>' + esc(g) + '</span>'; }).join(''); }
    if ((el = $('#crFeats', root))) { el.innerHTML = p.feats.map(function (f) { return '<li>' + esc(f) + '</li>'; }).join(''); }
    if ((el = $('#crSidePrice', root))) { el.innerHTML = priceHtml(p.price); }
    if ((el = $('#crInquire', root))) { el.href = url('contact', { stay: p.id }, 'inquiry'); }
    if ((el = $('#crGallery', root))) {
      el.innerHTML = p.gallery.map(function (gid, i) {
        return '<div class="g-item" data-index="' + i + '"><img src="' + esc(img(gid, 1400)) + '" alt="' + esc(p.name + ' ' + (i + 1)) + '" loading="' + (i ? 'lazy' : 'eager') + '"></div>';
      }).join('');
      var items = p.gallery.map(function (gid, i) { return { src: img(gid, 1900), cap: p.name + ' · ' + (i + 1) + ' of ' + p.gallery.length }; });
      $$('.g-item', el).forEach(function (d) { d.addEventListener('click', function () { openLb(items, parseInt(d.getAttribute('data-index'), 10) || 0); }); });
    }
    if ((el = $('#crMore', root))) {
      var same = PROPERTIES.filter(function (x) { return x.id !== p.id && x.cat === p.cat; });
      var other = PROPERTIES.filter(function (x) { return x.id !== p.id && x.cat !== p.cat; });
      el.innerHTML = same.concat(other).slice(0, 3).map(miniHtml).join('');
    }
  }

  /* ---------- 7. Shared behaviour ---------- */
  function applyFilter(container, filter) {
    var any = false;
    $$('[data-cat]', container).forEach(function (item) {
      var cats = (item.getAttribute('data-cat') || '').split(/\s+/);
      var show = filter === 'all' || cats.indexOf(filter) > -1;
      item.classList.toggle('hidden', !show);
      if (show) { any = true; }
    });
    var empty = $('.empty', container);
    if (!empty && !any) { var d = document.createElement('div'); d.className = 'empty'; d.textContent = 'Nothing matches this filter yet.'; container.appendChild(d); }
    else if (empty) { empty.style.display = any ? 'none' : ''; }
    observeReveals();
  }
  function initFilters(root) {
    $$('[data-filter-group]', root).forEach(function (group) {
      var targetSel = group.getAttribute('data-filter-target');
      var target = targetSel ? $(targetSel, root) : group;
      var buttons = $$('.filter-btn', group);
      buttons.forEach(function (b) {
        b.addEventListener('click', function () {
          buttons.forEach(function (x) { x.classList.remove('active'); });
          b.classList.add('active');
          applyFilter(target, b.getAttribute('data-filter') || 'all');
        });
      });
    });
  }
  function initTabs(root) {
    $$('[data-tabs]', root).forEach(function (box) {
      var buttons = $$('.tab-btn', box);
      var panels = $$('.tab-panel', box);
      function show(name) {
        buttons.forEach(function (b) { b.classList.toggle('active', b.getAttribute('data-tab') === name); });
        panels.forEach(function (p) { p.classList.toggle('active', p.getAttribute('data-panel') === name); });
        observeReveals();
      }
      buttons.forEach(function (b) { b.addEventListener('click', function () { show(b.getAttribute('data-tab')); }); });
      var want = param('tab') || (window.location.hash ? window.location.hash.replace('#', '') : '');
      var ok = buttons.some(function (b) { return b.getAttribute('data-tab') === want; });
      show(ok ? want : (buttons[0] ? buttons[0].getAttribute('data-tab') : ''));
    });
  }

  /* Lightbox (shared by galleries and any [data-lightbox] group) */
  var lbEl, lbItems = [], lbIndex = 0;
  function ensureLb(root) {
    if (lbEl) { return lbEl; }
    lbEl = document.createElement('div');
    lbEl.className = 'lb'; lbEl.id = 'crLb'; lbEl.setAttribute('role', 'dialog'); lbEl.setAttribute('aria-label', 'Image viewer');
    lbEl.innerHTML = '<button class="lb-close" type="button" aria-label="Close">×</button>' +
      '<button class="lb-nav lb-prev" type="button" aria-label="Previous">‹</button>' +
      '<img id="crLbImg" src="" alt="">' +
      '<button class="lb-nav lb-next" type="button" aria-label="Next">›</button>' +
      '<div class="lb-count" id="crLbCount"></div><div class="lb-cap" id="crLbCap"></div>';
    root.appendChild(lbEl);
    $('.lb-close', lbEl).addEventListener('click', closeLb);
    $('.lb-prev', lbEl).addEventListener('click', function () { navLb(-1); });
    $('.lb-next', lbEl).addEventListener('click', function () { navLb(1); });
    lbEl.addEventListener('click', function (e) { if (e.target === lbEl) { closeLb(); } });
    document.addEventListener('keydown', function (e) {
      if (!lbEl.classList.contains('open')) { return; }
      if (e.key === 'Escape') { closeLb(); }
      if (e.key === 'ArrowRight') { navLb(1); }
      if (e.key === 'ArrowLeft') { navLb(-1); }
    });
    return lbEl;
  }
  function openLb(items, i) {
    lbItems = items; lbIndex = i;
    var it = items[i];
    $('#crLbImg').src = it.src;
    $('#crLbImg').alt = it.cap || '';
    $('#crLbCount').textContent = (i + 1) + ' / ' + items.length;
    $('#crLbCap').textContent = it.cap || '';
    lbEl.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLb() { lbEl.classList.remove('open'); document.body.style.overflow = ''; }
  function navLb(d) { if (!lbItems.length) { return; } lbIndex = (lbIndex + d + lbItems.length) % lbItems.length; openLb(lbItems, lbIndex); }
  function initLightboxGroups(root) {
    $$('[data-lightbox]', root).forEach(function (group) {
      var imgs = $$('img', group);
      var items = imgs.map(function (im) { return { src: im.getAttribute('data-full') || im.src, cap: im.alt }; });
      imgs.forEach(function (im, i) {
        im.style.cursor = 'zoom-in';
        im.addEventListener('click', function (e) { e.preventDefault(); openLb(items, i); });
      });
    });
  }

  /* Reveal-on-scroll */
  var io;
  function observeReveals() {
    var els = $$('.reveal:not(.in)');
    if (!('IntersectionObserver' in window)) { els.forEach(function (el) { el.classList.add('in'); }); return; }
    if (!io) {
      io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
      }, { threshold: 0.12 });
    }
    els.forEach(function (el) { io.observe(el); });
  }

  /* Navigation behaviour */
  function initNav(root) {
    var nav = $('#crNav', root), links = $('#crNavLinks', root), btn = $('#crMenuBtn', root), backdrop = $('#crNavBackdrop', root);
    if (!nav) { return; }
    var first = null;
    for (var i = 0; i < root.children.length; i++) {
      var c = root.children[i];
      if (!c.classList.contains('nav') && !c.classList.contains('nav-backdrop')) { first = c; break; }
    }
    if (!first || !(first.classList.contains('hero') || first.classList.contains('page-hero') || first.classList.contains('p-hero'))) { nav.classList.add('solid'); }
    function onScroll() { nav.classList.toggle('scrolled', window.scrollY > 60); }
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
    function setOpen(open) {
      links.classList.toggle('open', open); nav.classList.toggle('menu-open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false'); btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      document.body.style.overflow = open ? 'hidden' : '';
    }
    btn.addEventListener('click', function () { setOpen(!links.classList.contains('open')); });
    backdrop.addEventListener('click', function () { setOpen(false); });
    $$('a', links).forEach(function (a) { a.addEventListener('click', function () { setOpen(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && links.classList.contains('open')) { setOpen(false); } });
  }

  /* Portable links: <a data-href="stays"> resolves to the right URL in WordPress and in local previews */
  function initLinks(root) {
    $$('a[data-href]', root).forEach(function (a) {
      var page = a.getAttribute('data-href');
      var params = null;
      if (a.getAttribute('data-stay')) { params = { stay: a.getAttribute('data-stay') }; }
      if (a.getAttribute('data-filter-link')) { params = { filter: a.getAttribute('data-filter-link') }; }
      a.href = url(page, params, a.getAttribute('data-hash') || '');
    });
    $$('a[href^="#"]', root).forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href').slice(1);
        var target = id ? document.getElementById(id) : null;
        if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); if (history.replaceState) { history.replaceState(null, '', '#' + id); } }
      });
    });
    $$('[data-year]', root).forEach(function (el) { el.textContent = String(new Date().getFullYear()); });
  }

  /* Inquiry forms */
  var ERRORS = {
    invalid: 'Please add your name and a valid email address so an advisor can reply.',
    consent: 'Please accept the privacy notice so we may contact you.',
    spam: 'Your submission could not be verified. Please try again, or email us directly.',
    rate: 'Please wait a moment before sending another request.',
    mail: 'The message could not be sent from the website. Please email us directly and we will reply promptly.'
  };
  function fillPropertySelects(root) {
    $$('select[data-properties]', root).forEach(function (sel) {
      var want = param('stay') || '';
      var html = '<option value="">Any property / not sure yet</option>';
      var groups = [['Resorts & Suites', 'hotel'], ['Private Villas', 'villa']];
      groups.forEach(function (g) {
        html += '<optgroup label="' + esc(g[0]) + '">';
        PROPERTIES.filter(function (p) { return p.cat === g[1]; }).forEach(function (p) {
          html += '<option value="' + esc(p.name) + '"' + (p.id === want ? ' selected' : '') + '>' + esc(p.name) + '</option>';
        });
        html += '</optgroup>';
      });
      sel.innerHTML = html;
    });
  }
  function initForms(root) {
    fillPropertySelects(root);
    $$('form[data-cr-form]', root).forEach(function (f) {
      var t = f.querySelector('input[name="cr_t"]'); if (t) { t.value = String(Math.floor(Date.now() / 1000)); }
      var subj = param('subject'); var subjEl = f.querySelector('[name="subject"]');
      if (subj && subjEl) { subjEl.value = subj; }
      if (CFG.formMode === 'post' && CFG.formAction) {
        f.setAttribute('action', CFG.formAction); f.setAttribute('method', 'post');
        var r = f.querySelector('input[name="cr_redirect"]');
        if (r) { r.value = window.location.href.split('#')[0].replace(/[?&]cr_(sent|error)=[^&]*/g, '').replace(/\?$/, ''); }
      } else {
        f.addEventListener('submit', function (e) { e.preventDefault(); mailtoSubmit(f, root); });
      }
    });
    var sent = param('cr_sent'), err = param('cr_error');
    var n = $('#crFormNotice', root);
    if (n && (sent || err)) {
      n.hidden = false;
      n.textContent = sent ? 'Thank you. Your request has been received and a C&R advisor will reply within one business day.' : (ERRORS[err] || ERRORS.mail);
      n.classList.toggle('error', !!err);
      setTimeout(function () { n.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 150);
    }
  }
  function mailtoSubmit(f, root) {
    var lines = [];
    $$('input, select, textarea', f).forEach(function (el) {
      if (!el.name || el.type === 'hidden' || el.name === 'website' || el.name === 'action') { return; }
      if (el.type === 'checkbox') { if (el.checked) { lines.push(el.name + ': yes'); } return; }
      if (el.value) { lines.push((el.getAttribute('data-label') || el.name) + ': ' + el.value); }
    });
    var subjEl = f.querySelector('[name="subject"]');
    var subject = '[C&R Inquiry] ' + (subjEl && subjEl.value ? subjEl.value : 'General');
    window.location.href = 'mailto:' + SITE.email + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(lines.join('\n'));
    var n = $('#crFormNotice', root);
    if (n) { n.hidden = false; n.classList.remove('error'); n.textContent = 'Your email app should open with the request pre-filled. If it does not, write to ' + SITE.email + '.'; }
  }

  /* ---------- 8. Boot ---------- */
  var PAGES = { home: renderHome, stays: renderStays, stay: renderProperty };
  function boot() {
    var root = $('.cr[data-page]');
    if (!root) { return; }
    document.documentElement.classList.add('cr-html');
    document.body.classList.add('cr-body');
    var page = root.getAttribute('data-page') || '';
    root.insertAdjacentHTML('afterbegin', navHtml(page));
    root.insertAdjacentHTML('beforeend', footerHtml());
    ensureLb(root);
    if (PAGES[page]) { PAGES[page](root); }
    initLinks(root);
    initNav(root);
    initFilters(root);
    initTabs(root);
    initLightboxGroups(root);
    initForms(root);
    observeReveals();
  }
  window.CR = { site: SITE, properties: PROPERTIES, url: url, img: img, config: CFG };
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', boot); } else { boot(); }
})();
