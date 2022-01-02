function objectToClassroom(raw) {
  // New object v. global variables?
  return new Classroom(raw.spreadsheetID, raw.formID, raw.formResponsesID, raw.reportsSheetID, raw.students);
}

/**
 * Callback for creating a class.
 * 
 * @return {CardService.ActionResponse} The action response to apply.
 */
function onCreateClass(e) {
  Logger.log(e);
  className = e.commonEventObject.formInputs.new_class_name_input.stringInputs.value[0];
  Logger.log(className);

  // Create new spreadsheet for the class.
  var ssNew = SpreadsheetApp.create("My Class Records: " + className);
  var first = ssNew.getSheetByName("Sheet1");
  first.setName("Reports");
  first.appendRow(['Student Name']);
  ssNew.setActiveSheet(first);

  var ssUrl = ssNew.getUrl();
  var ssReportsSheetID = ssNew.getActiveSheet().getSheetId();

  var formNew = setUpForm(ssNew, STUDENT_LIST_PLACEHOLDER);
  var formUrl = formNew.getPublishedUrl();
  var formID = formNew.getId();
  var formResponsesID = formNew.getDestinationId();

  // When the form is created, the student dropdown question will be the first dropdown.
  // Use this fact to obtain the studentListQID.
  var studentListQ = form.getItems(FormApp.ItemType.LIST)[ZERO];
  var studentListQID = studentListQ.getId();

  newClass = new Classroom(ssUrl, formUrl, formID, formResponsesID, studentListQID, ssReportsSheetID, STUDENT_LIST_PLACEHOLDER);
  newClassInfo = JSON.stringify(newClass);
  Logger.log(newClassInfo);
  PropertiesService.getUserProperties().setProperty(className, newClassInfo);

  // Complete class creation process with other functions.
  createManageStudentListCard(className, DEFAULT_PLACEHOLDER);
}

function onDeleteClass(className) {
  var userProperties = PropertiesService.getUserProperties();
  userProperties.deleteProperty(className);

  // TODO: check if should return card, or update card through a more complicated action
  return createClassManagerCard();
}

function onEditClass(className) {
  return createManageStudentListCard(className, DEFAULT_PLACEHOLDER);
}