/**
 * A special function that inserts a custom menu when the spreadsheet opens.
 */
 function onOpen() {
    var menu = [{name: 'Set up class database', functionName: 'setUpClassDatabase_'}];
    SpreadsheetApp.getActive().addMenu('Set Up Class Database', menu);
  }
  
  /**
   * A set-up function that uses the student data in the spreadsheet to create
   * a Google Form and a trigger that allows the script to react to form responses.
   */
  function setUpClassDatabase_() {
    // if (ScriptProperties.getProperty('calId')) {
    //   Browser.msgBox('Your conference is already set up. Look in Google Drive!');
    // }
    var ss = SpreadsheetApp.getActive();
    var sheet = ss.getSheetByName('Student Names');
    var range = sheet.getDataRange();
    var values = range.getValues();
    setUpForm_(ss, values);
    // ScriptApp.newTrigger('onFormSubmit').forSpreadsheet(ss).onFormSubmit()
    //     .create();
    ss.removeMenu('Set Up Class Database');
  }
  
  
  /**
   * Creates a Google Form that allows respondents to rate a certain student's work.
   *
   * @param {Spreadsheet} ss The spreadsheet that contains the conference data.
   * @param {Array<String[]>} values Cell values for the spreadsheet range.
   */
  function setUpForm_(ss, values) {
    // Create a new form, then add a checkbox question, a multiple choice question,
    // a page break, then a date question and a grid of questions.
    var form = FormApp.create('Student Information Form');
    form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());
    // var info = SpreadsheetApp.getActive().getSheetByName('All Data')
    //    .getDataRange().getValues();
    var allStudents = [];
    for (var i = 1; i < values.length; i++) {
      var student = values[i];
      allStudents.push(student);
    }
    // form.addTextItem().setTitle('Name').setRequired(true);
    // form.addTextItem().setTitle('Email').setRequired(true);
    // for (var day in schedule) {
    //   var header = form.addSectionHeaderItem().setTitle('Sessions for ' + day);
    //   for (var time in schedule[day]) {
    //     var item = form.addMultipleChoiceItem().setTitle(time + ' ' + day)
    //         .setChoiceValues(schedule[day][time]);
    var itemStudent = form.addListItem();
    itemStudent.setTitle('Student Name')
    itemStudent.setChoiceValues(allStudents);
    var itemScale1 = form.addScaleItem();
    itemScale1.setTitle('Scale 1: Reading Literature & Informational Text: Key Ideas and Details')
      .setBounds(1, 10);
    var itemScale2 = form.addScaleItem();
    itemScale2.setTitle('Scale 2: Reading Literature: Key Ideas and Details')
      .setBounds(1, 10);
    var itemScale3 = form.addScaleItem();
    itemScale3.setTitle('Scale 3: Reading Informational Text: Integration of Knowledge and Ideas')
      .setBounds(1, 10);
    var itemScale4 = form.addScaleItem();
    itemScale4.setTitle('Scale 4: Reading Foundations: Letter Identification')
      .setBounds(1, 10);
    var itemScale5 = form.addScaleItem();
    itemScale5.setTitle('Scale 5: Writing: Text Types and Purposes')
      .setBounds(1, 10);
    var itemScale6 = form.addScaleItem();
    itemScale6.setTitle('Scale 6: Language: Vocabulary Acquisition and Use')
      .setBounds(1, 10);
    
    // Logger.log('Published URL: ' + form.getPublishedUrl());
    // Logger.log('Editor URL: ' + form.getEditUrl());
  }
  
  
  /**
   * A trigger-driven function.
   *
   * @param {Object} e The event parameter for form submission to a spreadsheet;
   *     see https://developers.google.com/apps-script/understanding_events
   */
  function onFormSubmit(e) {
    var user = {name: e.namedValues['Name'][0], email: e.namedValues['Email'][0]};
  
    // Grab the session data again so that we can match it to the user's choices.
    // var response = [];
    // var values = SpreadsheetApp.getActive().getSheetByName('All_Data')
    //    .getDataRange().getValues();
    // for (var i = 1; i < values.length; i++) {
    //   var session = values[i];
    //   var title = session[0];
    //   var day = session[1].toLocaleDateString();
    //   var time = session[2].toLocaleTimeString();
    //   var timeslot = time + ' ' + day;
  
    //   // For every selection in the response, find the matching timeslot and title
    //   // in the spreadsheet and add the session data to the response array.
    //   if (e.namedValues[timeslot] && e.namedValues[timeslot] == title) {
    //     response.push(session);
    //   }
    // }
  }