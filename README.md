# Muslim Will — dashboard simulation

A standalone, click-through simulation of the **Muslim Will** (a product of Patriva) web dashboard,
built to prototype UX changes quickly against screenshots of the live product before they go to
the real codebase.

Everything is one file — [`index.html`](index.html) — with Tailwind (CDN), Playfair Display + Inter,
and a tiny hash router. No build step.

## Run it

```bash
node serve.mjs          # serves this folder at http://localhost:3000
```

Open <http://localhost:3000>. Live preview (private, shared from its Share menu):
<https://claude.ai/code/artifact/02d95a5d-43c5-4d8f-9d75-b63d031ab5f8>

## Screens (hash routes)

| Route | Screen |
| --- | --- |
| `#home` | Post-login landing — choose Islamic Will or My Vault |
| `#vault` | "Explore My Vault" (pre-purchase) |
| `#vault-home` | **My Vault after subscribing** — matches the live screen, plus the new **Add Package** strip (Requirement 1) |
| `#add-package` | Packages available to *add* (owned ones are shown as Active, not purchasable) |
| `#checkout` | Confirm + pay with the saved card; `#checkout?error=1` shows the declined state |
| `#purchase-success` | Package added — Vault subscription stays active |
| `#reset` | Clears the simulation state |

Simulation state (which packages the user owns) lives in `localStorage['mw-sim']` and is per browser.
On the checkout page a **"Simulation: make this payment fail"** checkbox exercises the failure path.

## Tooling

- `screenshot.mjs` — headless Chrome/Edge screenshots for pixel comparison against reference captures
  (`node screenshot.mjs "http://localhost:3000/#vault-home" label`; default viewport `1504,678`).
  Mobile/tablet: `temporary screenshots/mobile-frame.html?hash=vault-home` embeds the page at 390 px and 768 px.
- `artifact-copy.mjs` — builds the wrapper-free copy used to republish the Claude Artifact.
- `brand_assets/` — Patriva logo (SVG) and the design-token / login CSS fetched from patriva.com.
- `CLAUDE.md` — working rules for the AI assistant (design tokens, screenshot loop, project structure).

## Notes

- Reference screenshots come from a Windows display at 125 % scaling: divide measured pixels by 1.25 to get CSS px.
- The Islamic Will package price ($99 CAD one-time) and the card CTAs are placeholders until confirmed.
