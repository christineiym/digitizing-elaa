class Classroom {
    constructor(name, spreadsheet, form) {
      this.name = name;
      this.spreadsheet = spreadsheet;
      this.form = form;
    }
  
    get name() {
      return this.name;
    }
  
    get spreadsheet() {
      return this.spreadsheet;
    }
  
    get form() {
      return this.form;
    }
  
    get students() {
      // Access appropriate page in spreadsheet
      currentSpreadsheet = SpreadsheetApp.openByUrl(this.spreadsheet);
    }
  
    get rawDataSpreadsheet() {
      // TODO
      // return appropriate spreadsheet link
    }
  
    get reportsSpreadsheet() {
      // TODO
      // access appropriate spreadsheet link
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
  
    changeStudentName() {
      // TODO - later release
    }
  
    generateReports(students, startDate, endDate, numExamples) {
      // TODO
      // 1) Actually generate reports
      // 2) Add links in a new column to class spreadsheet
      // return link to reports? need folder?
      // or put spreadsheet link in confirmation message
    }
  }