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

## Structure

```
index.html         the entire site — markup, styles, and scripts
photo-hero.webp    hero portrait
photo-about.webp   about portrait / contact avatar
.nojekyll          serve files as-is, skip Jekyll processing
```

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
