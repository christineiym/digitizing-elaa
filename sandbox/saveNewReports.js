// based on https://stackoverflow.com/questions/55139731/append-columns-in-google-script 
function saveNewReports(reportList) {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheets()[1];
    // TODO: fix, finish (account for names, use reportSheet id?)
    // timestamp?
  
    sheet.insertColumnAfter(sheet.getMaxColumns());
    sheet.getRange(1,sheet.getLastColumn(),2).setValues(reportList);
    return;
  }