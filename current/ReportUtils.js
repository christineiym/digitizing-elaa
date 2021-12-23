function onSelectStudentsForReports(e, className) {
    selectedStudents = e.commonEventObject.formInputs.STUDENT_LIST_SELECTIONS_FIELD_NAME.stringInputs.value;

    createCustomizeReportsCard(className, selectedStudents);
}

function onReportGeneration(e, className, selectedStudents) {
    // TODO: actually create reports
}