class Classroom {
    constructor(spreadsheetID, formID, formResponsesID, reportsSheetID, students) {
      this.spreadsheetID = spreadsheetID;
      this.formID = formID;
      this.formResponsesID = formResponsesID;
      this.reportsSheetID = reportsSheetID;
      this.students = students;
    }
  
    set name(newName) {
      if (newName === null || newName == "") {
        // Do not change name
        this.name = this.name;
      } else {
        this.name = newName;
      }
    }
  
    addStudent() {
      // TODO
    }
  
    removeStudent() {
      // TODO
      // if records are associated with student, move to archive
      // else, delete?
      // the above is only a problem if student data are kept in spreadsheet
    }
  
    generateReports(students, startDate, endDate, numExamples) {
      // TODO
      // 1) Actually generate reports
      // 2) Add links in a new column to class spreadsheet
      // return link to reports? need folder?
      // or put spreadsheet link in confirmation message
    }
  }