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

function onReportGeneration(e) {  // TODO: rename?
    Logger.log(e);

    // Obtain information on class, selected students, start date, end date, and number of examples from the event object.
    let currentClassName = e.commonEventObject.parameters.className;
    let currentSelectedStudentsStr = e.commonEventObject.parameters.selectedStudents;
    let currentSelectedStudents = JSON.parse(currentSelectedStudentsStr);
    let startDate = e.commonEventObject.formInputs[START_DATE_FIELD_NAME].dateInput.msSinceEpoch;
    let endDate = e.commonEventObject.formInputs[END_DATE_FIELD_NAME].dateInput.msSinceEpoch;
    let numExamples = e.commonEventObject.formInputs[MAX_EXAMPLES_FIELD_NAME][0];

    Logger.log(currentClassName);
    Logger.log(currentSelectedStudents);
    Logger.log(startDate);
    Logger.log(endDate);
    Logger.log(numExamples);

    // Obtain report data.
    var data = retrieveData(currentClassName, currentSelectedStudents, startDate, endDate, numExamples);
    Logger.log(data);

    // Actually generate reports.
    var reportLinks = generateReports(data, startDate, endDate);
    Logger.log(reportLinks);

    // TODO: Put links in spreadsheet or in confirmation message
    // TODO: Keep from going back from confirmation page?

    var card = createCustomizeReportsCard(currentClassName, selectedStudentsStr);
    var navigation = CardService.newNavigation()
        .pushCard(card);
    var actionResponse = CardService.newActionResponseBuilder()
        .setNavigation(navigation);
    return actionResponse.build();
}

function retrieveData(currentClassName, currentSelectedStudents, startDate, endDate, numExamples) {
    // Obtain access to the spreadsheet with class data.
    var classes = PropertiesService.getUserProperties();
    Logger.log(classes);
    var currentClassInfo = JSON.parse(classes.getProperty(currentClassName));

    var ss = SpreadsheetApp.openByUrl(currentClassInfo.spreadsheetURL);
    SpreadsheetApp.setActiveSpreadsheet(ss);
    var classDataSheet = SpreadsheetApp.setActiveSheet(ss.getSheets()[0]);  // TODO: allow for reordering by using sheet id, as in https://developers.google.com/chart/interactive/docs/spreadsheets 
    var classData = classDataSheet.getDataRange();
    // var allClassData = classData.getValues();
    classData.activate();

    // Filter sheet by date  // TODO: check what dates are inclusive of
    var dateFilterCriteria = SpreadsheetApp.newFilterCriteria();
    dateFilterCriteria.whenDateAfter(startDate)
        .whenDateBefore(endDate);
    var dateFilter = classData.createFilter();
    dateFilter.setColumnFilterCriteria(TIMESTAMP_COLUMN, dateFilterCriteria);

    // Accumulate data for each scale.
    result = {};
    var scaleFilter = classData.createFilter();
    var scaleColumn = SCALE_COLUMN_START;
    while (scaleColumn <= SCALE_COLUMN_END) {
        scaleFilter.sort(scaleColumn, false);  // sort descending
        var scaleNumber = scaleColumn - SCALE_COLUMN_START + 1;
        var scaleNumberStr = scaleNumber.toString();

        // Accumulate data for each indicated student.
        var studentFilter = classData.createFilter();
        for (let i = 0; i < currentSelectedStudents.length; i++) {
            // Filter by student.
            let student = currentSelectedStudents[i];
            let studentFilterCriteria = SpreadsheetApp.newFilterCriteria();
            studentFilterCriteria.whenTextEqualTo(student);
            studentFilter.setColumnFilterCriteria(NAME_COLUMN, studentFilterCriteria);

            // Actually obtain data.
            // Limit the amount of data acquired by the number of examples request.
            let filterResult = classData.getDisplayValues();
            Logger.log(filterResult);
            let currentStudentData = [];
            let exampleNumber = 1;  // Skip the header
            while (exampleNumber <= numExamples && exampleNumber < filterResult.length) {
                currentStudentData.push(filterResult[exampleNumber]);
            }

            // Add student data to the result and clear filter.
            result[student][scaleNumberStr] = currentStudentData;
            studentFilter.removeColumnFilterCriteria(NAME_COLUMN);
        }

        // Move on to the next column.
        scaleColumn++;
    }

    return result;
}

/**
 * Create report documents for each student.
 * 
 * @return String[] Links to the reports.
 */
function generateReports(values, startDate, endDate) {
    var allReports = [];
    const students = Object.keys(values);
    const numStudents = students.length;
    const numScales = SCALE_COLUMN_END - SCALE_COLUMN_START + 1;

    // Obtain a string representation of the dates selected.
    var startDateObj = new Date(startDate);
    const startDateStr = startDateObj.toDateString();
    var endDateObj = new Date(endDate);
    const endDateStr = endDateObj.toDateString();

    // Build reports for each student.
    var templatePresentationSlides = SlidesApp.openByUrl(TEMPLATE_URL).getSlides();
    for (let i = 0; i < numStudents; i++) {
        let student = students[i].toString();
        let reportName = "Report - " + student + " - " + startDateStr + " to " + endDateStr;
        let report = SlidesApp.create(reportName);

        for (let i = 0; i < numScales; i++) {
            let currentTemplateSlide = templatePresentationSlides[i];
            let currentElements = currentTemplateSlide.getPageElements();
            let currentScaleStr = "SCALE_" + i.toString();
            Logger.log(currentElements);
            Logger.log(currentScaleStr);

            for (let rowIndex = 0; rowIndex < values[student].length; rowIndex++) {
                // Obtain access to row data.
                let row = values[student][rowIndex];

                // Append new slide to end of current report
                let currentSlide = report.appendSlide();

                // Add background information to slide.
                currentSlide.insertPageElement(TEMPLATE.BACKGROND);
                currentSlide.insertPageElement(TEMPLATE.student_name);
                currentSlide.insertPageElement(TEMPLATE.student_id);
                currentSlide.insertPageElement(TEMPLATE.student_grade);
                currentSlide.insertPageElement(TEMPLATE.date);
                // TODO: implement assessment window
                currentSlide.insertPageElement(TEMPLATE.EVIDENCE_NUMBER.START + rowIndex);

                // Add information on student performance score.
                currentSlide.insertPageElement(TEMPLATE.STUDENT_PERFORMANCE_SCORE.START - 1 + row[COLUMNS[currentScaleStr]]);

                // Add information on type of evidence data.
                // TODO: verify that multi-value columns store values as a list
                let currentDataType = String(row[COLUMNS.DATA_TYPE]).toUpperCase();
                for (let currentValueIndex = 0; currentValueIndex < row[COLUMNS.DATA_TYPE].length; currentValueIndex++) {
                    if (currentDataType == Object.keys(TEMPLATE.DATA_TYPE)[currentValueIndex]) {
                        currentSlide.insertPageElement(TEMPLATE.DATA_TYPE[currentDataType]);
                        // TODO: verify that this works
                    }
                };

                // Add information on the text title.
                currentSlide.insertPageElement(TEMPLATE.text_title);

                // Add information on text familiarity.
                switch (row[COLUMNS.FAMILIARITY]) {
                    case "Familar":
                        currentSlide.insertPageElement(TEMPLATE.FAMILIARITY.FAMILIAR);
                        break;
                    case "Unfamilar (New)":
                        currentSlide.insertPageElement(TEMPLATE.FAMILIARITY.UNFAMILIAR);
                        break;
                    default:
                        Logger.log("No information on familiarity was found.");
                }

                // Add information on text type.
                switch (row[COLUMNS.TEXT_TYPE]) {
                    case "Literature":
                        currentSlide.insertPageElement(TEMPLATE.TEXT_TYPE.LITERATURE);
                        break;
                    case "Informational":
                        currentSlide.insertPageElement(TEMPLATE.TEXT_TYPE.INFORMATIONAL);
                        break;
                    default:
                        Logger.log("No information on text type was found.");
                }

                // Add information on support level.
                switch (row[COLUMNS.SUPPORT_LEVEL]) {
                    case "Independent":
                        currentSlide.insertPageElement(TEMPLATE.SUPPORT_LEVEL.INDEPENDENT);
                        break;
                    case "Guidance/Support":
                        currentSlide.insertPageElement(TEMPLATE.SUPPORT_LEVEL.GUIDANCE_OR_SUPPORT);
                        break;
                    default:
                        Logger.log("No information on support level was found.");
                }

                // Add information on AT/AAC set up and context/scoring explanation.  
                currentSlide.insertPageElement(TEMPLATE.AT_or_AAC_set_up);
                currentSlide.insertPageElement(TEMPLATE.context_or_scoring_explanation);

                // Replace student information placeholders.
                currentSlide.replaceAllText(TEMPLATE_PLACEHOLDERS.STUDENT_NAME, row[COLUMNS.NAME]);
                currentSlide.replaceAllText(TEMPLATE_PLACEHOLDERS.STUDENT_ID, "");  // TODO
                currentSlide.replaceAllText(TEMPLATE_PLACEHOLDERS.STUDENT_GRADE, "");  // TODO

                // Replace date placeholder.  // TODO: check
                let evidenceDateObj = new Date(row[COLUMNS.TIMESTAMP]);
                let evidenceDateStr = evidenceDateObj.toDateString();
                currentSlide.replaceAllText(TEMPLATE_PLACEHOLDERS.DATE, evidenceDateStr);

                // Replace evidence-specific placeholders.
                currentSlide.replaceAllText(TEMPLATE_PLACEHOLDERS.TEXT_TITLE, row[COLUMNS.TEXT_TITLE]);
                currentSlide.replaceAllText(TEMPLATE_PLACEHOLDERS.AT_OR_AAC_SET_UP, row[COLUMNS.AT_OR_AAC_SETUP]);
                currentSlide.replaceAllText(TEMPLATE_PLACEHOLDERS.EXPLANATION, row[COLUMNS.CONTEXT] + NEW_LINE + row[COLUMNS.OTHER]);  // TODO: should Other still be included?

                // Insert a new slide with a link to the evidence.
                // TODO: determine where best to put evidence and how to handle file types.
                let currentEvidenceSlide = report.appendSlide();
                currentEvidenceSlide.insertTextBox(String(row[COLUMSN.EVIDENCE]));
            }
            allReports.push(report.getUrl());
        }
        return allReports;
    }
}