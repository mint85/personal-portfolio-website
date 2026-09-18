# allenjones.dev

Personal portfolio site for Allen Jones, Technical Support Engineer. Live at
https://www.allenjones.dev.

## Stack

Vanilla HTML, CSS, and JavaScript. No framework, no build step, no package.json.
Hosted on Netlify, deploying from the `master` branch with no build command.

Run it locally:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Files

- `index.html`: home page (hero, projects, skills, contact)
- `about.html`: about page
- `404.html`: custom not-found page, served automatically by Netlify
- `thanks.html`: no-JavaScript fallback success page for the contact form
- `style.css`, `script.js`: the only stylesheet and script
- `images/icons/`: self-hosted skill icons (see `images/icons/LICENSE.txt`)
- `robots.txt`, `sitemap.xml`

## Assets to replace

Remaining labeled placeholders. Overwrite them with the real image using the same
filename and no markup changes are needed:

- `images/about/casual.jpg` (casual photo, 3:4 portrait)
- `images/about/cat-01.jpg` through `cat-10.jpg` (square, polaroid pile)
- `images/about/cat-404.jpg` (3:2, used on the 404 page)
- `Allen_Jones_Resume.pdf` at the repo root (linked from the contact section)

## Contact form

The form uses Netlify Forms. Form detection must be enabled once in the Netlify UI
(Site configuration > Forms > Enable form detection) for submissions to be collected.

## Credits

The hero typing effect is adapted from a CodePen by CheeseTurtle:
https://codepen.io/CheeseTurtle/pen/AYJYqE

The accent color is `rebeccapurple`.

This project has been developed with AI assistance (Claude Code).
