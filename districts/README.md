# ExploreUP District Structure

ExploreUP keeps each of Uttar Pradesh's 75 districts in its own folder under `/districts`.

Each district currently has:

```
districts/<district-slug>/data.js
```

The `data.js` file is the district-specific place to maintain editable content such as name, tag, image, places, food, shopping, travel season, budget, tips and about text.

## Rules

- Keep one folder per district.
- Keep the district slug stable once used by the homepage.
- Add district-specific media inside that district folder when needed.
- Keep shared site code outside `/districts`.
- Do not put Arya AI files inside the district folders or modify Arya AI while editing district content.

The homepage loads all 75 district `data.js` modules and builds the existing district cards/modal from their data.
