# Stitch

Portfolio site of Kristina | Stitch, web designer. Plain static HTML/CSS/JS in `public/`, no build step.

Live at https://stitch.yokkkoso.me/

## Development

Requires Node.js and Yarn 1.

```sh
yarn install
yarn dev
```

The site is served at http://localhost:3000.

## Deployment

`.github/workflows/pages.yml` publishes `public/` to GitHub Pages on every push to `main`. The custom domain is set in the repository settings under **Pages**, with **Source** set to **GitHub Actions**.
