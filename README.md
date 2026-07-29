# shameekyogi.github.io

Personal portfolio — building digital products across software, AI, and emerging technologies.

**Live:** https://shameekyogi68.github.io

## Stack

A single self-contained `index.html`. No framework, no build step, no dependencies —
all CSS and JavaScript are inline, so the page ships in one request and deploys by
pushing to `main`.

- **Hosting:** GitHub Pages (deploys from `main` on push)
- **Type:** Space Grotesk, Instrument Serif, JetBrains Mono
- **Images:** WebP, sized to their display dimensions
- **Installable:** PWA — offline-capable, installs to home screen on iOS and Android

## Structure

```
index.html             the entire site — markup, styles, and scripts
sw.js                  service worker: offline shell + asset caching
manifest.webmanifest   PWA metadata (name, icons, theme, standalone display)
photo-hero.webp        hero portrait
photo-about.webp       about portrait / contact avatar
icon-192/512.png       app icons (any + maskable)
apple-touch-icon.png   iOS home-screen icon
.nojekyll              serve files as-is, skip Jekyll processing
```

## Updating

Push to `main` and Pages redeploys. Navigations are network-first, so content
changes reach visitors on their next load.

**Bump `VERSION` in `sw.js`** when a precached asset changes (an image, the icons,
the manifest). The activate handler deletes every cache that doesn't match, which
is what stops a stale shell from surviving the update.

## Running locally

Any static file server works, since there is nothing to compile:

```bash
python3 -m http.server 4321
```

Then open http://localhost:4321.

## Notes

- The hero portrait's white studio backdrop is removed at render time with
  `mix-blend-mode: multiply` over a graded surface, rather than by masking the
  image — so the backdrop lighting is themeable in CSS.
- Motion respects `prefers-reduced-motion`; every animation is disabled under it.
