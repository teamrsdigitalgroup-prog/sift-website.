# Sift marketing site

A static single-page marketing website for Sift. It uses plain HTML, CSS, and JavaScript, with no backend, database, build step, or runtime API calls.

## Files

- `index.html` - page markup, SEO tags, and placeholder comments for missing links/assets
- `styles.css` - visual system, layout, responsive styles, and motion preferences
- `script.js` - sticky nav state and scroll reveal behavior

## Preview locally

Open `index.html` directly in a browser, or run a tiny static server:

```bash
python3 -m http.server 4173
```

Then visit `http://localhost:4173`.

## Deploy to Cloudflare Pages

1. Create a GitHub repository and upload these files to the repository root.
2. In Cloudflare Pages, choose **Create a project**, connect the repository, and select it.
3. Set the build command to blank, set the output directory to `/`, then deploy.

## Deploy to GitHub Pages

1. Create a GitHub repository and upload these files to the repository root.
2. Go to **Settings → Pages** in the repository.
3. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/root`, then save.

## Deploy to Netlify

1. Create a GitHub repository and upload these files to the repository root.
2. In Netlify, choose **Add new site → Import an existing project**, then connect the repository.
3. Leave the build command blank, set the publish directory to `/`, and deploy.

## Before launch

Replace the placeholders marked with `TODO` comments in `index.html`:

- Real favicon
- Real Open Graph image URL
- Rohit's photo
- Instagram URL for `@rawatjourney`
- Real email, WhatsApp, or contact destination for the CTA buttons
