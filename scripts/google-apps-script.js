const SCRIPT_VERSION = "1.0";

function doGet(e) {
  try {
    const lock = LockService.getScriptLock();
    lock.tryLock(10000);

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName('Archive');
    
    if (!sheet) {
      sheet = setupSheet(ss);
    }

    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const rows = data.slice(1);

    const action = e.parameter.action || "entries";
    
    if (action === "stats") {
      // Just return count
      return respondSuccess({
        totalEntries: rows.length
      });
    }

    // Format all entries
    const entries = rows.map(row => {
      let entry = {};
      headers.forEach((header, i) => {
        entry[header] = row[i];
      });
      return entry;
    });

    return respondSuccess({
      entries: entries.reverse() // Newest first
    });

  } catch (error) {
    return respondError(error);
  }
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName('Archive');
    
    if (!sheet) {
      sheet = setupSheet(ss);
    }

    let payload;
    try {
      payload = JSON.parse(e.postData.contents);
    } catch(err) {
      return respondError("Invalid JSON payload");
    }

    const { song, artist, movie, year, link } = payload;
    
    if (!song || !artist || !movie) {
        return respondError("Missing required fields");
    }

    // Generate ID
    const newId = Utilities.getUuid();
    // Current date
    const dateAdded = new Date().toISOString();

    const rowData = [
      newId,
      song,
      artist,
      movie,
      year || "",
      link || "",
      dateAdded
    ];

    sheet.appendRow(rowData);

    return respondSuccess({
      message: "Entry added successfully",
      id: newId
    });

  } catch (error) {
    return respondError(error);
  } finally {
    lock.releaseLock();
  }
}

function setupSheet(ss) {
  const sheet = ss.insertSheet('Archive');
  const headers = ["id", "song", "artist", "movie", "year", "link", "dateAdded"];
  sheet.appendRow(headers);
  // Optional: Make headers bold
  sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
  return sheet;
}

function respondSuccess(data) {
  return ContentService.createTextOutput(JSON.stringify({ status: "success", data }))
    .setMimeType(ContentService.MimeType.JSON);
}

function respondError(error) {
  return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
    .setMimeType(ContentService.MimeType.JSON);
}
