# CLAUDE.md — Frontend Website Rules

## Project
- **Muslim Will** (a product of Patriva) — a live estate-planning product. This folder holds a
  standalone **simulation** of its post-login dashboard (`index.html`) so UI changes can be
  iterated quickly and compared against screenshots of the real app.
- Reference screenshots of the live product come from the user in chat. Match them exactly.
- **The user's screen runs Windows at 125% scaling.** Reference screenshots are in physical pixels,
  so every measurement taken from them must be divided by 1.25 to get CSS px (1880px-wide capture
  = 1504px CSS viewport; sidebar 316 → 256 = `w-64`; body 17 → 14 = `text-sm`; H1 37 → 30 = `text-3xl`).

## Always Do First
- **Invoke the `frontend-design` skill** before writing any frontend code, every session, no exceptions.
  (If that skill is not available in the session, load `artifact-design` instead and say so.)

## Reference Images
- If a reference image is provided: match layout, spacing, typography, and color exactly. Swap in placeholder content (images via `https://placehold.co/`, generic copy). Do not improve or add to the design.
- If no reference image: design from scratch with high craft (see guardrails below).
- Screenshot your output, compare against reference, fix mismatches, re-screenshot. Do at least 2 comparison rounds. Stop only when no visible differences remain or user says so.

## Local Server
- **Always serve on localhost** — never screenshot a `file:///` URL.
- Start the dev server: `node serve.mjs` (serves the project root at `http://localhost:3000`)
- `serve.mjs` lives in the project root. Start it in the background before taking any screenshots.
- If the server is already running, do not start a second instance (`serve.mjs` exits cleanly if port 3000 is busy).

## Screenshot Workflow
- `screenshot.mjs` lives in the project root and uses **headless Chrome/Edge directly** (no Puppeteer install on this machine). Use it as-is.
- **Always screenshot from localhost:** `node screenshot.mjs http://localhost:3000`
- Screenshots are saved automatically to `./temporary screenshots/screenshot-N.png` (auto-incremented, never overwritten).
- Optional label suffix: `node screenshot.mjs http://localhost:3000 label` → saves as `screenshot-N-label.png`
- Viewport: `SHOT_SIZE=1504,678 node screenshot.mjs …` (default `1504,678` = the reference capture ÷ 1.25; compare reference coordinates ÷ 1.25 against the screenshot 1:1).
- **Mobile/tablet gotcha:** Chrome clamps the headless window to ~500px minimum, so a 390px `SHOT_SIZE` produces a cropped desktop layout, not a mobile one. Use the iframe harness instead:
  `SHOT_SIZE=1240,1200 node screenshot.mjs "http://localhost:3000/temporary%20screenshots/mobile-frame.html" mobile`
  (`temporary screenshots/mobile-frame.html` embeds the page at 390px and 768px).
- After screenshotting, read the PNG from `temporary screenshots/` with the Read tool — Claude can see and analyze the image directly.
- When comparing, be specific: "heading is 32px but reference shows ~24px", "card gap is 16px but should be 24px"
- Check: spacing/padding, font size/weight/line-height, colors (exact hex), alignment, border-radius, shadows, image sizing

## Page structure (single-file SPA)
- `index.html` holds every screen as a `<section class="view" id="view-NAME">`; a tiny hash router shows one at a time. Sidebar + topbar are shared; each view sets `data-title` (topbar crumb) and `data-nav` (active sidebar item).
- Routes: `#home` (post-login landing), `#vault` (Explore My Vault, pre-purchase), `#vault-home` (SUBSCRIBED Vault dashboard — matches the live "My Vault" screen; full-width container via `data-wide`), `#add-package`, `#checkout` (`#checkout?error=1` pre-renders the declined state), `#purchase-success`, `#reset` (clears simulation state).
- Sidebar has two variants driven by the view's `data-sidebar`: `pre` (not subscribed: "My Estate Plan", PREVIEW chips, chevrons) and `post` (subscribed: "Dashboard", My Bridge locked, My Vault plain). Elements carry `data-sub="pre|post"`; label swaps use `data-sub-text="pre|post"`. Toggle with `toggleAttribute('hidden')` — SVG elements have no `.hidden` property.
- Simulation state lives in `localStorage['mw-sim']` (`will: 'available' | 'active'`); elements tagged `data-will="active|available"` show only in that state. `[hidden]{display:none!important}` is required because component classes set `display`.
- Click-through test: `node <scratchpad>/e2e/flow-test.mjs` (puppeteer-core, uses local Chrome) — asserts the Add Package flow incl. declined payment, and writes `temporary screenshots/e2e-*.png`.
- Screenshot a view with its hash: `SHOT_SIZE=1504,900 node screenshot.mjs "http://localhost:3000/#vault" label`.
- Add new screens as new views (and new hash routes) — don't fork into separate HTML files, so the simulated flows stay navigable.

## Publishing (Claude Artifact)
- Published at https://claude.ai/code/artifact/02d95a5d-43c5-4d8f-9d75-b63d031ab5f8 (private; the user shares it from the page's share menu).
- To republish after edits: `node artifact-copy.mjs` (strips the html/head/body wrapper, moves body classes to a `#app-root` div), then publish that copy with the Artifact tool passing the URL above as `url` so the link stays the same.

## Output Defaults
- Single `index.html` file, all styles inline, unless user says otherwise
- Tailwind CSS via CDN: `<script src="https://cdn.tailwindcss.com"></script>`
  - Brand tokens live in the inline `tailwind.config` block at the top of `index.html`; reusable components (`.btn`, `.card`, `.nav-item`, …) in the `<style type="text/tailwindcss">` block via `@apply`. Edit tokens first, markup second.
- Placeholder images: `https://placehold.co/WIDTHxHEIGHT`
- Mobile-first responsive (sidebar becomes a drawer below `md`; desktop hero/type sizes kick in at `lg`)

## Brand Assets
- Always check the `brand_assets/` folder before designing. It may contain logos, color guides, style guides, or images.
- If assets exist there, use them. Do not use placeholders where real assets are available.
- If a logo is present, use it. If a color palette is defined, use those exact values — do not invent brand colors.
- `brand_assets/` holds the real Patriva logo (`patriva-logo-on-dark.svg`, extracted from app.patriva.com's login page) and the fetched CSS (`patriva-app-design-tokens.css`, `patriva-app-login.css`).
- **Fonts (from patriva.com):** `Playfair Display` for display/headings (hero 400, section headings 500), `Inter` for everything else (nav 600, buttons/links/eyebrows 500, body 400). Body size 13.5px; eyebrows 11px / .18em; labels 10.5px / .1em.
- **Palette (from patriva.com tokens + logo):** navy `#0B1F3B` (logo) / `#081C38` (ink-950), gold `#C8A868`, gold text-on-white `#B69352`, gold-deep `#8A6D33`, gold-line `#E5D6B4`, ink scale `#12263F / #3A4A61 / #61718A / #8694AB / #AEB9CB / #CFD7E2 / #E6EBF1`, cream ground `#F5F3EE` (sampled — the app's current tokens file retired the cream/gold system in favour of blue, but Muslim Will still ships the gold look).

## Anti-Generic Guardrails
- **Colors:** Never use default Tailwind palette (indigo-500, blue-600, etc.). Pick a custom brand color and derive from it.
- **Shadows:** Never use flat `shadow-md`. Use layered, color-tinted shadows with low opacity.
- **Typography:** Never use the same font for headings and body. Pair a display/serif with a clean sans. Apply tight tracking (`-0.03em`) on large headings, generous line-height (`1.7`) on body.
- **Gradients:** Layer multiple radial gradients. Add grain/texture via SVG noise filter for depth.
- **Animations:** Only animate `transform` and `opacity`. Never `transition-all`. Use spring-style easing.
- **Interactive states:** Every clickable element needs hover, focus-visible, and active states. No exceptions.
- **Images:** Add a gradient overlay (`bg-gradient-to-t from-black/60`) and a color treatment layer with `mix-blend-multiply`.
- **Spacing:** Use intentional, consistent spacing tokens — not random Tailwind steps.
- **Depth:** Surfaces should have a layering system (base → elevated → floating), not all sit at the same z-plane.

## Hard Rules
- Do not add sections, features, or content not in the reference
- Do not "improve" a reference design — match it
- Do not stop after one screenshot pass
- Do not use `transition-all`
- Do not use default Tailwind blue/indigo as primary color
