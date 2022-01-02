/** Update placeholder data and refresh card. */
function onAddStudent(e, className) {
    // Save progress on students being added.
    var currentProgress = e.commonEventObject.formInputs;
    Logger.log(currentProgress);

    // Add placeholder to the card's collection of placeholders.
    var numPlaceholders = currentProgress.keys().length;
    var updated = {
        ...currentProgress
    };
    updated[NEW_STUDENT_PLACEHOLDER + str(numPlaceholders)] = "";

    // Re-render the student list card.
    createManageStudentListCard(className, updated);
}

/** Update placeholder data and refresh card. */
function onDeleteStudent(e, className, studentName) {
    // Save progress on students being added.
    var currentProgress = e.commonEventObject.formInputs;
    Logger.log(currentProgress);

    // Obtain information on students who are currently part of the class.
    var currentClassInfo = JSON.parse(classesUpdated.getProperty(className));
    var studentList = currentClassInfo.students;
    Logger.log(studentList.toString());

    // Delete selected placeholder, if necessary.
    var updated = {};
    var currentPlaceholders = currentProgress.keys();
    for (let i = 0; i < currentPlaceholders.length; i++) {
        var currentPlaceholder = currentPlaceholders[i];
        if (currentPlaceholder != studentName) {
            updated[NEW_STUDENT_PLACEHOLDER + str(updated.length)] = currentProgress[currentPlaceholders[i]];
        }
    }
    Logger.log(updated.toString());

    // Remove selected student from current class list, if necessary.
    const index = studentList.indexOf(studentName);
    if (index > -1) { // Current student is being deleted
        currentClassInfo.students.splice(index, 1);
        Logger.log(currentClassInfo.students.toString());
        PropertiesService.getUserProperties().setProperty(className, JSON.stringify(currentClassInfo));
    }

    // Re-render the student list card.
    createManageStudentListCard(className, updated);
}

/** Update form. */
function onSaveStudentListEdits(e, className) {
    // Obtain past names.
    var classInfo = JSON.parse(classesUpdated.getProperty(className));
    var pastClassNames = classInfo.students;
    var newNames = [...pastClassNames];

    // Obtain names being added.
    var toAdd = e.commonEventObject.formInputs.values();
    for (let i = 0; i < toAdd.length; i++) {
        newNames.push(toAdd[i]);
    }

    // Save finalized names to internal data.
    classInfo.students = newNames;
    PropertiesService.getUserProperties().setProperty(className, JSON.stringify(classInfo));

    // Update list of students on the appropriate form.
    updateFormStudentList(className);

    // Return to class list card.
    createClassManagerCard();
}