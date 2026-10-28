/**
 * ExploreUP Google Sheets API scaffold.
 *
 * Setup:
 * 1. Create a dedicated Google Spreadsheet with tabs documented in README.md.
 * 2. In Apps Script > Project Settings > Script Properties, set SPREADSHEET_ID.
 * 3. Deploy as a Web App; execute as the owner. Do not add admin endpoints here.
 * 4. Test in a private spreadsheet before pointing the production website at it.
 *
 * Public endpoints intentionally support only public content reads and limited
 * visitor submissions. Authentication/admin operations remain outside this API.
 */

const PUBLIC_READ_SHEETS = {
  districts: 'Districts',
  places: 'Places',
  food_stays: 'Food_Stays',
  settings: 'Settings'
};

const WRITE_SCHEETS = {
  suggestion: 'Suggestions',
  review: 'Reviews',
  analytics: 'Analytics'
};

function doGet(e) {
  const action = String((e && e.parameter && e.parameter.action) || 'health').toLowerCase();

  if (action === 'health') {
    return output_({ ok: true, service: 'ExploreUP Sheets API', version: 1 });
  }

  const tabName = PUBLIC_READ_SHEETS[action];
  if (!tabName) return output_({ ok: false, error: 'Unsupported action' });

  try {
    const rows = readRows_(tabName);
    const callback = e && e.parameter && e.parameter.callback;
    const json = JSON.stringify({ ok: true, data: rows });
    if (callback && /^[A-Za-z_$][0-9A-Za-z_$\.]{0,80}$/.test(callback)) {
      return ContentService.createTextOutput(callback + '(' + json + ');')
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
    return ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return output_({ ok: false, error: 'Unable to read data' });
  }
}

function doPost(e) {
  try {
    const body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    const action = String(body.action || '').toLowerCase();
    const tabName = WRITE_SHEETS[action];
    if (!tabName) return output_({ ok: false, error: 'Unsupported action' });

    // Reject obvious bot submissions and oversized payloads.
    if (body.website) return output_({ ok: true, accepted: true });
    if (JSON.stringify(body).length > 8000) {
      return output_({ ok: false, error: 'Submission too large' });
    }

    const lock = LockService.getScriptLock();
    lock.waitLock(5000);
    try {
      const sheet = getSheet_(tabName);
      const now = new Date().toISOString();
      const id = Utilities.getUuid();

      if (action === 'suggestion') {
        const district = clean_(body.district_slug, 80);
        const message = clean_(body.message, 1500);
        const email = clean_(body.email, 200);
        if (!district || !message) return output_({ ok: false, error: 'District and message are required' });
        sheet.appendRow([id, now, district, message, email, 'pending']);
      } else if (action === 'review') {
        const district = clean_(body.district_slug, 80);
        const rating = Number(body.rating);
        const message = clean_(body.message, 1200);
        const displayName = clean_(body.display_name, 80);
        if (!district || !Number.isInteger(rating) || rating < 1 || rating > 5 || !message) {
          return output_({ ok: false, error: 'Valid district, rating and review are required' });
        }
        sheet.appendRow([id, now, district, rating, message, displayName, 'pending']);
      } else if (action === 'analytics') {
        const eventType = clean_(body.event_type, 80);
        const district = clean_(body.district_slug, 80);
        const path = clean_(body.path, 300);
        if (!eventType) return output_({ ok: false, error: 'Event type is required' });
        sheet.appendRow([id, now, eventType, district, path]);
      }
    } finally {
      lock.releaseLock();
    }

    return output_({ ok: true, accepted: true });
  } catch (err) {
    return output_({ ok: false, error: 'Invalid request or backend unavailable' });
  }
}

function readRows_(tabName) {
  const sheet = getSheet_(tabName);
  const values = sheet.getDataRange().getDisplayValues();
  if (values.length < 2) return [];
  const headers = values[0].map(h => String(h).trim());
  return values.slice(1).filter(row => row.some(cell => cell !== '')).map(row => {
    const item = {};
    headers.forEach((header, index) => {
      if (header) item[header] = row[index] || '';
    });
    return item;
  }).filter(item => {
    // Draft and pending rows must never be exposed through public reads.
    if (tabName === 'Settings') return String(item.is_public || '').toLowerCase() === 'true';
    return String(item.status || '').toLowerCase() === 'published';
  });
}

function getSheet_(tabName) {
  const id = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  if (!id) throw new Error('Missing SPREADSHEET_ID script property');
  const book = SpreadsheetApp.openById(id);
  const sheet = book.getSheetByName(tabName);
  if (!sheet) throw new Error('Missing tab: ' + tabName);
  return sheet;
}

function clean_(value, maxLength) {
  return String(value == null ? '' : value).replace(/[<>\u0000-\u001F]/g, '').trim().slice(0, maxLength);
}

function output_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
