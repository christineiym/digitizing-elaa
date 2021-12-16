function objectToClassroom(raw) {
    // New object v. global variables?
    return new Classroom(raw.spreadsheetID, raw.formID, raw.formResponsesID, raw.reportsSheetID, raw.students);
  }
  
  /**
   * Callback for the "Create Class" button.
   * 
   * @return {CardService.ActionResponse} The action response to apply.
   */
  function onCreateClass() {
    // TODO: fix!!
  
    // Create new spreadsheet for the class.
    // TODO: populate with user input.
    var ssNew = SpreadsheetApp.create("My Class Records");
    var names = ssNew.insertSheet('Student Names');
    names.appendRow(['Roster']);
    names.appendRow(['Student1']);
    names.appendRow(['Student2']);
    names.appendRow(['Student3']);
    names.appendRow(['Student4']);
  
    // Create new form tied to spreadsheet.
    var range = names.getDataRange();
    var values = range.getValues();
    setUpForm(ssNew, values);
    
    // Store mapping of spreadsheet to form.
    var ssUrl = ssNew.getUrl();
    var formUrl = ssNew.getFormUrl();
    var userProperties = PropertiesService.getUserProperties();
    userProperties.setProperty(ssUrl, formUrl); // TODO: use input; change homepage rendering
    Logger.log(ssUrl + " : " + formUrl);
  
    // Log all current spreadsheets and forms.
    var links = PropertiesService.getUserProperties().getProperties();
    for (var key in links) {
      Logger.log('Property: ' + key + ' is mapped to ' + links[key])
    }
  
    // Refresh the card to display buttons for the new spreadsheet and form.
    var card = createClassManagerCard(isHomepage);
    var navigation = CardService.newNavigation()
        .updateCard(card);
    var actionResponse = CardService.newActionResponseBuilder()
        .setNavigation(navigation);
    return actionResponse.build();
  }
  
  /**
   * Creates a Google Form that allows respondents to rate a certain student's work.
   *
   * @param {Spreadsheet} ss The spreadsheet that contains the student data.
   * @param {Array<String[]>} values Cell values for the spreadsheet range.
   */
  function setUpForm(ss, values) {
    // Configure general form settings.
    var form = FormApp.create('Student Records Test Form');
    form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());
    form.setConfirmationMessage('Thanks for responding!')
    form.setAllowResponseEdits(true)
    form.setPublishingSummary(true)
    form.setShowLinkToRespondAgain(true)
  
    // Add a dropdown question that lets the user select the student.
    var allStudents = [];
    for (var i = 1; i < values.length; i++) {
      var student = values[i];
      allStudents.push(student);
    }
    var itemStudent = form.addListItem();
    itemStudent.setTitle('Student Name')
    itemStudent.setChoiceValues(allStudents)
    itemStudent.setRequired(true);
  
    // TODO: add instructions for setting up file upload on form
    // may make a better HTML interface in the future, but that would require Drive read/write permission.
    
    // Add a grid question that lets the user rate the student's work.
    var itemScales = form.addGridItem();
    itemScales.setTitle('Please identify where the student\'s work falls on applicable scales.')
    itemScales.setRows([
      'Scale 1: Reading Literature & Informational Text: Key Ideas and Details',
      'Scale 2: Reading Literature: Key Ideas and Details',
      'Scale 3: Reading Informational Text: Integration of Knowledge and Ideas',
      'Scale 4: Reading Foundations: Letter Identification',
      'Scale 5: Writing: Text Types and Purposes',
      'Scale 6: Language: Vocabulary Acquisition and Use'
    ])
    itemScales.setColumns([
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10',
      '11',
      '12',
      '13',
      '14',
      '15',
      '16',
      '17',
      '18'
    ]);
  }
  
  function onDeleteClass(className) {
    // TODO
  
    // Need to display confirmation message? or just refresh card to show no class
  }
  
  function onEditClass(className) {
    // TODO
  }
  
  function onRenameClass(className) {
    // TODO (later?)
  }