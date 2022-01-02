class Classroom {
  constructor(spreadsheetURL, formURL, formID, formResponsesID, studentListQID, reportsSheetID, students) {
    this.spreadsheetURL = spreadsheetURL;
    this.formURL = formURL;
    this.formID = formID;
    this.formResponsesID = formResponsesID;
    this.studentListQID = studentListQID;
    this.reportsSheetID = reportsSheetID;
    this.students = students;
  }

  // set name(newName) {
  //   if (newName === null || newName == "") {
  //     // Do not change name
  //     this.name = this.name;
  //   } else {
  //     this.name = newName;
  //   }
  // }
}