# ExploreUP Google Sheets backend (staging scaffold)

This folder contains the first backend scaffold. It is **not live** until a spreadsheet is created, Apps Script is configured and deployed, and the website is explicitly connected to the deployed endpoint.

## Migration rules

- Keep the existing Supabase Auth integration for login/signup during this migration.
- Do not put passwords, access tokens, private user profiles, or admin secrets in a public spreadsheet.
- Do not delete or deactivate Supabase as part of this scaffold.
- Keep Arya AI code and its existing provider configuration untouched.
- Test with a separate staging spreadsheet before switching production traffic.
- Public submissions are stored as `pending`; an authenticated admin moderation workflow still needs to be implemented and tested separately.
- Never put a Google service-account private key, Apps Script secret, or privileged API key in `index.html`.

## Create the spreadsheet

Create a Google Spreadsheet named **ExploreUP Master Data** and add these tabs. Row 1 of each tab must contain the exact headers below.

### Districts
`district_slug | district_name | region | description | hero_image_url | map_url | status`

### Places
`place_id | district_slug | place_name | category | description | image_url | map_url | address | opening_hours | status`

### Food_Stays
`item_id | district_slug | item_type | name | description | image_url | map_url | price_range | status`

### Suggestions
`id | created_at | district_slug | message | email | status`

### Reviews
`id | created_at | district_slug | rating | message | display_name | status`

### Analytics
`id | created_at | event_type | district_slug | path`

### Settings
`key | value | updated_at`

Keep the spreadsheet private. The Apps Script runs as the owner and accesses it by its ID; the sheet itself should not be shared publicly.

## Configure Apps Script

1. Open the spreadsheet, then choose **Extensions → Apps Script**.
2. Replace the starter script with the contents of `Code.gs`.
3. Open **Project Settings → Script properties** and add `SPREADSHEET_ID` with the ID from the spreadsheet URL.
4. Save and run a small test from the editor to authorize Spreadsheet access.
5. Deploy as a **Web app**, executing as the owner. Choose access settings deliberately and use a dedicated project/spreadsheet.
6. Test the health endpoint with `?action=health`, then test each read action on the staging spreadsheet.
7. Before connecting the website, validate browser CORS behavior for both reads and submissions. Apps Script web apps may redirect; if browser CORS is unreliable, proxy requests through a Vercel server-side function rather than exposing credentials.

## API scaffold

GET actions:
- `?action=health`
- `?action=districts`
- `?action=places`
- `?action=food_stays`
- `?action=settings`

POST JSON actions:
- `{"action":"suggestion","district_slug":"...","message":"...","email":"optional","website":""}`
- `{"action":"review","district_slug":"...","rating":5,"message":"...","display_name":"optional","website":""}`
- `{"action":"analytics","event_type":"district_open","district_slug":"...","path":"/#districts" }`

For a public website, send no secrets in these payloads. Public writes must remain limited to visitor-submitted, pending records. Do not add admin write/read operations to this public API.

## Before production

- Fill the Districts tab with the verified district slugs/names used by the existing website.
- Validate image/map URLs and content before publication.
- Add abuse protection (for example server-side throttling and CAPTCHA where appropriate) before enabling public writes.
- Implement and test authenticated moderation; never rely on a hidden admin button as authorization.
- Add a server-side proxy if CORS requires it.
- Verify login/signup, session persistence, suggestions, reviews, analytics, district search, and Arya AI.
- Switch production only after acceptance tests pass and a rollback path is documented.
