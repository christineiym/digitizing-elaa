/**
 * Callback for selecting a class for on which to generate reports.
 * 
 * @param {Object} e The event object, documented {@link
 *  https://developers.google.com/gmail/add-ons/concepts/actions#action_event_objects
 *  here}.
 * @return {CardService.ActionResponse} The action response to apply.
 */
function onSelectClassForReports(e) {
  const currentClassName = e.commonEventObject.parameters.className;

  // Continue on to select students.
  var card = createSelectStudentsForReportsCard(currentClassName);
  var navigation = CardService.newNavigation()
    .pushCard(card);
  var actionResponse = CardService.newActionResponseBuilder()
    .setNavigation(navigation);
  return actionResponse.build();
}


/**
 * Callback for selecting students on which to generate reports.
 * 
 * @param {Object} e The event object, documented {@link
 *  https://developers.google.com/gmail/add-ons/concepts/actions#action_event_objects
 *  here}.
 * @return {CardService.ActionResponse} The action response to apply.
 */
function onSelectStudentsForReports(e) {
  const currentClassName = e.commonEventObject.parameters.className;
  const selectedStudents = e.commonEventObject.formInputs[STUDENT_LIST_SELECTIONS_FIELD_NAME].stringInputs.value;
  var selectedStudentsStr = JSON.stringify(selectedStudents);
  Logger.log(currentClassName);
  Logger.log(selectedStudentsStr);

  // Continue on to select more report parameters.
  var card = createCustomizeReportsCard(currentClassName, selectedStudentsStr);
  var navigation = CardService.newNavigation()
    .pushCard(card);
  var actionResponse = CardService.newActionResponseBuilder()
    .setNavigation(navigation);
  return actionResponse.build();
}


/**
 * Callback for clicking the button to generate reports.
 * 
 * @param {Object} e The event object, documented {@link
 *  https://developers.google.com/gmail/add-ons/concepts/actions#action_event_objects
 *  here}.
 * @return {CardService.ActionResponse} The action response to apply.
 */
function onReportGeneration(e) {  // TODO: rename?
  Logger.log(e);

  // Obtain information on class, selected students, start date, end date, and number of examples from the event object.
  let currentClassName = e.commonEventObject.parameters.className;
  let currentSelectedStudentsStr = e.commonEventObject.parameters.selectedStudents;
  let currentSelectedStudents = JSON.parse(currentSelectedStudentsStr);
  let startDate = e.commonEventObject.formInputs[START_DATE_FIELD_NAME].dateInput.msSinceEpoch;
  let endDate = e.commonEventObject.formInputs[END_DATE_FIELD_NAME].dateInput.msSinceEpoch;
  let numExamples = e.commonEventObject.formInputs[MAX_EXAMPLES_FIELD_NAME].stringInputs.value;

  Logger.log(currentClassName);
  Logger.log(currentSelectedStudents);
  Logger.log(startDate);
  Logger.log(endDate);
  Logger.log(numExamples);

  // Obtain report data.
  var data = retrieveData(currentClassName, currentSelectedStudents, startDate, endDate, numExamples);

  // Actually generate reports.
  var reportLinks = generateReports(data, startDate, endDate);
  Logger.log(reportLinks);

  // TODO: Put links in spreadsheet or in confirmation message
  // TODO: Keep from going back from confirmation page?

  // Continue on to confirmation message.
  var card = createReportsGeneratedCard();
  var navigation = CardService.newNavigation()
    .pushCard(card);
  var actionResponse = CardService.newActionResponseBuilder()
    .setNavigation(navigation);
  return actionResponse.build();
}


/**
 * Retrieve data on examples upon which to base the report.
 *
 * @param {String} currentClassName The name of the selected class.
 * @param {String[]} currentSelectedStudents The names of the selected students.
 * @param {String} startDate The start of the date range from which to pull examples.
 * @param {String} endDate The end of the date range from which to pull examples.
 * @param {String} numExamples The number of examples to generate for each scale for each student, if available.
 */
function retrieveData(currentClassName, currentSelectedStudents, startDate, endDate, numExamples) {
  // Obtain access to the spreadsheet with class data.
  var classes = PropertiesService.getUserProperties();
  Logger.log(classes);
  var currentClassInfo = JSON.parse(classes.getProperty(currentClassName));
  var ss = SpreadsheetApp.openByUrl(currentClassInfo.spreadsheetURL);
  SpreadsheetApp.setActiveSpreadsheet(ss);
  var classDataSheet = SpreadsheetApp.setActiveSheet(ss.getSheets()[0]);  // TODO: allow for reordering by using sheet id, as in https://developers.google.com/chart/interactive/docs/spreadsheets
  var classData = classDataSheet.getDataRange();
  var allClassData = classData.getValues();
  classData.activate();

  // Remove sheet filter, if still present in the sheet.
  var prevFilter = classData.getFilter();
  if (prevFilter != null) {
    prevFilter.remove();
  }

  // Parse input as necessary.
  var startDateObj = new Date(startDate);
  var endDateObj = new Date(endDate);
  var numExamplesInt = parseInt(numExamples);

  // Accumulate data for each scale.
  result = {};
  var filter = classData.createFilter();
  var scaleColumn = SCALE_COLUMN_START;
  while (scaleColumn <= SCALE_COLUMN_END) {
    filter.sort(scaleColumn, false);  // sort descending
    var scaleNumber = scaleColumn - SCALE_COLUMN_START + 1;
    var scaleNumberStr = scaleNumber.toString();
    var currentScaleStr = "SCALE_" + scaleNumberStr;
    // Logger.log(currentScaleStr);

    // Accumulate data for each indicated student.
    for (let i = 0; i < currentSelectedStudents.length; i++) {
      // Determine current student.
      let currentStudent = currentSelectedStudents[i];
      // Logger.log("Current student: " + currentStudent);

      // Actually obtain data.
      // Limit the amount of data acquired by the number of examples request.
      let currentStudentData = [];
      let numExamplesAccumulated = 0;
      let row = 1;  // Skip the header
      while (numExamplesAccumulated < numExamplesInt && row < allClassData.length) {
        // Exclude results outside the proper date range and for the incorrect student.
        // TODO: make more efficient
        let evidenceDate = allClassData[row][COLUMNS.TIMESTAMP];
        let evidenceDateObj = new Date(evidenceDate);
        let evidenceStudent = allClassData[row][COLUMNS.NAME];
        let evidenceScaleValue = allClassData[row][COLUMNS[currentScaleStr]];
        // Logger.log("Start date: " + startDateObj.toDateString());
        // Logger.log("End date: " + endDateObj.toDateString());
        // Logger.log("Evidence date: " + evidenceDateObj.toDateString());
        if (evidenceDateObj >= startDateObj && evidenceDateObj <= endDateObj && evidenceStudent == currentStudent && evidenceScaleValue != "") {
          // Logger.log(allClassData[row])
          currentStudentData.push(allClassData[row]);
          numExamplesAccumulated++;
        }

        // Move on to the next row.
        row++;
      }

      // Add student data to the result and clear filter on student name.
      if (!(currentStudent in result)) {
        result[currentStudent] = {};
      }
      result[currentStudent][scaleNumberStr] = currentStudentData;
    }

    // Move on to the next column.
    scaleColumn++;
  }

  // Reset sort to be by date and remove filter completely.
  filter.sort(TIMESTAMP_COLUMN, true);  // Sort ascending
  filter.remove();

  return result;
}


/**
 * Create report documents for each student.
 * 
 * @param {Object} values The student data, organized by student and then by scale.
 * @param {String} startDate The start of the date range from which to pull examples.
 * @param {String} endDate The end of the date range from which to pull examples.
 * @return {String[]} Links to the reports.
 */
function generateReports(values, startDate, endDate) {
  var allReports = [];
  const students = Object.keys(values);
  const numStudents = students.length;
  const numScales = SCALE_COLUMN_END - SCALE_COLUMN_START + 1;

  // Obtain a string representation of the dates selected.
  const startDateObj = new Date(startDate);
  const startDateStr = startDateObj.toDateString();
  const endDateObj = new Date(endDate);
  const endDateStr = endDateObj.toDateString();

  // Build reports for each student.
  var templatePresentationSlides = SlidesApp.openByUrl(TEMPLATE_URL).getSlides();
  for (let i = 0; i < numStudents; i++) {
    Logger.log(i);
    Logger.log(numStudents);
    var student = students[i].toString();
    Logger.log(student);
    var reportName = "Report - " + student + " - " + startDateStr + " to " + endDateStr;
    Logger.log(reportName);
    var report = SlidesApp.create(reportName);
    var blankTitleSlide = report.getSlides().pop();
    blankTitleSlide.remove();

    for (let scaleIndex = 1; scaleIndex <= numScales; scaleIndex++) {
      let currentTemplateSlide = templatePresentationSlides[scaleIndex];
      let currentElements = currentTemplateSlide.getPageElements();
      let currentScaleStr = "SCALE_" + scaleIndex.toString();
      let currentRows = values[student][scaleIndex.toString()];

      for (let rowIndex = 0; rowIndex < currentRows.length; rowIndex++) {
        // Obtain access to row data.
        let row = currentRows[rowIndex];

        // Append new slide to end of current report
        let currentSlide = report.appendSlide();

        // Add background information to slide.
        currentSlide.insertPageElement(currentElements[TEMPLATE.BACKGROUND]);
        currentSlide.insertPageElement(currentElements[TEMPLATE.student_name]);
        currentSlide.insertPageElement(currentElements[TEMPLATE.student_id]);
        currentSlide.insertPageElement(currentElements[TEMPLATE.student_grade]);
        currentSlide.insertPageElement(currentElements[TEMPLATE.date]);
        // TODO: implement assessment window
        currentSlide.insertPageElement(currentElements[TEMPLATE.EVIDENCE_NUMBER.START + rowIndex]);

        // Add information on student performance score.
        currentSlide.insertPageElement(currentElements[TEMPLATE.STUDENT_PERFORMANCE_SCORE.START - 1 + row[COLUMNS[currentScaleStr]]]);

        // Add information on type of evidence data.
        let currentDataType = String(row[COLUMNS.DATA_TYPE]).toUpperCase().split();
        Logger.log(currentDataType);
        for (let currentValueIndex = 0; currentValueIndex < row[COLUMNS.DATA_TYPE].length; currentValueIndex++) {
          if (currentDataType == Object.keys(TEMPLATE.DATA_TYPE)[currentValueIndex]) {
            currentSlide.insertPageElement(currentElements[TEMPLATE.DATA_TYPE[currentDataType]]);
            // TODO: verify that this works
          }
        };

        // Add information on the text title.
        currentSlide.insertPageElement(currentElements[TEMPLATE.text_title]);

        // Add information on text familiarity.
        switch (row[COLUMNS.FAMILIARITY]) {  // TODO: check missing info
          case "Familar":
            currentSlide.insertPageElement(currentElements[TEMPLATE.FAMILIARITY.FAMILIAR]);
            break;
          case "Unfamilar (New)":
            currentSlide.insertPageElement(currentElements[TEMPLATE.FAMILIARITY.UNFAMILIAR]);
            break;
          default:
            Logger.log("No information on familiarity was found.");  // TODO: remove Logging
        }

        // Add information on text type.
        switch (row[COLUMNS.TEXT_TYPE]) {
          case "Literature":
            currentSlide.insertPageElement(currentElements[TEMPLATE.TEXT_TYPE.LITERATURE]);
            break;
          case "Informational":
            currentSlide.insertPageElement(currentElements[TEMPLATE.TEXT_TYPE.INFORMATIONAL]);
            break;
          default:
            Logger.log("No information on text type was found.");
        }

        // Add information on support level.
        switch (row[COLUMNS.SUPPORT_LEVEL]) {
          case "Independent":
            currentSlide.insertPageElement(currentElements[TEMPLATE.SUPPORT_LEVEL.INDEPENDENT]);
            break;
          case "Guidance/Support":
            currentSlide.insertPageElement(currentElements[TEMPLATE.SUPPORT_LEVEL.GUIDANCE_OR_SUPPORT]);
            break;
          default:
            Logger.log("No information on support level was found.");
        }

        // Add information on AT/AAC set up and context/scoring explanation.  
        currentSlide.insertPageElement(currentElements[TEMPLATE.AT_or_AAC_set_up]);
        currentSlide.insertPageElement(currentElements[TEMPLATE.context_or_scoring_explanation]);

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
        currentEvidenceSlide.insertTextBox(String(row[COLUMNS.EVIDENCE]));
      }
    }
    allReports.push(report.getUrl());
  }
  return allReports;
}