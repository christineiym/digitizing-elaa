/**
 * Callback for creating a class.
 * 
 * @param {Object} e The event object, documented {@link
 *  https://developers.google.com/gmail/add-ons/concepts/actions#action_event_objects
 *  here}.
 * @return {CardService.ActionResponse} The action response to apply.
 */
function onCreateClass(e) {
  Logger.log(e);
  className = e.commonEventObject.formInputs.new_class_name_input.stringInputs.value[0];
  Logger.log(className);

  // Create new spreadsheet for the class.
  var ssNew = SpreadsheetApp.create("My Class Records: " + className);
  var first = ssNew.getSheetByName("Sheet1");
  first.setName("Notes");  // Should be 'Reports'
  // first.appendRow(['Student Name']);
  ssNew.setActiveSheet(first);

  var ssUrl = ssNew.getUrl();
  var ssReportsSheetID = ssNew.getActiveSheet().getSheetId();

  var formNew = setUpForm(ssNew);
  var formUrl = formNew.getPublishedUrl();
  var formID = formNew.getId();
  var formResponsesID = formNew.getDestinationId();

  // When the form is created, the student dropdown question will be the first dropdown.
  // Use this fact to obtain the studentListQID.
  var studentListQ = formNew.getItems(FormApp.ItemType.LIST)[ZERO];
  var studentListQID = studentListQ.getId();

  newClass = new Classroom(ssUrl, formUrl, formID, formResponsesID, studentListQID, ssReportsSheetID, STUDENT_LIST_PLACEHOLDER);
  newClassInfo = JSON.stringify(newClass);
  Logger.log(newClassInfo);
  PropertiesService.getUserProperties().setProperty(className, newClassInfo);

  // Advance to manage student list card.
  var card = createManageStudentListCard(className, new Map());
  var navigation = CardService.newNavigation()
    .pushCard(card);
  var actionResponse = CardService.newActionResponseBuilder()
    .setNavigation(navigation);
  return actionResponse.build();
}


/**
 * Callback for deleting a class.
 * 
 * @param {Object} e The event object, documented {@link
 *  https://developers.google.com/gmail/add-ons/concepts/actions#action_event_objects
 *  here}.
 * @return {CardService.ActionResponse} The action response to apply.
 */
function onDeleteClass(e) {
  const classToDelete = e.commonEventObject.parameters.className;
  Logger.log(classToDelete);
  var userProperties = PropertiesService.getUserProperties();
  logAllClassData();
  userProperties.deleteProperty(classToDelete);
  logAllClassData();

  // Refresh the card.
  var card = createClassManagerCard();
  var navigation = CardService.newNavigation()
    .updateCard(card);
  var actionResponse = CardService.newActionResponseBuilder()
    .setNavigation(navigation);
  return actionResponse.build();
}


/**
 * Callback for editing who is in a class.
 * 
 * @param {Object} e The event object, documented {@link
 *  https://developers.google.com/gmail/add-ons/concepts/actions#action_event_objects
 *  here}.
 * @return {CardService.ActionResponse} The action response to apply.
 */
function onEditClass(e) {
  const classToEdit = e.commonEventObject.parameters.className;
  var card = createManageStudentListCard(classToEdit, new Map());
  var navigation = CardService.newNavigation()
    .pushCard(card);
  var actionResponse = CardService.newActionResponseBuilder()
    .setNavigation(navigation);
  return actionResponse.build();
}