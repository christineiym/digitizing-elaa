class Classroom {
  constructor(spreadsheetURL, formURL, formResponsesID, reportsSheetID, students) {
    this.spreadsheetURL = spreadsheetURL;
    this.formURL = formURL;
    this.formResponsesID = formResponsesID;
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

  generateReports(students, startDate, endDate, numExamples) {
    // TODO
    // 1) Actually generate reports
    // 2) Add links in a new column to class spreadsheet
    // return link to reports? need folder?
    // or put spreadsheet link in confirmation message
  }
}