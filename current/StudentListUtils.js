/**
 * Callback for adding a student.
 * 
 * @param {Object} e The event object, documented {@link
 *  https://developers.google.com/gmail/add-ons/concepts/actions#action_event_objects
 *  here}.
 * @return {CardService.ActionResponse} The action response to apply.
 */
function onAddStudent(e) {
  Logger.log("adding student...");
  Logger.log(e);
  // Determine the class that is being added to.
  const currentClassName = e.commonEventObject.parameters.className;

  // Save progress on students being added.
  var currentProgress = e.commonEventObject.formInputs;
  Logger.log(currentProgress);
  var updated = {};
  if (currentProgress === null || currentProgress === undefined) {
    Logger.log("No placeholders are present.");
    // Logger.log(DEFAULT_PLACEHOLDER);
  } else {
    Logger.log("One or more placeholders are present.");
    var existingPlaceholders = Object.keys(currentProgress);
    for (let i = 0; i < existingPlaceholders.length; i++) {
      let currentPlaceholder = existingPlaceholders[i];
      updated[currentPlaceholder] = currentProgress[currentPlaceholder].stringInputs.value[0];
    }
  }
  Logger.log(updated);

  // Add placeholder to the card's collection of placeholders.
  var numPlaceholders = Object.keys(updated).length;
  var propertyName = NEW_STUDENT_PLACEHOLDER + numPlaceholders.toString();
  updated[propertyName] = NEW_STUDENT_PLACEHOLDER + (numPlaceholders + 1).toString();
  Logger.log("Number of placeholders: " + numPlaceholders.toString());
  Logger.log("Property name: " + propertyName);
  Logger.log(updated);

  // Re-render the student list card.
  var card = createManageStudentListCard(currentClassName, updated);
  var navigation = CardService.newNavigation()
    .updateCard(card);
  var actionResponse = CardService.newActionResponseBuilder()
    .setNavigation(navigation);
  return actionResponse.build();
}


/**
 * Callback for deleting a student.
 * 
 * @param {Object} e The event object, documented {@link
 *  https://developers.google.com/gmail/add-ons/concepts/actions#action_event_objects
 *  here}.
 * @return {CardService.ActionResponse} The action response to apply.
 */
function onDeleteStudent(e) {
  Logger.log("deleting student...");

  // Determine which student to delete from which class.
  const currentClassName = e.commonEventObject.parameters.className;
  const studentNameToDelete = e.commonEventObject.parameters.studentName;

  // Obtain information on students who are currently part of the class.
  var classes = PropertiesService.getUserProperties()
  var currentClassInfo = JSON.parse(classes.getProperty(currentClassName));
  var studentList = currentClassInfo.students;
  Logger.log(studentList.toString());

  // Delete selected placeholder, if necessary.
  var updated = {};
  var currentProgress = e.commonEventObject.formInputs;
  if (currentProgress === null || currentProgress === undefined) {
    Logger.log("(This should not happen.) No placeholders were present.");
  } else {
    Logger.log("One or more placeholders are present.");
    var existingPlaceholders = Object.keys(currentProgress);
    for (let i = 0; i < existingPlaceholders.length; i++) {
      let currentPlaceholder = existingPlaceholders[i];
      if (currentPlaceholder != studentNameToDelete) {
        let currentLengthUpdated = Object.keys(updated).length;
        updated[NEW_STUDENT_PLACEHOLDER + currentLengthUpdated.toString()] = currentProgress[currentPlaceholder].stringInputs.value[0];
      }
    }
  }
  Logger.log(updated);

  // Remove selected student from current class list, if necessary.
  const index = studentList.indexOf(studentNameToDelete);
  if (index > -1) { // Current student is being deleted
    currentClassInfo.students.splice(index, 1);
    Logger.log(currentClassInfo.students.toString());
    PropertiesService.getUserProperties().setProperty(currentClassName, JSON.stringify(currentClassInfo));
  }

  // Re-render the student list card.
  var card = createManageStudentListCard(currentClassName, updated);
  var navigation = CardService.newNavigation()
    .updateCard(card);
  var actionResponse = CardService.newActionResponseBuilder()
    .setNavigation(navigation);
  return actionResponse.build();
}


/**
 * Callback for saving student list edits.
 * 
 * @param {Object} e The event object, documented {@link
 *  https://developers.google.com/gmail/add-ons/concepts/actions#action_event_objects
 *  here}.
 * @return {CardService.ActionResponse} The action response to apply.
 */
function onSaveStudentListEdits(e) {
  Logger.log("saving...");
  Logger.log(e);
  // Determine which class is being edited.
  const currentClassName = e.commonEventObject.parameters.className;

  // Obtain past names.
  var classes = PropertiesService.getUserProperties();
  var currentClassInfo = JSON.parse(classes.getProperty(currentClassName));
  var pastClassNames = currentClassInfo.students;
  var newNames = [...pastClassNames];

  // Obtain names being added.
  var toAdd = e.commonEventObject.formInputs;
  Logger.log(toAdd);
  if (toAdd === null || toAdd === undefined) {
    Logger.log("No names are being added.");
  } else {
    Logger.log("One or more placeholders are present.");
    var existingPlaceholders = Object.keys(toAdd);
    for (let i = 0; i < existingPlaceholders.length; i++) {
      let currentPlaceholder = existingPlaceholders[i];
      let student = toAdd[currentPlaceholder].stringInputs.value[0];
      Logger.log("being added: " + student);
      if (!newNames.includes(student)) {
        newNames.push(student);
      } else {
        // Display message?
      }
    }
  }

  Logger.log(newNames);
  Logger.log("Removing duplicates.");
  newNames = [...new Set(newNames)];
  Logger.log(newNames);

  // Save finalized names to internal data.
  currentClassInfo.students = newNames;
  PropertiesService.getUserProperties().setProperty(currentClassName, JSON.stringify(currentClassInfo));

  // Update list of students on the appropriate form.
  updateFormStudentList(currentClassName);

  // Return to class list card.
  var navigation = CardService.newNavigation()
    .popCard();
  var actionResponse = CardService.newActionResponseBuilder()
    .setNavigation(navigation);
  return actionResponse.build();
}