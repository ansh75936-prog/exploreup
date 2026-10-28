/**
 * ExploreUP: minimal auth event logger.
 * This is an audit/logging sink only. Supabase remains the identity provider.
 * Never accept or store passwords, OTPs, access tokens, or refresh tokens here.
 *
 * Setup:
 * - Create a private spreadsheet and a tab named User_Log.
 * - Row 1 headers: user_id,email,full_name,event_type,occurred_at
 * - Set Script Property SPREADSHEET_ID to the spreadsheet ID.
 * - Deploy as Web App (execute as owner). Keep the spreadsheet private.
 */
function doPost(e) {
  try {
    var raw = e && e.postData && e.postData.contents ? e.postData.contents : '{}';
    if (raw.length > 3000) return json_({ ok: false, error: 'payload_too_large' });
    var data = JSON.parse(raw);
    var eventType = String(data.event_type || '');
    if (['signup', 'login'].indexOf(eventType) === -1) {
      return json_({ ok: false, error: 'invalid_event' });
    }

    var userId = clean_(data.user_id, 120);
    var email = clean_(data.email, 254).toLowerCase();
    var fullName = clean_(data.full_name, 100);
    if (!userId || !email || email.indexOf('@') < 1) {
      return json_({ ok: false, error: 'missing_user_fields' });
    }

    var id = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
    if (!id) throw new Error('Missing SPREADSHEET_ID');
    var sheet = SpreadsheetApp.openById(id).getSheetByName('User_Log');
    if (!sheet) throw new Error('Missing User_Log tab');

    // Prevent spreadsheet formula injection in user-controlled values.
    userId = safeCell_(userId);
    email = safeCell_(email);
    fullName = safeCell_(fullName);

    var lock = LockService.getScriptLock();
    lock.waitLock(5000);
    try {
      sheet.appendRow([userId, email, fullName, eventType, new Date().toISOString()]);
    } finally {
      lock.releaseLock();
    }
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: 'logging_unavailable' });
  }
}

function clean_(value, max) {
  return String(value == null ? '' : value).replace(/[\u0000-\u001F\u007F]/g, '').trim().slice(0, max);
}
function safeCell_(value) {
  return /^[=+@\-]/.test(value) ? "'" + value : value;
}
function json_(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
