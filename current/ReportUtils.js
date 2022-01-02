function onSelectStudentsForReports(e) {
    const currentClassName = e.commonEventObject.parameters.className;
    selectedStudents = e.commonEventObject.formInputs.STUDENT_LIST_SELECTIONS_FIELD_NAME.stringInputs.value;

    var card = createCustomizeReportsCard(currentClassName, selectedStudents);
    var navigation = CardService.newNavigation()
        .pushCard(card);
    var actionResponse = CardService.newActionResponseBuilder()
        .setNavigation(navigation);
    return actionResponse.build();
}

function onReportGeneration(e) {
    // Obtain information on class, selected students, start date, and end date from the event object.
    const currentClassName = e.commonEventObject.parameters.className;
    const currentSelectedStudents = e.commonEventObject.parameters.selectedStudents;
    const startDate = e.commonEventObject.formInputs.START_DATE_FIELD_NAME.dateInput;
    const endDate = e.commonEventObject.formInputs.END_DATE_FIELD_NAME.dateInput;

    for (student in currentSelectedStudents) {
        // possible improvement: put generated documents in a dedicated folder
        var reportLink = generateDocument(currentClassName, student);
    }

    // TODO
    // Add links in a new column to class spreadsheet
    // and put spreadsheet link in confirmation message
}

/**
 * Creates a report document for a student.
 * 
 * @return {string? URL?} Link to the document.
 */
function generateDocument(className, studentName) {
    // template: https://docs.google.com/presentation/d/1wkhvDVxYot6SKQ_5_EZJjIvtz0NgbTOW/edit?usp=sharing&ouid=100938278621304337607&rtpof=true&sd=true // TODO: change to the document on this account
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