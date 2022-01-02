/** Update placeholder data and refresh card. */
function onAddStudent(e) {
    // Save progress on students being added.
    var currentProgress = e.commonEventObject.formInputs;
    Logger.log(currentProgress);

    // TODO: account for if null

    // Add placeholder to the card's collection of placeholders.
    var numPlaceholders = Object.keys(currentProgress).length;
    var updated = {
        ...currentProgress
    };
    updated[NEW_STUDENT_PLACEHOLDER + str(numPlaceholders)] = "";

    // Re-render the student list card.
    var card = createManageStudentListCard(className, updated);
    var navigation = CardService.newNavigation()
        .updateCard(card);
    var actionResponse = CardService.newActionResponseBuilder()
        .setNavigation(navigation);
    return actionResponse.build();
}

/** Update placeholder data and refresh card. */
function onDeleteStudent(e) {
    // Determine which student to delete from which class.
    const currentClassName = e.commonEventObject.parameters.className;
    const studentNameToDelete = e.commonEventObject.parameters.studentName;

    // Save progress on students being added.
    var currentProgress = e.commonEventObject.formInputs;
    Logger.log(currentProgress);

    // Obtain information on students who are currently part of the class.
    var currentClassInfo = JSON.parse(classesUpdated.getProperty(currentClassName));
    var studentList = currentClassInfo.students;
    Logger.log(studentList.toString());

    // Delete selected placeholder, if necessary.
    var updated = {};
    var currentPlaceholders = Object.keys(currentProgress);
    for (let i = 0; i < currentPlaceholders.length; i++) {
        var currentPlaceholder = currentPlaceholders[i];
        if (currentPlaceholder != studentNameToDelete) {
            updated[NEW_STUDENT_PLACEHOLDER + str(updated.length)] = currentProgress[currentPlaceholders[i]];
        }
    }
    Logger.log(updated.toString());

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

/** Update form. */
function onSaveStudentListEdits(e) {
    // Determine which class is being edited.
    const currentClassName = e.commonEventObject.parameters.className;

    // Obtain past names.
    var classInfo = JSON.parse(classesUpdated.getProperty(currentClassName));
    var pastClassNames = classInfo.students;
    var newNames = [...pastClassNames];

    // Obtain names being added.
    var toAdd = e.commonEventObject.formInputs.values();
    for (let i = 0; i < toAdd.length; i++) {
        newNames.push(toAdd[i]);
    }

    // Save finalized names to internal data.
    classInfo.students = newNames;
    PropertiesService.getUserProperties().setProperty(currentClassName, JSON.stringify(classInfo));

    // Update list of students on the appropriate form.
    updateFormStudentList(currentClassName);

    // Return to class list card.
    var navigation = CardService.newNavigation()
        .popCard();
    var actionResponse = CardService.newActionResponseBuilder()
        .setNavigation(navigation);
    return actionResponse.build();
}