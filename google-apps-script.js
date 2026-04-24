// ============================================================
// MIGERA — Google Apps Script
// Handles form submissions from migeralb.com
// Records leads to Google Sheets
// Sends notification to MIGERA team
// Sends automated reply to client with Calendly booking link
// ============================================================
//
// SETUP:
// 1. Replace SPREADSHEET_ID below with your actual Sheet ID
// 2. Deploy as Web App (Execute as: Me, Access: Anyone)
// 3. Paste the Web App URL into script.js on line 8
//
// ============================================================

const SPREADSHEET_ID = '1hrw-kPKmaDCzRXUaLocG4tG0UWAl0FQ8JO0PD_r_x_s';
// Found in your Google Sheet URL:
// https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit

const MIGERA_NOTIFY_EMAIL = 'info@migeralb.com';
const CALENDLY_LINK = 'https://calendly.com/migeralb/30min';

// ── Sheet column headers ──
const SHEET_HEADERS = {
  Consulting:   ['Timestamp', 'Name', 'Email', 'Phone', 'Business Type', 'Message', 'Source'],
  RealEstate:   ['Timestamp', 'Name', 'Email', 'Phone', 'Nationality', 'Budget (USD)', 'Purpose', 'Location Preference', 'Message', 'Source'],
  Franchise:    ['Timestamp', 'Name', 'Email', 'Phone', 'Proposed Location', 'Brand Interest', 'Available Investment', 'Message', 'Source'],
  MeetupOrders: ['Timestamp', 'Name', 'Email', 'Phone', 'Country', 'Delivery Address', 'Order Summary', 'Total', 'Notes'],
  ShopNotify:   ['Timestamp', 'Email'],
};

const FIELD_MAP = {
  Consulting:   ['timestamp', 'name', 'email', 'phone', 'business_type', 'message', 'source_url'],
  RealEstate:   ['timestamp', 'name', 'email', 'phone', 'nationality', 'budget', 'purpose', 'investment_purpose', 'message', 'source_url'],
  Franchise:    ['timestamp', 'name', 'email', 'phone', 'country', 'franchise_type', 'investment', 'message', 'source_url'],
  MeetupOrders: ['timestamp', 'name', 'email', 'phone', 'country', 'address', 'order_summary', 'total', 'notes'],
  ShopNotify:   ['timestamp', 'email'],
};

// ============================================================
// MAIN HANDLER
// ============================================================

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheetName = data.sheet || 'General';

    // 1. Save to Google Sheets
    saveToSheet(sheetName, data);

    // 2. Notify MIGERA team
    notifyTeam(sheetName, data);

    // 3. Send automated reply to client
    if (data.email && sheetName !== 'ShopNotify' && sheetName !== 'MeetupOrders') {
      sendClientReply(sheetName, data);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    Logger.log('Error: ' + err.message);
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'MIGERA API active' }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================================
// SAVE TO GOOGLE SHEETS
// ============================================================

function saveToSheet(sheetName, data) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    const headers = SHEET_HEADERS[sheetName] || Object.keys(data);
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length)
      .setBackground('#F2980D')
      .setFontColor('#ffffff')
      .setFontWeight('bold');
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1, 160);
    sheet.setColumnWidth(3, 200);
  }

  const fieldMap = FIELD_MAP[sheetName];
  const row = fieldMap
    ? fieldMap.map(key => data[key] || '')
    : Object.values(data);

  sheet.appendRow(row);
}

// ============================================================
// NOTIFY MIGERA TEAM
// ============================================================

function notifyTeam(sheetName, data) {
  const subjects = {
    Consulting:   'New Consulting Enquiry — ' + (data.name || 'Unknown'),
    RealEstate:   'New Property Enquiry — ' + (data.name || 'Unknown'),
    Franchise:    'New Franchise Enquiry — ' + (data.name || 'Unknown'),
    MeetupOrders: 'New Meetup Order — ' + (data.name || 'Unknown'),
    ShopNotify:   'New Shop Waitlist Signup — ' + (data.email || ''),
  };

  const subject = subjects[sheetName] || 'New enquiry from migeralb.com';

  const details = Object.entries(data)
    .filter(([k]) => !['sheet', 'source_url', 'timestamp'].includes(k))
    .map(([k, v]) => `<tr><td style="padding:6px 12px;color:#9C8A76;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:1px;white-space:nowrap">${k.replace(/_/g, ' ')}</td><td style="padding:6px 12px;color:#1C1C1C;font-size:14px">${v || '-'}</td></tr>`)
    .join('');

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
      <div style="background:#0a0a0a;padding:24px 32px;text-align:center">
        <p style="color:#F2980D;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:0 0 8px">MIGERA · migeralb.com</p>
        <h2 style="color:#ffffff;font-size:22px;margin:0;font-weight:300">${subject}</h2>
      </div>
      <div style="background:#ffffff;padding:32px">
        <table style="width:100%;border-collapse:collapse">
          ${details}
        </table>
        <div style="margin-top:24px;padding-top:20px;border-top:1px solid #f0ebe4;text-align:center">
          <p style="color:#9C8A76;font-size:13px;margin:0 0 12px">View all leads in your Google Sheet</p>
          <p style="color:#9C8A76;font-size:12px;margin:0">Submitted: ${new Date().toLocaleString('en-GB', { timeZone: 'Asia/Beirut' })} (Beirut time)</p>
        </div>
      </div>
      <div style="background:#f8f5f1;padding:16px;text-align:center">
        <p style="color:#bbb;font-size:11px;margin:0">MIGERA · info@migeralb.com · migeralb.com</p>
      </div>
    </div>
  `;

  try {
    MailApp.sendEmail({
      to: MIGERA_NOTIFY_EMAIL,
      subject: subject,
      htmlBody: html,
    });
  } catch(err) {
    Logger.log('Team notification failed: ' + err.message);
  }
}

// ============================================================
// AUTOMATED CLIENT REPLY WITH CALENDLY LINK
// ============================================================

function sendClientReply(sheetName, data) {
  const clientName = (data.name || 'there').split(' ')[0];
  const clientEmail = data.email;

  const configs = {
    Consulting: {
      subject: 'Thank you for your enquiry — MIGERA Consulting',
      intro: 'Thank you for getting in touch with us. We have received your consulting enquiry and one of our team will review it shortly.',
      body: `We work with restaurants, cafés, hotels, and businesses of all sizes across Lebanon and the wider region. Whether you are starting something new or looking to improve an existing operation, we are here to help.`,
      cta: 'In the meantime, if you would like to arrange a call at a time that suits you, you are welcome to book directly using the link below.',
      ctaLabel: 'Book a Call with MIGERA',
    },
    RealEstate: {
      subject: 'Thank you for your property enquiry — MIGERA',
      intro: 'Thank you for your interest in property investment in Georgia. We have received your enquiry and our property team will be in touch shortly.',
      body: `As an authorised broker for York Towers, we work with Lebanese and Arab investors to guide them through the full purchase process in Tbilisi and Batumi. We will review your requirements and come back to you with options that suit your budget and objectives.`,
      cta: 'If you would prefer to speak with someone directly, you are welcome to book a call at a time that suits you.',
      ctaLabel: 'Book a Property Consultation',
    },
    Franchise: {
      subject: 'Thank you for your franchise enquiry — Meetup Coffee Shop',
      intro: 'Thank you for your interest in the Meetup Coffee Shop franchise. We have received your application and will review it carefully.',
      body: `We take each franchise enquiry seriously and assess every applicant individually. Our team will review the details you have provided and come back to you within 48 hours with next steps.`,
      cta: 'If you have any immediate questions or would like to speak with someone before we come back to you, feel free to book a call.',
      ctaLabel: 'Book a Franchise Call',
    },
  };

  const config = configs[sheetName];
  if (!config) return;

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">

      <!-- Header -->
      <div style="background:#0a0a0a;padding:32px;text-align:center">
        <p style="color:#F2980D;font-size:10px;letter-spacing:3px;text-transform:uppercase;margin:0 0 6px">MIGERA · Caring Partners</p>
        <p style="color:rgba(255,255,255,0.4);font-size:11px;margin:0;letter-spacing:1px">migeralb.com</p>
      </div>

      <!-- Body -->
      <div style="background:#ffffff;padding:40px 36px">
        <p style="color:#1C1C1C;font-size:16px;margin:0 0 20px">Dear ${clientName},</p>

        <p style="color:#4a453e;font-size:15px;line-height:1.7;margin:0 0 16px">${config.intro}</p>
        <p style="color:#4a453e;font-size:15px;line-height:1.7;margin:0 0 28px">${config.body}</p>

        <!-- Divider -->
        <div style="border-top:1px solid #f0ebe4;margin:0 0 28px"></div>

        <p style="color:#4a453e;font-size:15px;line-height:1.7;margin:0 0 24px">${config.cta}</p>

        <!-- Calendly Button -->
        <div style="text-align:center;margin:0 0 32px">
          <a href="${CALENDLY_LINK}"
             style="display:inline-block;background:#F2980D;color:#ffffff;text-decoration:none;padding:14px 36px;font-size:13px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase">
            ${config.ctaLabel}
          </a>
        </div>

        <div style="border-top:1px solid #f0ebe4;padding-top:24px">
          <p style="color:#9C8A76;font-size:13px;line-height:1.7;margin:0">
            Alternatively, you can reach us directly:<br>
            <strong style="color:#1C1C1C">Lebanon:</strong> (+961) 76 460846<br>
            <strong style="color:#1C1C1C">Saudi Arabia:</strong> +966 569 522 777<br>
            <strong style="color:#1C1C1C">Email:</strong> info@migeralb.com
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div style="background:#0a0a0a;padding:24px;text-align:center">
        <p style="color:rgba(255,255,255,0.3);font-size:11px;margin:0 0 4px">MIGERA · Caring Partners</p>
        <p style="color:rgba(255,255,255,0.2);font-size:11px;margin:0">
          <a href="https://migeralb.com" style="color:rgba(255,255,255,0.3);text-decoration:none">migeralb.com</a>
          &nbsp;·&nbsp;
          <a href="mailto:info@migeralb.com" style="color:rgba(255,255,255,0.3);text-decoration:none">info@migeralb.com</a>
        </p>
      </div>

    </div>
  `;

  try {
    MailApp.sendEmail({
      to: clientEmail,
      subject: config.subject,
      htmlBody: html,
      replyTo: MIGERA_NOTIFY_EMAIL,
      name: 'MIGERA',
    });
  } catch(err) {
    Logger.log('Client reply failed: ' + err.message);
  }
}
