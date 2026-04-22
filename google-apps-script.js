// ============================================================
// MIGERA Google Sheets Lead Capture — Apps Script
// Paste this into script.google.com and deploy as Web App
// Connected to migeralb@gmail.com Google Drive
// ============================================================
//
// SHEET TABS HANDLED:
//   Consulting    → F&B / startup consulting enquiries
//   RealEstate    → York Towers property leads
//   Franchise     → Franchise request forms
//   MeetupOrders  → Online shop orders from meetup.html
//   ShopNotify    → Email waitlist for shop.html
//
// ============================================================

const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
// Replace with your actual Google Sheet ID from the URL:
// https://docs.google.com/spreadsheets/d/YOUR_SPREADSHEET_ID_HERE/edit

const SHEET_HEADERS = {
  Consulting:   ['Timestamp', 'Name', 'Email', 'Phone', 'Business Type', 'Message', 'Source URL'],
  RealEstate:   ['Timestamp', 'Name', 'Email', 'Phone', 'Nationality', 'Budget', 'Purpose', 'Message', 'Source URL'],
  Franchise:    ['Timestamp', 'Name', 'Email', 'Phone', 'Country', 'Franchise Type', 'Investment', 'Message', 'Source URL'],
  MeetupOrders: ['Timestamp', 'Name', 'Email', 'Phone', 'Country', 'Address', 'Order Summary', 'Total', 'Notes'],
  ShopNotify:   ['Timestamp', 'Email'],
};

const FIELD_MAP = {
  Consulting:   ['timestamp', 'name', 'email', 'phone', 'business_type', 'message', 'source_url'],
  RealEstate:   ['timestamp', 'name', 'email', 'phone', 'nationality', 'budget', 'purpose', 'message', 'source_url'],
  Franchise:    ['timestamp', 'name', 'email', 'phone', 'country', 'franchise_type', 'investment', 'message', 'source_url'],
  MeetupOrders: ['timestamp', 'name', 'email', 'phone', 'country', 'address', 'order_summary', 'total', 'notes'],
  ShopNotify:   ['timestamp', 'email'],
};

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheetName = data.sheet || 'General';

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName(sheetName);

    // Create sheet + headers if it doesn't exist
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      const headers = SHEET_HEADERS[sheetName] || Object.keys(data);
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length)
        .setBackground('#C9A85C')
        .setFontColor('#ffffff')
        .setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    // Build row from field map or all data keys
    const fieldMap = FIELD_MAP[sheetName];
    let row;
    if (fieldMap) {
      row = fieldMap.map(key => data[key] || '');
    } else {
      row = Object.values(data);
    }

    sheet.appendRow(row);

    // Optional: Send email notification
    sendNotification(sheetName, data);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'MIGERA API active' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function sendNotification(sheetName, data) {
  const notifyEmail = 'info@migeralb.com'; // Change if needed
  const subjects = {
    Consulting:   '🔔 New Consulting Enquiry — MIGERA',
    RealEstate:   '🏠 New Real Estate Lead — York Towers',
    Franchise:    '🤝 New Franchise Request — MIGERA',
    MeetupOrders: '🛒 New Meetup Order',
    ShopNotify:   '📧 New Shop Waitlist Signup',
  };
  const subject = subjects[sheetName] || `New submission: ${sheetName}`;
  const body = Object.entries(data)
    .filter(([k]) => !['sheet', 'source_url'].includes(k))
    .map(([k, v]) => `${k.replace(/_/g, ' ').toUpperCase()}: ${v}`)
    .join('\n');

  try {
    MailApp.sendEmail(notifyEmail, subject, body);
  } catch(err) {
    // Email quota exceeded or other issue — log but don't fail
    Logger.log('Email failed: ' + err.message);
  }
}
