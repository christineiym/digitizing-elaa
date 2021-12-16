function onAddStudent(e, className) {
    onSaveStudentListEdits(e, false);

    var currentClassInfo = JSON.parse(classesUpdated.getProperty(className));
    Logger.log(currentClassInfo.students.toString());
    currentClassInfo.students.push(NEW_STUDENT_PLACEHOLDER);
    Logger.log(currentClassInfo.students.toString());
    PropertiesService.getUserProperties().setProperty(className, JSON.stringify(currentClassInfo));

    createManageStudentListCard(className);
}

function onDeleteStudent(e, className, studentName) {
    onSaveStudentListEdits(e, false);

    var currentClassInfo = JSON.parse(classesUpdated.getProperty(className));
    Logger.log(currentClassInfo.students.toString());
    const index = array.indexOf(studentName);
    if (index > -1) {
        currentClassInfo.students.splice(index, 1);
    }
    Logger.log(currentClassInfo.students.toString());
    PropertiesService.getUserProperties().setProperty(className, JSON.stringify(currentClassInfo));

    createManageStudentListCard(className);
}

function onSaveStudentListEdits(e, className, isLastSave) {
    var currentStudents;
    var classes = PropertiesService.getUserProperties().getProperties();
    var classInfo = JSON.parse(classesUpdated.getProperty(className));
    var pastClassNames = classInfo.students;
    var newNames = [];
    for (studentName in pastClassNames) {
        newName = e.commonEventObject.formInputs.studentName.stringInputs.value[0];
        newNames.push(newName);
    }

    if (isLastSave) {
        createHomepageCard();
    } else {
        createManageStudentListCard(className);
    }
}