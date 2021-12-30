function onSelectStudentsForReports(e, className) {
    selectedStudents = e.commonEventObject.formInputs.STUDENT_LIST_SELECTIONS_FIELD_NAME.stringInputs.value;

    createCustomizeReportsCard(className, selectedStudents);
}

function onReportGeneration(e, className, selectedStudents) {
    // Obtain information on startDate, endDate, and numExamples from the event object.
    var startDate = e.commonEventObject.formInputs.START_DATE_FIELD_NAME.dateInput;
    var endDate = e.commonEventObject.formInputs.END_DATE_FIELD_NAME.dateInput;
    var numExamplesStr = e.commonEventObject.formInputs.MAX_EXAMPLES_FIELD_NAME.stringInputs.value[0];

    // Determine the number of examples to include.
    if (numExamplesStr === MAXIMUM) {
        numExamplesStr = getAbsoluteMaxExamples(className);
    }
    var numExamples = parseInt(numExamplesStr);

    for (student in selectedStudents) {
        // possible improvement: put generated documents in a dedicated folder
        var reportLink = generateDocument(className, student);
    }

    // TODO
    // Add links in a new column to class spreadsheet
    // and put spreadsheet link in confirmation message
}

function getAbsoluteMaxExamples(className) {
    // TODO: implement, unless there is a better way to write code
}

/**
 * Creates a report document for a student.
 * 
 * @return {string? URL?} Link to the document.
 */
function generateDocument(className, studentName) {
    // TODO: Actually generate report
}

// based on https://stackoverflow.com/questions/55139731/append-columns-in-google-script 
function saveNewReports(reportList) {
    // TODO: finish
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheets()[0];

    sheet.insertColumnAfter(sheet.getMaxColumns());
    sheet.getRange(1, sheet.getLastColumn(), 2).setValues(reportList);
}