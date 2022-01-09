function onSelectClassForReports(e) {
    const currentClassName = e.commonEventObject.parameters.className;

    var card = createSelectStudentsForReportsCard(currentClassName);
    var navigation = CardService.newNavigation()
        .pushCard(card);
    var actionResponse = CardService.newActionResponseBuilder()
        .setNavigation(navigation);
    return actionResponse.build();
}

function onSelectStudentsForReports(e) {
    const currentClassName = e.commonEventObject.parameters.className;
    const selectedStudents = e.commonEventObject.formInputs[STUDENT_LIST_SELECTIONS_FIELD_NAME].stringInputs.value;
    var selectedStudentsStr = JSON.stringify(selectedStudents);
    Logger.log(currentClassName);
    Logger.log(selectedStudentsStr);

    var card = createCustomizeReportsCard(currentClassName, selectedStudentsStr);
    var navigation = CardService.newNavigation()
        .pushCard(card);
    var actionResponse = CardService.newActionResponseBuilder()
        .setNavigation(navigation);
    return actionResponse.build();
}

function onReportGeneration(e) {
    Logger.log(e);

    // Obtain information on class, selected students, start date, and end date from the event object.
    const currentClassName = e.commonEventObject.parameters.className;
    const currentSelectedStudentsStr = e.commonEventObject.parameters.selectedStudents;
    const currentSelectedStudents = JSON.parse(currentSelectedStudentsStr);
    const startDate = e.commonEventObject.formInputs[START_DATE_FIELD_NAME].dateInput;
    const endDate = e.commonEventObject.formInputs[END_DATE_FIELD_NAME].dateInput;

    Logger.log(currentSelectedStudents);

    // // TODO
    // // Copy FormResponses sheet to a new sheet
    // // Filter sheet by date

    // for (student in currentSelectedStudents) {
    //   // TODO
    //   // Filter sheet by student
    //   // Sort by appropriate scale descending
    //   // for each scale, for each example, append? row to values, or just create slide directly
    //   var reportLink = generateDocument(values);
    //   // Add link in a new column to class spreadsheet
    // }

    // // TODO: put spreadsheet link in confirmation message
    return;
}

/**
 * Creates a report document for a student.
 * 
 * @return {string? URL?} Link to the document.
 */
function generateDocument(values) {
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