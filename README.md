# Skanis website

Lithuanian marketing site for **Skanis**, a mobile app that helps people spot the food allergens they care about in ingredient labels. The app is currently a closed beta, so the site's one job is to explain the product honestly and collect early-tester signups.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Motion · Three.js (react-three-fiber) · `next/font` (Manrope) · deployed on Netlify with `@netlify/plugin-nextjs`. It is the same stack as the Atlas site.

## What's on the site

| Route | Content |
|---|---|
| `/` | Hero with a live 3D scene, product intro, how it works, **interactive demo**, benefits, responsible use / privacy, beta signup, FAQ, closing 3D scene |
| `/privatumo-politika` | Privacy policy (adapted from the app's own policy) |
| `/naudojimo-salygos` | Terms of use |
| anything else | 404 page |

There is no pricing, subscription or payment anywhere, on purpose.

### The 3D scenes
Two small react-three-fiber stages (`src/components/three/`): the hero (a phone scanning a label, with glossy milk / peanut / wheat objects) and the closing scene (the logo mark on a pedestal). They are built from primitives, there are no model files. Each one:

- is loaded with `next/dynamic` (`ssr: false`), so the ≈1 MB of three.js is only downloaded when needed: on idle / first interaction (hero) or when scrolled near (closing scene);
- has a **CSS/SVG fallback underneath** (the drawn phone mockup), which is also what visitors with `prefers-reduced-motion` or no WebGL see;
- pauses rendering while off-screen.

The phone screens are an *illustration*, not screenshots, and every place that shows them says so.

### The demo
`src/content/demo.ts` holds three fictional products and a pure `analyzeDemo()` function. There is no OCR or backend. It never says a product is "safe": the clear case reads *"Pasirinktų alergenų pateiktame ingredientų sąraše neaptikta."* with a cross-contact disclaimer next to it. Unit tests cover the logic.

## Run it locally

Requires Node 20.9+ (Netlify builds with Node 22).

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run start      # serve the production build
npm run lint
npm run typecheck
npm test           # vitest: demo logic + signup helpers
```

> The signup form cannot succeed locally. It posts to Netlify Forms, which only exists on Netlify. Locally (dev **and** `npm run start`) it shows the "Nepavyko išsiųsti" error instead of pretending it worked. This is deliberate: there is no fake success path.

## Configuration

Copy `.env.example` to `.env.local` (and set the same names in Netlify → Site configuration → Environment variables). All are optional.

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Production URL for canonical links, Open Graph, `sitemap.xml`, `robots.txt`. On Netlify it falls back to the site's own URL (custom domain if set), so you only need it for another host. |
| `SITE_INDEXING` | Search engines may only index the production deploy (Netlify's `CONTEXT=production`); deploy previews are `noindex`. Set to `true` to force indexing elsewhere. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Shown in the footer when set; otherwise the footer points to the signup form. |
| `NEXT_PUBLIC_LEGAL_NAME`, `_LEGAL_CODE`, `_LEGAL_ADDRESS`, `_PRIVACY_EMAIL` | Fill the legal pages. While empty they render as highlighted yellow placeholders. |

## Deploy to Netlify

1. Push the repo to GitHub and **Add new site → Import an existing project** in Netlify. `netlify.toml` sets the build command, Node 22 and the `@netlify/plugin-nextjs` plugin (same as the Atlas site).
2. Add the environment variables above if you need them.
3. Deploy. Security headers and redirects live in `next.config.ts`; `sitemap.xml`, `robots.txt`, the icons and the Open Graph image come from files in `src/app/`.
4. If the old landing page lived at `/privatumas` (e.g. registered as the Google Play privacy URL), it now 301-redirects to `/privatumo-politika`.

### Netlify Forms: enabling and verifying
The signup form is a normal React form that `POST`s to `/__forms.html` using Netlify's AJAX pattern. A server-rendered Next.js page can't be scanned for forms, so Netlify finds it through a static stub, `public/__forms.html`, with the same form name and fields (`name="beta-signup"`, honeypot `bot-field`).

After the first deploy:

- [ ] Netlify → **Forms** lists **beta-signup**. If it doesn't, check *Site configuration → Forms → Form detection* is enabled and redeploy. If you ever rename a field, change it in both `SignupSection.tsx` and `public/__forms.html`.
- [ ] Submit the live form with your own address. You should see "Ačiū! Esi sąraše." and a new row under *Forms → beta-signup*.
- [ ] Turn on notifications: *Forms → Form notifications → Add notification → Email*, so new signups reach you.
- [ ] Submit with the checkbox unticked and with a bad email: both must show an error and send nothing.
- [ ] Spam: the honeypot plus Netlify's built-in spam filtering are active. If spam appears, enable reCAPTCHA 2 in Forms settings (needs a visible widget added to the form).
- [ ] Links like `https://your-site/?src=instagram-bio` record the channel in the `source` field.

Export signups as CSV from the Forms page. To delete someone, delete the submission there.

## Before launch (needs the business owner)

- [ ] **Legal details**: company name, code, address, privacy e-mail (env vars above). Get a lawyer to read `/privatumo-politika` and `/naudojimo-salygos`.
- [ ] **Privacy policy facts** to confirm against the real app: AI reading provider's data-retention wording, data regions of Supabase / Sentry / Netlify, and the statement "we do not store photos or text". Placeholders for these are marked in the text.
- [ ] **Contact e-mail** (`NEXT_PUBLIC_CONTACT_EMAIL`) once a real inbox exists.
- [ ] **Campaign picture** in the benefits section (`public/images/skanis-ad.jpg`) has "per sekundę" and "tiesą" baked into the artwork. Swap the file if you want wording closer to the site's careful tone.
- [ ] Custom domain connected in Netlify (the site URL follows it automatically).

## Project layout

```
src/
  app/          routes (layout, home, legal pages, 404), sitemap, robots, icons, OG image
  components/
    brand/      logo mark + wordmark (shared geometry with the 3D mark)
    layout/     header, footer, legal page layout
    phone/      drawn phone frame + the three illustrative app screens
    demo/       interactive demonstration
    sections/   home page sections
    three/      react-three-fiber scenes, lazy loading, fallbacks
    ui/         button, reveal-on-scroll, section heading, scan corners
  content/      demo data, FAQ copy
  lib/          site config, SEO helpers, signup helpers
public/         photos, __forms.html (Netlify Forms stub)
```
