# Kade Networks website

Static landing page for Kade Networks. It is plain HTML, CSS and JavaScript with no build step.

## Run locally

Open `index.html` in a browser, or serve the folder:

```
python3 -m http.server 8080
```

## Structure

- `index.html` holds every section: header, hero, services, hotspot finder, packages, loyalty, values, FAQs and footer.
- `css/styles.css` holds the styles, light and dark themes, and responsive breakpoints.
- `js/main.js` runs the mobile menu, theme toggle, hotspot search, package comparison and FAQ controls.
- `assets/img/` holds the hero, hotspot and loyalty images.

## Editing content

- **Hotspot locations** live in the `HOTSPOTS` list at the top of the hotspot section in `js/main.js`.
- **Package prices and features** are in the Packages section of `index.html` and in the comparison table under it.
- **Footer links** marked `href="#"` are placeholders for pages that do not exist yet.
