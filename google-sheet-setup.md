# RSVP → Google Sheet setup

## 1. Prepare the sheet
In your sheet, name the first tab `RSVP` and put these headers in row 1:

```
A: time    B: name    C: choice    D: count
```

## 2. Add the script
Sheet menu → **Extensions → Apps Script**, delete what's there, paste:

```javascript
const SHEET_NAME = 'RSVP';

function doGet() {
  const sh = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
  const rows = sh.getDataRange().getValues().slice(1);
  const out = rows.map(r => ({ name: r[1], choice: r[2], count: Number(r[3]) || 0 })).reverse();
  return ContentService.createTextOutput(JSON.stringify(out))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const d = JSON.parse(e.postData.contents);
  SpreadsheetApp.getActive().getSheetByName(SHEET_NAME)
    .appendRow([new Date(), d.name || '', d.choice || '', d.count || 0]);
  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## 3. Deploy
**Deploy → New deployment → type: Web app**
- Execute as: **Me**
- Who has access: **Anyone**

Copy the Web app URL (ends in `/exec`) and send it to me — I'll paste it into the invite
(`const SHEET_URL = ""` at the top of the logic).

## 4. GitHub Pages
After the URL is in, I'll bundle the site (HTML + images) so you can drop it in your repo
and turn on Pages. Every RSVP then appends a row to the sheet, and the guest list on the
page reads from it.
