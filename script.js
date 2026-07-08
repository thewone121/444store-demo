/* ==========================================================================
   444 STORE — MASTER SCRIPT
   Vanilla JS only. Organised into small, self‑contained modules that each
   check for the DOM elements they need before running, so this single file
   can be safely included on every page of the site.

   TABLE OF CONTENTS
   1.  Utilities
   2.  Product catalogue (data + garment icon library)
   3.  Cart & wishlist store (localStorage)
   4.  Toast notifications
   5.  Preloader
   6.  Header scroll state + mobile menu
   7.  Search overlay
   8.  Cart / wishlist drawers
   9.  Quick view modal
   10. Product card rendering (grid injector)
   11. Scroll reveal (IntersectionObserver)
   12. Counter animations
   13. Parallax hero
   14. Reviews carousel controls
   15. Newsletter + contact form (fake submit)
   16. Home page bootstrap
   17. Shop page (filters/sort/search/pagination)
   18. Product detail page
   19. Cart page
   20. Checkout page
   21. Auth pages (login/register/forgot/reset/otp)
   22. Misc page bootstraps (footer year, nav active link)
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------------------
     1. UTILITIES
     ------------------------------------------------------------------------ */
  const $  = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));
  const on = (el, ev, fn, opts) => { if (el) el.addEventListener(ev, fn, opts); };
  const money = (n) => 'GH₵ ' + n.toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const qs = (name) => new URLSearchParams(window.location.search).get(name);
  const uid = () => Math.random().toString(36).slice(2, 9);

  /* ------------------------------------------------------------------------
     2. PRODUCT CATALOGUE
     Every "photo" in this site is a hand‑drawn line‑art garment icon layered
     over a colour‑blocked gradient panel — a deliberate editorial art
     direction (no stock photography, nothing to break or mismatch) built
     entirely from inline SVG + CSS gradients defined per product below.
     ------------------------------------------------------------------------ */
  const ICONS = {
    tee: `<path d="M38 14 L26 22 L18 34 L27 42 L34 35 L34 88 L66 88 L66 35 L73 42 L82 34 L74 22 L62 14 L57 20 L43 20 Z"/>`,
    hoodie: `<path d="M30 30 C30 16 70 16 70 30 L70 32 L74 24 L82 34 L73 42 L66 35 L66 90 L34 90 L34 35 L27 42 L18 34 L26 24 L30 32 Z"/>
              <path d="M40 60 Q50 68 60 60" />
              <line x1="47" y1="30" x2="45" y2="46"/><line x1="53" y1="30" x2="55" y2="46"/>`,
    crewneck: `<path d="M38 14 L26 22 L18 34 L27 42 L34 35 L34 88 L66 88 L66 35 L73 42 L82 34 L74 22 L62 14 L57 20 L43 20 Z"/>
              <ellipse cx="50" cy="20" rx="10" ry="4"/>
              <rect x="34" y="82" width="32" height="6" rx="2"/>`,
    polo: `<path d="M38 14 L26 22 L18 34 L27 42 L34 35 L34 88 L66 88 L66 35 L73 42 L82 34 L74 22 L62 14 L57 20 L50 26 L43 20 Z"/>
              <path d="M43 20 L38 30 L50 26 Z"/><path d="M57 20 L62 30 L50 26 Z"/>
              <circle cx="50" cy="36" r="1.4"/><circle cx="50" cy="43" r="1.4"/><circle cx="50" cy="50" r="1.4"/>`,
    cargo: `<path d="M28 14 L72 14 L70 90 L56 90 L52 46 L48 46 L44 90 L30 90 Z"/>
              <rect x="22" y="50" width="15" height="17" rx="2"/><line x1="22" y1="56" x2="37" y2="56"/>
              <rect x="63" y="50" width="15" height="17" rx="2"/><line x1="63" y1="56" x2="78" y2="56"/>`,
    trousers: `<path d="M30 14 L70 14 L68 90 L56 90 L50 45 L44 90 L32 90 Z"/><line x1="30" y1="22" x2="70" y2="22"/>`,
    bomber: `<path d="M38 14 L26 22 L18 34 L27 42 L34 35 L34 84 L66 84 L66 35 L73 42 L82 34 L74 22 L62 14 L57 20 L43 20 Z"/>
              <rect x="34" y="79" width="32" height="7" rx="3"/>
              <line x1="50" y1="20" x2="50" y2="83"/>
              <line x1="19" y1="31" x2="27" y2="37"/><line x1="81" y1="31" x2="73" y2="37"/>`,
    puffer: `<path d="M38 14 L30 22 L34 30 L34 88 L66 88 L66 30 L70 22 L62 14 L57 20 L43 20 Z"/>
              <line x1="34" y1="38" x2="66" y2="38"/><line x1="34" y1="50" x2="66" y2="50"/>
              <line x1="34" y1="62" x2="66" y2="62"/><line x1="34" y1="74" x2="66" y2="74"/>
              <line x1="50" y1="20" x2="50" y2="88"/>`,
    denim: `<path d="M38 14 L26 22 L18 34 L27 42 L34 35 L34 84 L66 84 L66 35 L73 42 L82 34 L74 22 L62 14 L57 20 L43 20 Z"/>
              <line x1="34" y1="34" x2="46" y2="34"/><line x1="54" y1="34" x2="66" y2="34"/>
              <rect x="38" y="40" width="10" height="9" rx="1"/><rect x="52" y="40" width="10" height="9" rx="1"/>
              <line x1="50" y1="20" x2="50" y2="83"/>
              <circle cx="50" cy="30" r="1.3"/><circle cx="50" cy="58" r="1.3"/><circle cx="50" cy="70" r="1.3"/>`,
    overcoat: `<path d="M36 14 L24 24 L20 36 L28 42 L35 34 L35 90 L50 84 L65 90 L65 34 L72 42 L80 36 L76 24 L64 14 L58 21 L42 21 Z"/>
              <line x1="50" y1="24" x2="50" y2="82"/><circle cx="50" cy="34" r="1.3"/><circle cx="50" cy="46" r="1.3"/><circle cx="50" cy="58" r="1.3"/>`,
    cap: `<path d="M20 62 C20 38 34 26 50 26 C66 26 80 38 80 62 Z"/>
              <path d="M20 62 C20 62 13 66 11 73 C30 78 70 78 89 73 C87 66 80 62 80 62 Z"/>
              <circle cx="50" cy="28" r="2.2"/>`,
    beanie: `<path d="M26 58 C26 30 34 18 50 18 C66 18 74 30 74 58 Z"/>
              <rect x="24" y="54" width="52" height="15" rx="7"/>
              <line x1="50" y1="18" x2="50" y2="30"/>`,
    bag: `<path d="M28 42 L50 24 L72 42 Z"/><rect x="28" y="42" width="44" height="36" rx="6"/>
              <line x1="18" y1="8" x2="82" y2="70"/><rect x="45" y="52" width="10" height="10" rx="1.5"/>`,
    tote: `<path d="M32 34 C32 20 68 20 68 34" /><rect x="24" y="34" width="52" height="48" rx="5"/>`
  };

  function svgIcon(key, extraClass) {
    const body = ICONS[key] || ICONS.tee;
    return `<svg class="garment-icon ${extraClass || ''}" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
  }

  // Colour swatch hex reference used by both product data and filter UI.
  const SWATCH = {
    Black: '#0b0b0d', Cream: '#f5f0e6', Sand: '#e8dfcb',
    Rust: '#8a3b2e', Olive: '#454a26', Gold: '#b08d57'
  };

  const PRODUCTS = [
    { id: 1, name: 'Foundation Oversized Tee', category: 'Tops', collection: 'The Foundation', price: 320, badge: 'New', icon: 'tee', altIcon: 'crewneck', gradient: ['#efe7d6', '#cdb078'], colors: ['Black', 'Cream', 'Rust'], sizes: ['XS','S','M','L','XL','XXL'], rating: 4.8, reviews: 132, tags: ['new','featured'], desc: 'A heavyweight 260gsm cotton tee cut with a relaxed, dropped shoulder — the quiet foundation piece every 444 wardrobe starts with.' },
    { id: 2, name: 'Alignment Heavyweight Hoodie', category: 'Tops', collection: '444 Vol. II — Guardian', price: 680, badge: 'Bestseller', icon: 'hoodie', altIcon: 'crewneck', gradient: ['#3a3735', '#141314'], colors: ['Black', 'Sand', 'Olive'], sizes: ['S','M','L','XL','XXL'], rating: 4.9, reviews: 210, tags: ['bestseller','featured'], desc: 'Brushed-back fleece, boxy silhouette, embroidered 444 mark at the chest. Built heavy so it holds its shape wash after wash.' },
    { id: 3, name: 'Guardian Cargo Pants', category: 'Bottoms', collection: '444 Vol. II — Guardian', price: 590, icon: 'cargo', altIcon: 'trousers', gradient: ['#e2dcc9', '#6f7048'], colors: ['Black', 'Sand'], sizes: ['XS','S','M','L','XL'], rating: 4.7, reviews: 88, tags: ['trending'], desc: 'Utility cargo trousers with articulated knees and triple-stitched cargo pockets, tapered from the knee for a modern drape.' },
    { id: 4, name: 'Clarity Wide-Leg Trousers', category: 'Bottoms', collection: 'The Foundation', price: 540, icon: 'trousers', altIcon: 'cargo', gradient: ['#faf4ea', '#e3d7bd'], colors: ['Cream', 'Black'], sizes: ['XS','S','M','L'], rating: 4.6, reviews: 54, tags: ['featured'], desc: 'Fluid, wide-leg trousers in a mid-weight twill with a clean waistband — tailoring softened for everyday wear.' },
    { id: 5, name: 'Sanctuary Bomber Jacket', category: 'Outerwear', collection: 'Heritage Edition', price: 980, badge: 'Trending', icon: 'bomber', altIcon: 'denim', gradient: ['#8a3b2e', '#241512'], colors: ['Black', 'Rust'], sizes: ['S','M','L','XL','XXL'], rating: 4.9, reviews: 76, tags: ['trending','featured'], desc: 'A structured bomber in water-resistant twill with ribbed cuffs and hem, lined in quilted satin for cool-season layering.' },
    { id: 6, name: 'Ascension Puffer Vest', category: 'Outerwear', collection: '444 Vol. II — Guardian', price: 860, icon: 'puffer', altIcon: 'bomber', gradient: ['#454a26', '#1a1b10'], colors: ['Black', 'Olive'], sizes: ['S','M','L','XL'], rating: 4.5, reviews: 40, tags: [], desc: 'Down-alternative puffer vest with a matte finish shell and internal storm cuffs — light, warm, and easy to layer.' },
    { id: 7, name: '444 Dad Cap', category: 'Headwear', collection: 'The Foundation', price: 180, badge: 'Bestseller', icon: 'cap', altIcon: 'beanie', gradient: ['#d9c093', '#8a6a3a'], colors: ['Black', 'Cream', 'Gold'], sizes: ['One Size'], rating: 4.8, reviews: 164, tags: ['bestseller','featured'], desc: 'Low-profile six-panel cap with a hand-embroidered 444 emblem and an adjustable brass strap-back closure.' },
    { id: 8, name: 'Heritage Beanie', category: 'Headwear', collection: 'Heritage Edition', price: 150, icon: 'beanie', altIcon: 'cap', gradient: ['#7a4136', '#241f1d'], colors: ['Black', 'Rust'], sizes: ['One Size'], rating: 4.6, reviews: 47, tags: [], desc: 'Ribbed merino-blend beanie with a folded cuff and woven 444 label — the first thing packed when the harmattan wind hits.' },
    { id: 9, name: 'Vessel Crossbody Bag', category: 'Accessories', collection: 'The Archive', price: 420, badge: 'New', icon: 'bag', altIcon: 'tote', gradient: ['#2a2826', '#0b0b0d'], colors: ['Black', 'Sand'], sizes: ['One Size'], rating: 4.7, reviews: 29, tags: ['new'], desc: 'Full-grain leather crossbody with a brass 444 hardware clasp and an adjustable strap. Fits a phone, cards and keys.' },
    { id: 10, name: 'Devotion Knit Polo', category: 'Tops', collection: 'The Foundation', price: 380, icon: 'polo', altIcon: 'tee', gradient: ['#e9e2c9', '#8a8a5a'], colors: ['Cream', 'Olive', 'Black'], sizes: ['S','M','L','XL'], rating: 4.5, reviews: 61, tags: [], desc: 'Fine-gauge cotton knit polo with a resort collar and horn buttons — quietly sharp, worn open or buttoned to the top.' },
    { id: 11, name: 'Anchor Denim Jacket', category: 'Outerwear', collection: 'The Archive', price: 890, oldPrice: 1080, badge: 'Sale', icon: 'denim', altIcon: 'bomber', gradient: ['#4a5c73', '#1c2733'], colors: ['Black', 'Sand'], sizes: ['S','M','L','XL'], rating: 4.8, reviews: 95, tags: ['sale'], desc: 'Rigid selvedge denim jacket, garment-washed for a broken-in feel, with twin chest pockets and a 444 leather patch.' },
    { id: 12, name: 'Instinct Track Pants', category: 'Bottoms', collection: '444 Vol. II — Guardian', price: 460, icon: 'trousers', altIcon: 'cargo', gradient: ['#d9c093', '#3a2f22'], colors: ['Black', 'Gold'], sizes: ['S','M','L','XL','XXL'], rating: 4.4, reviews: 33, tags: [], desc: 'Tapered track pants in a brushed technical knit with side piping and zippered ankle openings.' },
    { id: 13, name: 'Devotion Crewneck Sweatshirt', category: 'Tops', collection: 'The Foundation', price: 480, badge: 'New', icon: 'crewneck', altIcon: 'hoodie', gradient: ['#e8dfcb', '#8a3b2e'], colors: ['Sand', 'Black', 'Rust'], sizes: ['XS','S','M','L','XL'], rating: 4.7, reviews: 58, tags: ['new','featured'], desc: 'Loopback fleece crewneck with a dropped hem and tonal 444 embroidery at the collarbone.' },
    { id: 14, name: 'Providence Utility Shorts', category: 'Bottoms', collection: '444 Vol. II — Guardian', price: 340, icon: 'cargo', altIcon: 'trousers', gradient: ['#efe7d6', '#454a26'], colors: ['Black', 'Cream'], sizes: ['XS','S','M','L','XL'], rating: 4.3, reviews: 22, tags: [], desc: 'Knee-length utility shorts with reinforced cargo pockets and an adjustable internal waist tab.' },
    { id: 15, name: 'Reverence Wool Overcoat', category: 'Outerwear', collection: 'Heritage Edition', price: 1450, badge: 'Trending', icon: 'overcoat', altIcon: 'bomber', gradient: ['#33302c', '#141314'], colors: ['Black', 'Olive'], sizes: ['S','M','L','XL'], rating: 5.0, reviews: 18, tags: ['trending'], desc: 'A wool-blend overcoat with horn buttons and a half-belt back — the Heritage Edition\'s most considered piece.' },
    { id: 16, name: '444 Tote Bag', category: 'Accessories', collection: 'The Archive', price: 260, icon: 'tote', altIcon: 'bag', gradient: ['#faf4ea', '#cbb98f'], colors: ['Cream', 'Black'], sizes: ['One Size'], rating: 4.6, reviews: 41, tags: [], desc: 'Heavy canvas tote with leather-reinforced handles and a screen-printed 444 wordmark — built for daily carry.' }
  ];

  window.STORE444 = window.STORE444 || {};
  window.STORE444.PRODUCTS = PRODUCTS;
  window.STORE444.svgIcon = svgIcon;
  window.STORE444.SWATCH = SWATCH;
  window.STORE444.money = money;

  /* ------------------------------------------------------------------------
     3. CART & WISHLIST STORE
     ------------------------------------------------------------------------ */
  const CART_KEY = '444_cart';
  const WISH_KEY = '444_wishlist';

  const Cart = {
    get() { try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch (e) { return []; } },
    save(items) { try { localStorage.setItem(CART_KEY, JSON.stringify(items)); } catch (e) { /* storage unavailable — fail silently */ } Cart.renderBadge(); },
    add(product, qty, size, color) {
      const items = Cart.get();
      const existing = items.find(i => i.id === product.id && i.size === size && i.color === color);
      if (existing) { existing.qty += qty; }
      else {
        items.push({ key: uid(), id: product.id, name: product.name, price: product.price, icon: product.icon, gradient: product.gradient, size, color, qty });
      }
      Cart.save(items);
    },
    remove(key) { Cart.save(Cart.get().filter(i => i.key !== key)); },
    setQty(key, qty) {
      const items = Cart.get();
      const item = items.find(i => i.key === key);
      if (item) item.qty = Math.max(1, qty);
      Cart.save(items);
    },
    count() { return Cart.get().reduce((s, i) => s + i.qty, 0); },
    subtotal() { return Cart.get().reduce((s, i) => s + i.qty * i.price, 0); },
    clear() { Cart.save([]); },
    renderBadge() {
      $$('.js-cart-count').forEach(el => {
        const n = Cart.count();
        el.textContent = n;
        el.style.display = n > 0 ? 'flex' : 'none';
      });
    }
  };

  const Wishlist = {
    get() { try { return JSON.parse(localStorage.getItem(WISH_KEY)) || []; } catch (e) { return []; } },
    save(ids) { try { localStorage.setItem(WISH_KEY, JSON.stringify(ids)); } catch (e) { /* storage unavailable — fail silently */ } Wishlist.renderBadge(); },
    has(id) { return Wishlist.get().includes(id); },
    toggle(id) {
      let ids = Wishlist.get();
      if (ids.includes(id)) ids = ids.filter(x => x !== id); else ids.push(id);
      Wishlist.save(ids);
      return ids.includes(id);
    },
    renderBadge() {
      $$('.js-wishlist-count').forEach(el => {
        const n = Wishlist.get().length;
        el.textContent = n;
        el.style.display = n > 0 ? 'flex' : 'none';
      });
    }
  };

  window.STORE444.Cart = Cart;
  window.STORE444.Wishlist = Wishlist;

  /* ------------------------------------------------------------------------
     4. TOAST NOTIFICATIONS
     ------------------------------------------------------------------------ */
  function ensureToastStack() {
    let stack = $('.toast-stack');
    if (!stack) {
      stack = document.createElement('div');
      stack.className = 'toast-stack';
      stack.setAttribute('aria-live', 'polite');
      document.body.appendChild(stack);
    }
    return stack;
  }

  function showToast(message) {
    const stack = ensureToastStack();
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 13l4 4L19 7"/></svg><span>${message}</span>`;
    stack.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('is-visible'));
    setTimeout(() => {
      toast.classList.remove('is-visible');
      setTimeout(() => toast.remove(), 400);
    }, 2800);
  }
  window.STORE444.showToast = showToast;

  /* ------------------------------------------------------------------------
     5. PRELOADER
     ------------------------------------------------------------------------ */
  function initPreloader() {
    const pre = $('.preloader');
    if (!pre) return;
    window.addEventListener('load', () => {
      setTimeout(() => pre.classList.add('is-hidden'), 400);
    });
    // Safety net in case 'load' already fired before listener attached.
    setTimeout(() => pre.classList.add('is-hidden'), 2200);
  }

  /* ------------------------------------------------------------------------
     6. HEADER SCROLL STATE + MOBILE MENU
     ------------------------------------------------------------------------ */
  function initHeader() {
    const header = $('.site-header');
    if (header) {
      const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 12);
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    const toggle = $('.nav-toggle');
    const menu = $('.mobile-menu');
    if (toggle && menu) {
      on(toggle, 'click', () => {
        const open = menu.classList.toggle('is-open');
        toggle.classList.toggle('is-open', open);
        document.body.classList.toggle('no-scroll', open);
        toggle.setAttribute('aria-expanded', open);
      });
      $$('.mobile-menu-links a').forEach(a => on(a, 'click', () => {
        menu.classList.remove('is-open');
        toggle.classList.remove('is-open');
        document.body.classList.remove('no-scroll');
      }));
    }
  }

  /* ------------------------------------------------------------------------
     7. SEARCH OVERLAY
     ------------------------------------------------------------------------ */
  function initSearch() {
    const overlay = $('.search-overlay');
    const openers = $$('[data-open="search"]');
    const closer = $('.search-close');
    if (!overlay || !openers.length) return;
    const open = () => { overlay.classList.add('is-open'); document.body.classList.add('no-scroll'); setTimeout(() => $('input', overlay).focus(), 350); };
    const close = () => { overlay.classList.remove('is-open'); document.body.classList.remove('no-scroll'); };
    openers.forEach(btn => on(btn, 'click', open));
    on(closer, 'click', close);
    on(document, 'keydown', (e) => { if (e.key === 'Escape') close(); });

    const input = $('input', overlay);
    const suggestions = $$('.search-suggestions a');
    on(input, 'input', () => {
      const val = input.value.trim().toLowerCase();
      if (!val) return;
      const match = PRODUCTS.find(p => p.name.toLowerCase().includes(val));
      if (match) input.dataset.matchId = match.id;
    });
    on(overlay, 'submit', (e) => {
      e.preventDefault();
      const val = input.value.trim();
      if (val) window.location.href = `shop.html?q=${encodeURIComponent(val)}`;
    });
    suggestions.forEach(s => on(s, 'click', (e) => { e.preventDefault(); window.location.href = s.getAttribute('href'); }));
  }

  /* ------------------------------------------------------------------------
     8. CART / WISHLIST DRAWERS
     ------------------------------------------------------------------------ */
  function drawerItemMarkup(item, product) {
    const p = product || PRODUCTS.find(x => x.id === item.id) || {};
    return `
      <div class="drawer-item" data-key="${item.key}">
        <div class="drawer-item-thumb product-media" style="--p-a:${p.gradient ? p.gradient[0] : '#e8dfcb'};--p-b:${p.gradient ? p.gradient[1] : '#cbb98f'}">
          <div class="grain"></div>${svgIcon(item.icon || p.icon)}
        </div>
        <div class="drawer-item-info">
          <h4>${item.name}</h4>
          <p>${item.color || ''}${item.size ? ' · ' + item.size : ''} · Qty ${item.qty}</p>
          <span class="drawer-item-price">${money(item.price * item.qty)}</span>
          <div><button class="drawer-item-remove" data-remove="${item.key}">Remove</button></div>
        </div>
      </div>`;
  }

  function renderCartDrawer() {
    const body = $('#cartDrawerBody');
    const foot = $('#cartDrawerFoot');
    if (!body) return;
    const items = Cart.get();
    if (!items.length) {
      body.innerHTML = `<div class="drawer-empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M6 6h15l-1.5 9h-12z"/><path d="M6 6L4 3H2"/><circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/></svg>
        <p>Your bag is empty.</p>
        <a href="shop.html" class="btn btn--primary">Start Shopping</a>
      </div>`;
      if (foot) foot.style.display = 'none';
      return;
    }
    if (foot) foot.style.display = 'block';
    body.innerHTML = items.map(i => drawerItemMarkup(i)).join('');
    const subtotalEl = $('#cartDrawerSubtotal');
    if (subtotalEl) subtotalEl.textContent = money(Cart.subtotal());
    $$('[data-remove]', body).forEach(btn => on(btn, 'click', () => {
      Cart.remove(btn.dataset.remove);
      renderCartDrawer();
      showToast('Item removed from bag');
    }));
  }

  function renderWishDrawer() {
    const body = $('#wishDrawerBody');
    if (!body) return;
    const ids = Wishlist.get();
    if (!ids.length) {
      body.innerHTML = `<div class="drawer-empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M12 21s-7.5-4.6-10-9.3C.4 8 2 4 6 4c2.2 0 3.7 1.2 6 3.6C14.3 5.2 15.8 4 18 4c4 0 5.6 4 4 7.7C19.5 16.4 12 21 12 21z"/></svg>
        <p>Your wishlist is empty.</p>
        <a href="shop.html" class="btn btn--primary">Discover Pieces</a>
      </div>`;
      return;
    }
    body.innerHTML = ids.map(id => {
      const p = PRODUCTS.find(x => x.id === id);
      if (!p) return '';
      return `
      <div class="drawer-item" data-id="${p.id}">
        <div class="drawer-item-thumb product-media" style="--p-a:${p.gradient[0]};--p-b:${p.gradient[1]}">
          <div class="grain"></div>${svgIcon(p.icon)}
        </div>
        <div class="drawer-item-info">
          <h4>${p.name}</h4>
          <p>${p.category}</p>
          <span class="drawer-item-price">${money(p.price)}</span>
          <div><button class="drawer-item-remove" data-unwish="${p.id}">Remove</button></div>
        </div>
      </div>`;
    }).join('');
    $$('[data-unwish]', body).forEach(btn => on(btn, 'click', () => {
      Wishlist.toggle(parseInt(btn.dataset.unwish, 10));
      renderWishDrawer();
      syncWishlistIcons();
    }));
  }

  function initDrawers() {
    const scrim = $('.overlay-scrim');
    const cartDrawer = $('#cartDrawer');
    const wishDrawer = $('#wishDrawer');

    function openDrawer(drawer) {
      if (!drawer) return;
      $$('.drawer.is-open').forEach(d => d.classList.remove('is-open'));
      drawer.classList.add('is-open');
      if (scrim) scrim.classList.add('is-open');
      document.body.classList.add('no-scroll');
    }
    function closeDrawers() {
      $$('.drawer').forEach(d => d.classList.remove('is-open'));
      if (scrim) scrim.classList.remove('is-open');
      document.body.classList.remove('no-scroll');
    }

    $$('[data-open="cart"]').forEach(btn => on(btn, 'click', (e) => { e.preventDefault(); renderCartDrawer(); openDrawer(cartDrawer); }));
    $$('[data-open="wishlist"]').forEach(btn => on(btn, 'click', (e) => { e.preventDefault(); renderWishDrawer(); openDrawer(wishDrawer); }));
    $$('[data-close-drawer]').forEach(btn => on(btn, 'click', closeDrawers));
    on(scrim, 'click', closeDrawers);
    on(document, 'keydown', (e) => { if (e.key === 'Escape') closeDrawers(); });

    Cart.renderBadge();
    Wishlist.renderBadge();
  }

  function syncWishlistIcons() {
    $$('[data-wishlist-btn]').forEach(btn => {
      const id = parseInt(btn.dataset.wishlistBtn, 10);
      btn.classList.toggle('is-active', Wishlist.has(id));
    });
  }

  /* ------------------------------------------------------------------------
     9. QUICK VIEW MODAL
     ------------------------------------------------------------------------ */
  function initQuickView() {
    const scrim = $('#quickViewScrim');
    if (!scrim) return;
    const modal = $('.quickview-modal', scrim);

    function open(product) {
      const firstColor = product.colors[0];
      const firstSize = product.sizes[0];
      modal.innerHTML = `
        <button class="quickview-close" data-close-modal aria-label="Close quick view">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg>
        </button>
        <div class="quickview-media product-media" style="--p-a:${product.gradient[0]};--p-b:${product.gradient[1]}">
          <div class="grain"></div>${svgIcon(product.icon)}
        </div>
        <div class="quickview-info">
          <span class="eyebrow">${product.collection}</span>
          <h3>${product.name}</h3>
          <div class="quickview-price">${money(product.price)}</div>
          <p class="section-lead" style="margin-bottom:1.5rem;">${product.desc}</p>
          <div class="option-group">
            <div class="option-group-head"><h4>Colour</h4><span class="selected-value" data-qv-color-label>${firstColor}</span></div>
            <div class="color-options" data-qv-colors>
              ${product.colors.map((c, i) => `<button class="color-swatch ${i === 0 ? 'is-active' : ''}" style="background:${SWATCH[c]}" data-color="${c}" aria-label="${c}"></button>`).join('')}
            </div>
          </div>
          <div class="option-group">
            <div class="option-group-head"><h4>Size</h4><a href="product.html?id=${product.id}#sizeGuide" class="size-guide-link">Size Guide</a></div>
            <div class="size-options" data-qv-sizes>
              ${product.sizes.map((s, i) => `<button class="${i === 0 ? 'is-active' : ''}" data-size="${s}">${s}</button>`).join('')}
            </div>
          </div>
          <div class="product-actions">
            <button class="btn btn--primary" data-qv-add><span>Add to Bag</span><span class="btn-arrow">→</span></button>
            <button class="btn btn--outline btn--icon" data-qv-wish aria-label="Add to wishlist">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 21s-7.5-4.6-10-9.3C.4 8 2 4 6 4c2.2 0 3.7 1.2 6 3.6C14.3 5.2 15.8 4 18 4c4 0 5.6 4 4 7.7C19.5 16.4 12 21 12 21z"/></svg>
            </button>
          </div>
          <a href="product.html?id=${product.id}" class="btn--ghost" style="display:inline-flex;">View Full Details <span class="btn-arrow">→</span></a>
        </div>`;

      let state = { color: firstColor, size: firstSize };
      $$('[data-qv-colors] .color-swatch', modal).forEach(sw => on(sw, 'click', () => {
        $$('[data-qv-colors] .color-swatch', modal).forEach(x => x.classList.remove('is-active'));
        sw.classList.add('is-active');
        state.color = sw.dataset.color;
        $('[data-qv-color-label]', modal).textContent = state.color;
      }));
      $$('[data-qv-sizes] button', modal).forEach(sb => on(sb, 'click', () => {
        $$('[data-qv-sizes] button', modal).forEach(x => x.classList.remove('is-active'));
        sb.classList.add('is-active');
        state.size = sb.dataset.size;
      }));
      on($('[data-qv-add]', modal), 'click', () => {
        Cart.add(product, 1, state.size, state.color);
        showToast(`${product.name} added to your bag`);
        renderCartDrawer();
      });
      const wishBtn = $('[data-qv-wish]', modal);
      wishBtn.classList.toggle('is-active', Wishlist.has(product.id));
      on(wishBtn, 'click', () => {
        const active = Wishlist.toggle(product.id);
        wishBtn.classList.toggle('is-active', active);
        showToast(active ? 'Added to wishlist' : 'Removed from wishlist');
        syncWishlistIcons();
      });

      scrim.classList.add('is-open');
      document.body.classList.add('no-scroll');
    }

    function close() { scrim.classList.remove('is-open'); document.body.classList.remove('no-scroll'); }

    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-quickview]');
      if (trigger) {
        e.preventDefault();
        const id = parseInt(trigger.dataset.quickview, 10);
        const product = PRODUCTS.find(p => p.id === id);
        if (product) open(product);
      }
      if (e.target.closest('[data-close-modal]')) close();
    });
    on(scrim, 'click', (e) => { if (e.target === scrim) close(); });
    on(document, 'keydown', (e) => { if (e.key === 'Escape') close(); });
  }

  /* ------------------------------------------------------------------------
     10. PRODUCT CARD RENDERING
     ------------------------------------------------------------------------ */
  function productCardHTML(p) {
    const wished = Wishlist.has(p.id);
    return `
    <article class="product-card" data-reveal="up">
      <div class="product-media">
        <div class="grain"></div>
        ${p.badge ? `<span class="product-badge ${p.badge === 'Sale' ? 'product-badge--sale' : ''}">${p.badge}</span>` : ''}
        <button class="product-wishlist ${wished ? 'is-active' : ''}" data-wishlist-btn="${p.id}" aria-label="Add ${p.name} to wishlist">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 21s-7.5-4.6-10-9.3C.4 8 2 4 6 4c2.2 0 3.7 1.2 6 3.6C14.3 5.2 15.8 4 18 4c4 0 5.6 4 4 7.7C19.5 16.4 12 21 12 21z"/></svg>
        </button>
        <a href="product.html?id=${p.id}" aria-label="View ${p.name}" style="position:absolute;inset:0;z-index:2;">
          <span style="--p-a:${p.gradient[0]};--p-b:${p.gradient[1]};position:absolute;inset:0;" class="product-media-bg"></span>
        </a>
        ${svgIcon(p.icon, 'main')}${svgIcon(p.altIcon || p.icon, 'alt')}
        <div class="product-quickview">
          <button class="btn btn--gold btn--sm btn--block" data-quickview="${p.id}">Quick View</button>
        </div>
      </div>
      <div class="product-info">
        <div class="product-info-top">
          <div>
            <h3 class="product-name"><a href="product.html?id=${p.id}">${p.name}</a></h3>
            <p class="product-cat">${p.category}</p>
          </div>
          <p class="product-price">${p.oldPrice ? `<span class="was">${money(p.oldPrice)}</span>` : ''}${money(p.price)}</p>
        </div>
        <div class="product-swatches">${p.colors.map(c => `<i style="background:${SWATCH[c]}" title="${c}"></i>`).join('')}</div>
      </div>
    </article>`;
  }
  // Fix background gradient assignment (inline style on ::before pseudo requires CSS var on parent, not the anchor).
  function fixProductMediaVars(container) {
    $$('.product-card', container).forEach(card => {
      const bg = $('.product-media-bg', card);
      if (bg) {
        card.querySelector('.product-media').style.setProperty('--p-a', bg.style.getPropertyValue('--p-a'));
        card.querySelector('.product-media').style.setProperty('--p-b', bg.style.getPropertyValue('--p-b'));
      }
    });
  }

  function renderProductGrid(container, products) {
    if (!container) return;
    container.innerHTML = products.map(productCardHTML).join('');
    fixProductMediaVars(container);
    bindWishlistButtons(container);
    initRevealFor(container);
  }
  window.STORE444.renderProductGrid = renderProductGrid;
  window.STORE444.productCardHTML = productCardHTML;

  function bindWishlistButtons(scope) {
    $$('[data-wishlist-btn]', scope || document).forEach(btn => {
      on(btn, 'click', (e) => {
        e.preventDefault();
        const id = parseInt(btn.dataset.wishlistBtn, 10);
        const active = Wishlist.toggle(id);
        btn.classList.toggle('is-active', active);
        showToast(active ? 'Added to wishlist' : 'Removed from wishlist');
      });
    });
  }

  /* ------------------------------------------------------------------------
     11. SCROLL REVEAL
     ------------------------------------------------------------------------ */
  let revealObserver;
  function getRevealObserver() {
    if (revealObserver) return revealObserver;
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    return revealObserver;
  }
  function initRevealFor(scope) {
    const obs = getRevealObserver();
    $$('[data-reveal]', scope || document).forEach((el, i) => {
      el.style.setProperty('--stagger', i % 8);
      obs.observe(el);
    });
  }

  /* ------------------------------------------------------------------------
     12. COUNTER ANIMATIONS
     ------------------------------------------------------------------------ */
  function initCounters() {
    const counters = $$('[data-counter]');
    if (!counters.length) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.dataset.counter);
        const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals, 10) : 0;
        const duration = 1600;
        const start = performance.now();
        function tick(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const value = target * eased;
          el.textContent = decimals ? value.toFixed(decimals) : Math.floor(value).toLocaleString();
          if (progress < 1) requestAnimationFrame(tick);
          else el.textContent = decimals ? target.toFixed(decimals) : target.toLocaleString();
        }
        requestAnimationFrame(tick);
        obs.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(c => obs.observe(c));
  }

  /* ------------------------------------------------------------------------
     13. PARALLAX HERO
     ------------------------------------------------------------------------ */
  function initParallax() {
    const numeral = $('.hero-numeral');
    const figure = $('.hero-figure');
    if (!numeral && !figure) return;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (numeral) numeral.style.transform = `translateY(${-46 + y * 0.02}%)`;
      if (figure) figure.style.transform = `translateY(${y * 0.12}px)`;
    }, { passive: true });

    const hero = $('.hero');
    if (hero && figure) {
      on(hero, 'mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        figure.style.transform += ` rotate(${x * 1.5}deg)`;
        figure.style.transition = 'transform 0.3s ease-out';
      });
    }
  }

  /* ------------------------------------------------------------------------
     14. REVIEWS CAROUSEL CONTROLS
     ------------------------------------------------------------------------ */
  function initReviewsCarousel() {
    const track = $('.reviews-track');
    const prev = $('[data-review-prev]');
    const next = $('[data-review-next]');
    if (!track) return;
    const scrollAmount = () => track.clientWidth * 0.8;
    on(next, 'click', () => track.scrollBy({ left: scrollAmount(), behavior: 'smooth' }));
    on(prev, 'click', () => track.scrollBy({ left: -scrollAmount(), behavior: 'smooth' }));
  }

  /* ------------------------------------------------------------------------
     15. NEWSLETTER + CONTACT FORM (fake submit)
     ------------------------------------------------------------------------ */
  function initFakeForms() {
    $$('form[data-fake-submit]').forEach(form => {
      on(form, 'submit', (e) => {
        e.preventDefault();
        const msg = form.dataset.fakeSubmit || 'Thank you — we’ll be in touch shortly.';
        showToast(msg);
        form.reset();
      });
    });
  }

  /* ------------------------------------------------------------------------
     16. HOME PAGE BOOTSTRAP
     ------------------------------------------------------------------------ */
  function initHomePage() {
    const newArrivals = $('#newArrivalsGrid');
    const bestSellers = $('#bestSellersGrid');
    const trending = $('#trendingGrid');
    const featured = $('#featuredGrid');
    if (!newArrivals && !bestSellers && !trending && !featured) return;

    if (newArrivals) renderProductGrid(newArrivals, PRODUCTS.filter(p => p.tags.includes('new')).slice(0, 4));
    if (bestSellers) renderProductGrid(bestSellers, PRODUCTS.filter(p => p.tags.includes('bestseller')).slice(0, 4));
    if (trending) renderProductGrid(trending, PRODUCTS.filter(p => p.tags.includes('trending')).slice(0, 4));
    if (featured) renderProductGrid(featured, PRODUCTS.filter(p => p.tags.includes('featured')).slice(0, 8));
  }

  /* ------------------------------------------------------------------------
     17. SHOP PAGE
     ------------------------------------------------------------------------ */
  function initShopPage() {
    const grid = $('#shopGrid');
    if (!grid) return;

    const state = {
      category: new Set(),
      size: new Set(),
      color: new Set(),
      maxPrice: 1600,
      sort: 'newest',
      search: qs('q') || '',
      page: 1,
      perPage: 8
    };

    const searchInput = $('#shopSearchInput');
    if (searchInput && state.search) searchInput.value = state.search;

    function applyFilters() {
      let list = PRODUCTS.slice();
      if (state.category.size) list = list.filter(p => state.category.has(p.category));
      if (state.size.size) list = list.filter(p => p.sizes.some(s => state.size.has(s)));
      if (state.color.size) list = list.filter(p => p.colors.some(c => state.color.has(c)));
      list = list.filter(p => p.price <= state.maxPrice);
      if (state.search) {
        const q = state.search.toLowerCase();
        list = list.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.collection.toLowerCase().includes(q));
      }
      switch (state.sort) {
        case 'price-low': list.sort((a, b) => a.price - b.price); break;
        case 'price-high': list.sort((a, b) => b.price - a.price); break;
        case 'popular': list.sort((a, b) => b.reviews - a.reviews); break;
        default: list.sort((a, b) => b.id - a.id);
      }
      return list;
    }

    function renderActivePills() {
      const wrap = $('#activeFilters');
      if (!wrap) return;
      const pills = [];
      state.category.forEach(v => pills.push({ type: 'category', v }));
      state.size.forEach(v => pills.push({ type: 'size', v }));
      state.color.forEach(v => pills.push({ type: 'color', v }));
      wrap.innerHTML = pills.map(p => `<span class="active-filter-pill" data-pill-type="${p.type}" data-pill-value="${p.v}">${p.v}<button aria-label="Remove filter">×</button></span>`).join('');
      $$('.active-filter-pill button', wrap).forEach(btn => on(btn, 'click', () => {
        const pill = btn.closest('.active-filter-pill');
        state[pill.dataset.pillType].delete(pill.dataset.pillValue);
        syncFilterUI();
        render();
      }));
    }

    function syncFilterUI() {
      $$('[data-filter-category]').forEach(el => el.classList.toggle('is-checked', state.category.has(el.dataset.filterCategory)));
      $$('input[data-filter-category]').forEach(el => { el.checked = state.category.has(el.dataset.filterCategory); });
      $$('input[data-filter-size]').forEach(el => { el.checked = state.size.has(el.dataset.filterSize); });
      $$('.filter-swatch[data-filter-color]').forEach(el => el.classList.toggle('is-active', state.color.has(el.dataset.filterColor)));
    }

    function render() {
      const filtered = applyFilters();
      const totalPages = Math.max(1, Math.ceil(filtered.length / state.perPage));
      state.page = Math.min(state.page, totalPages);
      const start = (state.page - 1) * state.perPage;
      const pageItems = filtered.slice(start, start + state.perPage);

      renderProductGrid(grid, pageItems);
      const noResults = $('#noResults');
      if (noResults) noResults.classList.toggle('is-visible', filtered.length === 0);

      const countEl = $('#resultsCount');
      if (countEl) countEl.textContent = `${filtered.length} piece${filtered.length !== 1 ? 's' : ''}`;

      renderActivePills();
      renderPagination(totalPages);
    }

    function renderPagination(totalPages) {
      const wrap = $('#pagination');
      if (!wrap) return;
      if (totalPages <= 1) { wrap.innerHTML = ''; return; }
      let html = '';
      for (let i = 1; i <= totalPages; i++) {
        html += `<button class="${i === state.page ? 'is-active' : ''}" data-page="${i}">${i}</button>`;
      }
      wrap.innerHTML = html;
      $$('button', wrap).forEach(btn => on(btn, 'click', () => {
        state.page = parseInt(btn.dataset.page, 10);
        render();
        grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }));
    }

    // Category checkboxes
    $$('input[data-filter-category]').forEach(cb => on(cb, 'change', () => {
      cb.checked ? state.category.add(cb.dataset.filterCategory) : state.category.delete(cb.dataset.filterCategory);
      state.page = 1; render();
    }));
    // Size buttons
    $$('.filter-size[data-filter-size]').forEach(btn => on(btn, 'click', () => {
      const s = btn.dataset.filterSize;
      btn.classList.toggle('is-active');
      state.size.has(s) ? state.size.delete(s) : state.size.add(s);
      state.page = 1; render();
    }));
    // Colour swatches
    $$('.filter-swatch[data-filter-color]').forEach(btn => on(btn, 'click', () => {
      const c = btn.dataset.filterColor;
      btn.classList.toggle('is-active');
      state.color.has(c) ? state.color.delete(c) : state.color.add(c);
      state.page = 1; render();
    }));
    // Price range
    const priceRange = $('#priceRange');
    if (priceRange) {
      state.maxPrice = parseInt(priceRange.value, 10);
      on(priceRange, 'input', () => {
        state.maxPrice = parseInt(priceRange.value, 10);
        const label = $('#priceRangeValue');
        if (label) label.textContent = money(state.maxPrice);
        state.page = 1; render();
      });
    }
    // Sort
    const sortSelect = $('#sortSelect');
    if (sortSelect) on(sortSelect, 'change', () => { state.sort = sortSelect.value; render(); });
    // Search
    if (searchInput) on(searchInput, 'input', () => { state.search = searchInput.value; state.page = 1; render(); });
    // Clear all
    const clearBtn = $('#clearFilters');
    if (clearBtn) on(clearBtn, 'click', () => {
      state.category.clear(); state.size.clear(); state.color.clear();
      state.maxPrice = 1600; state.search = ''; if (searchInput) searchInput.value = '';
      if (priceRange) priceRange.value = 1600;
      $$('.filter-size').forEach(b => b.classList.remove('is-active'));
      syncFilterUI(); state.page = 1; render();
    });
    // Mobile filter toggle
    const filtersMobileToggle = $('#filtersMobileToggle');
    const filtersPanel = $('.filters');
    if (filtersMobileToggle && filtersPanel) {
      on(filtersMobileToggle, 'click', () => filtersPanel.classList.toggle('is-open-mobile'));
    }

    render();
  }

  /* ------------------------------------------------------------------------
     18. PRODUCT DETAIL PAGE
     ------------------------------------------------------------------------ */
  function initProductPage() {
    const wrap = $('#productDetail');
    if (!wrap) return;
    const id = parseInt(qs('id'), 10) || PRODUCTS[0].id;
    const product = PRODUCTS.find(p => p.id === id) || PRODUCTS[0];

    document.title = `${product.name} — 444 Store`;
    $('#pdEyebrow').textContent = product.collection;
    $('#pdTitle').textContent = product.name;
    $('#pdPrice').innerHTML = product.oldPrice ? `<span class="was">${money(product.oldPrice)}</span>${money(product.price)}` : money(product.price);
    $('#pdDesc').textContent = product.desc;
    $('#pdReviewCount').textContent = `${product.reviews} reviews`;
    $('#pdSku').textContent = `444-${String(product.id).padStart(4, '0')}`;
    $('#breadcrumbCurrent').textContent = product.name;

    // Gallery — 4 stylised angles built from the same icon set for a
    // consistent, intentional look (Front / Detail / Back / Styled).
    const angles = [product.icon, product.altIcon || product.icon, product.icon, product.altIcon || product.icon];
    const galleryMain = $('#galleryMain');
    const galleryThumbs = $('#galleryThumbs');
    galleryMain.style.setProperty('--p-a', product.gradient[0]);
    galleryMain.style.setProperty('--p-b', product.gradient[1]);
    function setMain(index) {
      galleryMain.innerHTML = `<div class="grain"></div>${svgIcon(angles[index])}`;
      $$('.gallery-thumb', galleryThumbs).forEach((t, i) => t.classList.toggle('is-active', i === index));
    }
    galleryThumbs.innerHTML = angles.map((icon, i) => `
      <button class="gallery-thumb" style="--p-a:${product.gradient[0]};--p-b:${product.gradient[1]}" data-thumb="${i}" aria-label="View angle ${i + 1}">
        <div class="grain"></div>${svgIcon(icon)}
      </button>`).join('');
    setMain(0);
    $$('.gallery-thumb', galleryThumbs).forEach(t => on(t, 'click', () => setMain(parseInt(t.dataset.thumb, 10))));
    on(galleryMain, 'mouseenter', () => galleryMain.classList.add('is-zoomed'));
    on(galleryMain, 'mouseleave', () => galleryMain.classList.remove('is-zoomed'));
    on(galleryMain, 'click', () => galleryMain.classList.toggle('is-zoomed'));

    // Colour + size selectors
    let selectedColor = product.colors[0];
    let selectedSize = null;
    const colorWrap = $('#pdColors');
    colorWrap.innerHTML = product.colors.map((c, i) => `<button class="color-swatch ${i === 0 ? 'is-active' : ''}" style="background:${SWATCH[c]}" data-color="${c}" aria-label="${c}"></button>`).join('');
    $('#pdColorLabel').textContent = selectedColor;
    $$('.color-swatch', colorWrap).forEach(sw => on(sw, 'click', () => {
      $$('.color-swatch', colorWrap).forEach(x => x.classList.remove('is-active'));
      sw.classList.add('is-active');
      selectedColor = sw.dataset.color;
      $('#pdColorLabel').textContent = selectedColor;
    }));

    const sizeWrap = $('#pdSizes');
    sizeWrap.innerHTML = product.sizes.map(s => `<button data-size="${s}">${s}</button>`).join('');
    $$('button', sizeWrap).forEach(sb => on(sb, 'click', () => {
      $$('button', sizeWrap).forEach(x => x.classList.remove('is-active'));
      sb.classList.add('is-active');
      selectedSize = sb.dataset.size;
      $('#pdSizeError').style.display = 'none';
    }));

    // Quantity stepper
    let qty = 1;
    const qtyInput = $('#pdQty');
    on($('#pdQtyMinus'), 'click', () => { qty = Math.max(1, qty - 1); qtyInput.value = qty; });
    on($('#pdQtyPlus'), 'click', () => { qty = Math.min(10, qty + 1); qtyInput.value = qty; });
    on(qtyInput, 'change', () => { qty = Math.min(10, Math.max(1, parseInt(qtyInput.value, 10) || 1)); qtyInput.value = qty; });

    // Add to cart / wishlist
    on($('#pdAddToCart'), 'click', () => {
      if (!selectedSize) { $('#pdSizeError').style.display = 'block'; return; }
      Cart.add(product, qty, selectedSize, selectedColor);
      showToast(`${product.name} added to your bag`);
      renderCartDrawer();
    });
    const wishBtn = $('#pdWishlist');
    wishBtn.classList.toggle('is-active', Wishlist.has(product.id));
    on(wishBtn, 'click', () => {
      const active = Wishlist.toggle(product.id);
      wishBtn.classList.toggle('is-active', active);
      showToast(active ? 'Added to wishlist' : 'Removed from wishlist');
    });

    // Accordions
    $$('.accordion-trigger').forEach(trigger => on(trigger, 'click', () => {
      const item = trigger.closest('.accordion-item');
      const panel = $('.accordion-panel', item);
      const isOpen = item.classList.contains('is-open');
      $$('.accordion-item').forEach(i => { i.classList.remove('is-open'); $('.accordion-panel', i).style.maxHeight = null; });
      if (!isOpen) { item.classList.add('is-open'); panel.style.maxHeight = panel.scrollHeight + 'px'; }
    }));

    // Related products
    const related = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
    renderProductGrid($('#relatedGrid'), related.length ? related : PRODUCTS.filter(p => p.id !== product.id).slice(0, 4));
  }

  /* ------------------------------------------------------------------------
     19. CART PAGE
     ------------------------------------------------------------------------ */
  function initCartPage() {
    const wrap = $('#cartPage');
    if (!wrap) return;

    const SHIPPING_RATES = { accra: 25, greater_accra: 35, other: 60 };
    let couponApplied = false;

    function render() {
      const items = Cart.get();
      const tableWrap = $('#cartTableWrap');
      const emptyWrap = $('#cartEmptyWrap');
      if (!items.length) {
        tableWrap.style.display = 'none';
        emptyWrap.style.display = 'block';
        updateSummary([]);
        return;
      }
      tableWrap.style.display = 'block';
      emptyWrap.style.display = 'none';

      $('#cartRows').innerHTML = items.map(item => {
        const p = PRODUCTS.find(x => x.id === item.id) || {};
        return `
        <div class="cart-row" data-key="${item.key}">
          <div class="cart-row-product">
            <div class="cart-thumb product-media" style="--p-a:${item.gradient ? item.gradient[0] : '#e8dfcb'};--p-b:${item.gradient ? item.gradient[1] : '#cbb98f'}">
              <div class="grain"></div>${svgIcon(item.icon || p.icon)}
            </div>
            <div class="cart-row-info">
              <h4>${item.name}</h4>
              <p>${item.color || ''}${item.size ? ' · Size ' + item.size : ''}</p>
              <button class="cart-row-remove" data-remove="${item.key}">Remove</button>
            </div>
          </div>
          <div class="cart-row-price">${money(item.price)}</div>
          <div class="qty-stepper" data-qty-key="${item.key}">
            <button data-step="-1" aria-label="Decrease quantity">−</button>
            <input type="text" value="${item.qty}" readonly>
            <button data-step="1" aria-label="Increase quantity">+</button>
          </div>
          <div class="cart-row-total">${money(item.price * item.qty)}</div>
          <button class="cart-row-close" data-remove="${item.key}" aria-label="Remove item">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg>
          </button>
        </div>`;
      }).join('');

      $$('[data-remove]').forEach(btn => on(btn, 'click', () => { Cart.remove(btn.dataset.remove); showToast('Item removed from bag'); render(); }));
      $$('[data-qty-key]').forEach(stepper => {
        const key = stepper.dataset.qtyKey;
        $$('button', stepper).forEach(btn => on(btn, 'click', () => {
          const item = Cart.get().find(i => i.key === key);
          if (!item) return;
          Cart.setQty(key, item.qty + parseInt(btn.dataset.step, 10));
          render();
        }));
      });

      updateSummary(items);
    }

    function updateSummary(items) {
      const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
      const shipSelect = $('#shippingZone');
      const zone = shipSelect ? shipSelect.value : 'accra';
      const shipping = items.length ? (subtotal >= 900 ? 0 : SHIPPING_RATES[zone]) : 0;
      const discount = couponApplied ? subtotal * 0.1 : 0;
      const total = Math.max(0, subtotal - discount + shipping);

      $('#summarySubtotal').textContent = money(subtotal);
      $('#summaryShipping').textContent = shipping === 0 ? 'Free' : money(shipping);
      $('#summaryDiscount').parentElement.style.display = discount > 0 ? 'flex' : 'none';
      $('#summaryDiscount').textContent = '−' + money(discount);
      $('#summaryTotal').textContent = money(total);

      const checkoutBtn = $('#goToCheckout');
      if (checkoutBtn) checkoutBtn.classList.toggle('disabled-look', items.length === 0);
    }

    on($('#shippingZone'), 'change', () => updateSummary(Cart.get()));

    on($('#couponForm'), 'submit', (e) => {
      e.preventDefault();
      const input = $('#couponInput');
      const note = $('#couponNote');
      if (input.value.trim().toUpperCase() === 'WELCOME10') {
        couponApplied = true;
        note.textContent = 'Code "WELCOME10" applied — 10% off your order.';
        note.classList.add('is-visible');
        updateSummary(Cart.get());
      } else {
        note.textContent = 'That code isn’t valid. Try WELCOME10.';
        note.style.color = 'var(--c-rust)';
        note.classList.add('is-visible');
      }
    });

    render();
  }

  /* ------------------------------------------------------------------------
     20. CHECKOUT PAGE
     ------------------------------------------------------------------------ */
  function initCheckoutPage() {
    const wrap = $('#checkoutPage');
    if (!wrap) return;

    const items = Cart.get();
    let orderAlreadyComplete = false;
    try { orderAlreadyComplete = !!sessionStorage.getItem('444_order_complete'); } catch (e) { /* storage unavailable */ }
    if (!items.length && !orderAlreadyComplete) {
      // No items — send back to cart rather than showing an empty checkout.
      const emptyNotice = $('#checkoutEmptyNotice');
      if (emptyNotice) emptyNotice.style.display = 'block';
    }

    // Render mini order summary
    function renderMiniSummary() {
      const list = $('#miniOrderList');
      if (!list) return;
      const currentItems = Cart.get();
      list.innerHTML = currentItems.map(item => {
        const p = PRODUCTS.find(x => x.id === item.id) || {};
        return `<div class="mini-item">
          <div class="mini-thumb product-media" style="--p-a:${item.gradient ? item.gradient[0] : '#e8dfcb'};--p-b:${item.gradient ? item.gradient[1] : '#cbb98f'}">${svgIcon(item.icon || p.icon)}</div>
          <div><h5>${item.name}</h5><span>${item.color || ''}${item.size ? ' · ' + item.size : ''} · Qty ${item.qty}</span></div>
          <strong>${money(item.price * item.qty)}</strong>
        </div>`;
      }).join('');
      const subtotal = currentItems.reduce((s, i) => s + i.price * i.qty, 0);
      const shipping = deliverySelection === 'express' ? 60 : (subtotal >= 900 ? 0 : 25);
      const total = subtotal + shipping;
      $('#coSubtotal').textContent = money(subtotal);
      $('#coShipping').textContent = shipping === 0 ? 'Free' : money(shipping);
      $('#coTotal').textContent = money(total);
      return total;
    }

    // Step navigation
    const steps = ['shipping', 'delivery', 'payment', 'review'];
    let currentStepIndex = 0;
    let deliverySelection = 'standard';
    let paymentSelection = 'card';

    function goToStep(index) {
      currentStepIndex = Math.max(0, Math.min(steps.length - 1, index));
      $$('.checkout-panel').forEach((p, i) => p.classList.toggle('is-active', i === currentStepIndex));
      $$('.checkout-step').forEach((s, i) => {
        s.classList.toggle('is-active', i === currentStepIndex);
        s.classList.toggle('is-done', i < currentStepIndex);
      });
      window.scrollTo({ top: $('.checkout-steps').offsetTop - 120, behavior: 'smooth' });
    }

    $$('[data-next-step]').forEach(btn => on(btn, 'click', () => {
      const panel = btn.closest('.checkout-panel');
      if (panel && panel.id === 'stepShipping') {
        const required = $$('#stepShipping [required]');
        const valid = required.every(inp => inp.value.trim() !== '');
        if (!valid) { showToast('Please fill in all required shipping details'); required.forEach(inp => { if (!inp.value.trim()) inp.style.borderColor = 'var(--c-rust)'; }); return; }
      }
      goToStep(currentStepIndex + 1);
      if (steps[currentStepIndex] === 'review') renderMiniSummary();
    }));
    $$('[data-prev-step]').forEach(btn => on(btn, 'click', () => goToStep(currentStepIndex - 1)));

    // Delivery options
    $$('.option-card[data-delivery]').forEach(card => on(card, 'click', () => {
      $$('.option-card[data-delivery]').forEach(c => c.classList.remove('is-active'));
      card.classList.add('is-active');
      $('input', card).checked = true;
      deliverySelection = card.dataset.delivery;
    }));

    // Payment options
    $$('.option-card[data-payment]').forEach(card => on(card, 'click', () => {
      $$('.option-card[data-payment]').forEach(c => c.classList.remove('is-active'));
      card.classList.add('is-active');
      $('input', card).checked = true;
      paymentSelection = card.dataset.payment;
      $$('.payment-detail-fields').forEach(f => f.style.display = 'none');
      const target = $(`[data-payment-fields="${paymentSelection}"]`);
      if (target) target.style.display = 'block';
    }));

    // Place order
    on($('#placeOrderBtn'), 'click', () => {
      const orderId = '444-' + Math.floor(100000 + Math.random() * 899999);
      try { sessionStorage.setItem('444_order_complete', orderId); } catch (e) { /* storage unavailable — order still confirms visually */ }
      $('#confirmationOrderId').textContent = `Order #${orderId}`;
      $$('.checkout-panel').forEach(p => p.classList.remove('is-active'));
      $('#stepConfirmation').classList.add('is-active');
      $('.checkout-steps').style.display = 'none';
      Cart.clear();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    renderMiniSummary();
    goToStep(0);
  }

  /* ------------------------------------------------------------------------
     21. AUTH PAGES
     ------------------------------------------------------------------------ */
  function initAuthPages() {
    // Password visibility toggles
    $$('.password-toggle').forEach(toggle => on(toggle, 'click', () => {
      const input = toggle.closest('.password-field').querySelector('input');
      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      toggle.textContent = isPassword ? 'Hide' : 'Show';
    }));

    // Password strength meter
    const pwField = $('#registerPassword');
    const strengthBar = $('#passwordStrength');
    if (pwField && strengthBar) {
      on(pwField, 'input', () => {
        const val = pwField.value;
        let score = 0;
        if (val.length >= 8) score++;
        if (/[A-Z]/.test(val)) score++;
        if (/[0-9]/.test(val)) score++;
        if (/[^A-Za-z0-9]/.test(val)) score++;
        strengthBar.className = 'password-strength';
        if (val.length === 0) return;
        if (score <= 1) strengthBar.classList.add('weak');
        else if (score <= 3) strengthBar.classList.add('medium');
        else strengthBar.classList.add('strong');
      });
    }

    // Generic auth form fake-submit (login/register/forgot/reset)
    $$('form[data-auth-form]').forEach(form => on(form, 'submit', (e) => {
      e.preventDefault();
      const dest = form.dataset.authForm;
      if (dest) window.location.href = dest;
    }));

    // OTP inputs — auto advance, backspace handling, paste support
    const otpInputs = $$('.otp-inputs input');
    if (otpInputs.length) {
      otpInputs.forEach((input, i) => {
        on(input, 'input', () => {
          input.value = input.value.replace(/[^0-9]/g, '').slice(0, 1);
          if (input.value && otpInputs[i + 1]) otpInputs[i + 1].focus();
        });
        on(input, 'keydown', (e) => {
          if (e.key === 'Backspace' && !input.value && otpInputs[i - 1]) otpInputs[i - 1].focus();
        });
        on(input, 'paste', (e) => {
          e.preventDefault();
          const digits = (e.clipboardData.getData('text') || '').replace(/[^0-9]/g, '').split('');
          otpInputs.forEach((inp, idx) => { inp.value = digits[idx] || ''; });
          const next = otpInputs[Math.min(digits.length, otpInputs.length - 1)];
          if (next) next.focus();
        });
      });

      // Resend countdown
      const resendBtn = $('#otpResendBtn');
      const resendTimer = $('#otpTimer');
      if (resendBtn && resendTimer) {
        let seconds = 45;
        resendBtn.disabled = true;
        const interval = setInterval(() => {
          seconds--;
          resendTimer.textContent = `(${seconds}s)`;
          if (seconds <= 0) {
            clearInterval(interval);
            resendBtn.disabled = false;
            resendTimer.textContent = '';
          }
        }, 1000);
        on(resendBtn, 'click', () => {
          if (resendBtn.disabled) return;
          showToast('A new code has been sent');
          seconds = 45;
          resendBtn.disabled = true;
          const interval2 = setInterval(() => {
            seconds--;
            resendTimer.textContent = `(${seconds}s)`;
            if (seconds <= 0) { clearInterval(interval2); resendBtn.disabled = false; resendTimer.textContent = ''; }
          }, 1000);
        });
      }
    }
  }

  /* ------------------------------------------------------------------------
     22. MISC BOOTSTRAPS
     ------------------------------------------------------------------------ */
  function initFooterYear() {
    $$('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
  }

  function initActiveNavLink() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    $$('.nav-links a, .mobile-menu-links a').forEach(a => {
      const href = a.getAttribute('href');
      if (href === path || (path === '' && href === 'index.html')) a.classList.add('is-active');
    });
  }

  /* ------------------------------------------------------------------------
     BOOTSTRAP EVERYTHING ON DOM READY
     ------------------------------------------------------------------------ */
  document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initHeader();
    initSearch();
    initDrawers();
    initQuickView();
    initCounters();
    initParallax();
    initReviewsCarousel();
    initFakeForms();
    initFooterYear();
    initActiveNavLink();

    initHomePage();
    initShopPage();
    initProductPage();
    initCartPage();
    initCheckoutPage();
    initAuthPages();

    syncWishlistIcons();
    initRevealFor(document);
  });
})();
