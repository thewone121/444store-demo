# 444 Store — Premium Streetwear Frontend

A hand-coded, premium e-commerce frontend concept for **444 Store**, a Ghanaian streetwear label based in Accra. Built with plain **HTML5, CSS3 and vanilla JavaScript** — no frameworks, no build step, no backend.

> This is a frontend-only concept. There is no server, database, or real payment processing — cart, wishlist, checkout and auth flows are simulated with `localStorage` and client-side JavaScript so the experience feels real without needing a backend.

## Structure

```
├── index.html              Homepage
├── shop.html                Shop / product listing with filters, sort & search
├── product.html              Product detail page (?id=1 … 16)
├── cart.html                 Shopping bag
├── checkout.html             Multi-step checkout + order confirmation
├── login.html                 Sign in
├── register.html              Create account
├── forgot-password.html       Request a reset code
├── otp-verification.html      4-digit OTP entry
├── reset-password.html        Set a new password
├── about.html                 Brand story, mission, vision, timeline
├── contact.html                Contact form, store info, map placeholder
├── faq.html / returns.html / privacy-policy.html / terms.html
├── style.css                  Single design-system stylesheet (documented, sectioned)
├── script.js                  All site behaviour (documented, sectioned)
└── assets/
    ├── icons/favicon.svg
    ├── images/                (reserved — the site uses generated SVG/CSS art direction, see below)
    └── fonts/                 (reserved — fonts load from Google Fonts CDN by default)
```

## A note on imagery

Rather than using stock photography that wouldn't match 444 Store's real product line, every "photo" on this site is an original, hand-drawn line-art garment icon layered over a colour-blocked gradient panel — a deliberate editorial art direction defined entirely in `script.js` (`ICONS` object) and `style.css`. Nothing is hot-linked from a third-party image host, so the site loads fast and never shows a broken image.

## Running locally

No build step is required. Because the site uses `fetch`-free, relative-path assets, you can simply open `index.html` in a browser, or serve the folder locally for the most accurate experience:

```bash
# Option 1 — Python
python3 -m http.server 8000

# Option 2 — Node
npx serve .
```

Then visit `http://localhost:8000`.

## Deploying to GitHub Pages

1. Push this folder to a GitHub repository (the `index.html` must sit at the repository root, or in `/docs` if you choose that option below).
2. In your repository, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to `Deploy from a branch`.
4. Choose the branch (usually `main`) and the folder (`/root` or `/docs`), then **Save**.
5. GitHub will publish the site at `https://<your-username>.github.io/<repository-name>/`.

Because every internal link (`shop.html`, `assets/icons/favicon.svg`, etc.) uses **relative paths**, the site works correctly whether it's hosted at a domain root or in a repository subpath — no configuration changes needed.

## Customising for the real brand

- **Colours & type** — defined once as CSS custom properties at the top of `style.css` (`:root`).
- **Products** — defined once as a single `PRODUCTS` array in `script.js`; every page (home, shop, product, cart, checkout) reads from this one source of truth.
- **Social links** — update the Instagram/TikTok/Facebook/WhatsApp URLs in each page's footer and header.
- **Brand copy** — About, Contact and hero copy are written specifically for 444 Store and should be swapped for verified brand facts before this goes live.
