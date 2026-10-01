# Juni — personal site

Static personal site for https://02jn1.github.io/. No build step is required.

## Files

- `index.html`: page content and theme initialization.
- `styles.css`: responsive layout, light and dark palettes, and portrait cards.
- `script.js`: accordion, section positioning, social-link visibility, theme toggle, and Pacific-time clock.
- `assets/`: both profile photos used in the ID section.
- `.nojekyll`: serves the static files directly through GitHub Pages.

## Preview

Run `python3 -m http.server` in this folder and open the local address it prints.

## Publish

Copy these files and the `assets/` folder to the root of `02jn1/02jn1.github.io`, then commit and push to its Pages source branch. GitHub Pages publishes from the repository root.

## Behavior

- The sun/moon button switches themes and saves the choice in this browser.
- The page opens directly to JUNI and the section menu; there is no scrolling intro or down arrow.
- LinkedIn and Instagram sit side by side beneath JUNI and hide when scrolling into a section.
- Opening an accordion section positions its heading below the fixed site name. Only one section opens at a time.
- Both photo cards appear inside the expandable ID section.
- Reduced-motion preferences disable the animated transitions.
- Google Fonts supplies Arimo, DM Mono, and Hanken Grotesk.
