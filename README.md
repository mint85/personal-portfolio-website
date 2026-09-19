# allenjones.dev

Personal portfolio site for Allen Jones, Technical Support Engineer. Live at
https://www.allenjones.dev.

## Stack

Vanilla HTML, CSS, and JavaScript. No framework, no build step, no package.json.
Dark default with a light theme toggle, persisted in `localStorage`. Hosted on Netlify,
which deploys production automatically from the `master` branch with no build command.

Run it locally:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Making changes

Do not push directly to `master`, since that publishes to the live site immediately. Work
on a branch, preview it with a Netlify deploy preview (open a pull request against `master`),
then merge once it looks right.

## Contact form

The form uses Netlify Forms. It is already set up: form detection is on and an email
notification fires on each submission. If the form is ever recreated, re-enable both under
the site's Forms settings in the Netlify UI.

## Credits

The hero typing effect is adapted from a CodePen by CheeseTurtle:
https://codepen.io/CheeseTurtle/pen/AYJYqE

The accent color is `rebeccapurple`, a named CSS color added in 2014 in memory of Rebecca
Meyer.

This project has been developed with AI assistance (Claude Code).
