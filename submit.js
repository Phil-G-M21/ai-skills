// Sends form data to Google Sheet via GET request (no CORS issues)
function sendToSheet(data, onDone) {
  var url = window.SHEET_URL;
  if (!url || url === "PASTE_YOUR_URL_HERE") {
    console.warn("No SHEET_URL set in config.js");
    if (onDone) onDone();
    return;
  }

  // Build query string
  data.timestamp = new Date().toLocaleString();
  data.page = location.href;
  var params = Object.keys(data).map(function(k) {
    return encodeURIComponent(k) + "=" + encodeURIComponent(data[k] || "");
  }).join("&");

  // Use an Image request - works cross-origin, no CORS block, no preflight
  var img = new Image();
  img.src = url + "?" + params;
  img.onload = img.onerror = function() {
    if (onDone) onDone();
  };
  // Fallback timeout
  setTimeout(function() { if (onDone) onDone(); }, 3000);
}
