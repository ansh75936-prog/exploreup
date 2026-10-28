# ExploreUP login/signup → Google Sheets log

This is intentionally limited to one task: append a row when a Supabase signup succeeds or a login succeeds. It does not replace authentication or change district data, Arya AI, or other website features.

## Spreadsheet setup

1. Create a private Google Spreadsheet named `ExploreUP User Log`.
2. Add a tab named `User_Log`.
3. Put these exact headers in row 1:
   `user_id | email | full_name | event_type | occurred_at`
4. Open **Extensions → Apps Script** and paste `Code.gs`.
5. In **Project Settings → Script properties**, add `SPREADSHEET_ID` with the spreadsheet ID from its URL.
6. Deploy as a Web App that executes as the owner. Keep the spreadsheet private. Copy the deployed `/exec` URL.

## Website integration

Do not edit production `index.html` until the Apps Script URL is deployed and tested. Add the following helper near the existing Supabase auth code, replacing the placeholder URL:

```js
const EXPLOREUP_USER_LOG_ENDPOINT = 'PASTE_DEPLOYED_APPS_SCRIPT_EXEC_URL_HERE';

function logExploreUPAuthEvent(user, eventType) {
  if (!user?.id || !user?.email || !['signup', 'login'].includes(eventType)) return;
  const payload = {
    user_id: user.id,
    email: user.email,
    full_name: user.user_metadata?.full_name || '',
    event_type: eventType
  };
  // no-cors makes the response opaque; this is best-effort logging only.
  // Never include passwords, OTPs, session tokens, or API keys.
  try {
    fetch(EXPLOREUP_USER_LOG_ENDPOINT, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      keepalive: true
    }).catch(() => {});
  } catch (_) {}
}
```

In the existing `openAuth()` submit handler, after successful signup:
- After `result = await client.auth.signUp(...)` and `if (result.error) throw result.error;`, call `logExploreUPAuthEvent(result.data?.user, 'signup');` if `result.data?.user` exists. This records signups even if email confirmation means there is no active session yet.

After successful password login:
- After `result = await client.auth.signInWithPassword(...)` and `if (result.error) throw result.error;`, call `logExploreUPAuthEvent(result.data?.user, 'login');`.

## Important limitations

- This sheet is a convenience log, not the authentication database or proof of identity. A public Apps Script endpoint can be called by outsiders; do not use these rows for security decisions or sensitive account data.
- Do not store passwords, OTPs, access/refresh tokens, or private profile fields.
- Keep the spreadsheet private. Apps Script executes as the owner.
- The frontend uses `no-cors`, so it cannot confirm whether a row was written. Verify by checking the sheet after a test signup/login.
- Supabase must be active and login must work for this to log successful events. This does not fix or bypass an inactive Supabase project.
- Production `index.html` is intentionally unchanged until the endpoint URL exists and the user-log flow can be tested.
