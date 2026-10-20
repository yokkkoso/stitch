# Stitch

Portfolio site of Kristina | Stitch, web designer. Plain static HTML/CSS/JS in `public/`, no build step.

## Development

Requires Node.js and Yarn 1.

```sh
yarn install
yarn dev
```

The site is served at http://localhost:3000.

## Deployment

### Vercel

Import the repository in Vercel. `vercel.json` sets the output directory to `public/`; there is no build command.

### GitHub Pages

`.github/workflows/pages.yml` publishes `public/` on every push to `main`. In the repository settings, set **Pages > Source** to **GitHub Actions**.

All asset paths are relative, so the site works both at a domain root (Vercel) and under `/stitch/` (GitHub Pages).
