# ExploreUP: add a city or district

ExploreUP already stores its 75 district records separately in `districts/<slug>/data.js`. This keeps city content separate from the main homepage and from Arya AI.

## Safest way to add one new city

1. Open the `districts` folder in GitHub.
2. Create a folder using a short lowercase slug, for example `new-city`.
3. Copy the structure of `districts/_template/data.js` into `districts/new-city/data.js`.
4. Replace the example values. Keep the property names (`name`, `tag`, `img`, `places`, `food`, `shop`, `time`, `budget`, `tip`, `about`, `distance`, `fee`, `rating`) unchanged.
5. Add a single script tag for the new data file in `index.html), in the existing group of district data script tags, before the main script that reads `window.ExploreUPDistricts`:

   ```html
   <script src="./districts/new-city/data.js"></script>
   ```

6. Commit the changes to `main` and wait for the connected Vercel deployment to finish.
7. Open the live site and test the city card, search, and detail view. If the image doesn't load, use a direct, public image URL.

## Important safety rules

- Do not delete or rename existing district folders or their slugs.
- Do not add `districts/_template/data.js` to the homepage script list; it is only a copyable template.
- Do not edit Arya AI files or the Arya script tags for city-content changes. Arya-related files include `arya-ai-bridge.js`, `arya-ai-knowledge.js`, `arya-ai-stability.js`, `arya-ai-ui.js`, `arya-v20-district-aliases.js`, `arya-v21-routing-fix.js`, and `api/arya.js`.
- Keep each new city's content in its own `data.js`; only the new script tag is needed in `index.html` for the current loader.
- Check that the city name is not already present before adding it, to avoid duplicate cards.

## Existing district example

See `districts/agra/data.js` for a real example and `districts/varanasi/data.js` for a district with extra video handling. For a normal new city, use the simple template rather than copying Varanasi's special video code.
