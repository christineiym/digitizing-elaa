function objectToClassroom(raw) {
  // New object v. global variables?
  return new Classroom(raw.spreadsheetID, raw.formID, raw.formResponsesID, raw.reportsSheetID, raw.students);
}

/**
 * Callback for creating a class.
 * 
 * @return {CardService.ActionResponse} The action response to apply.
 */
function onCreateClass(e) {
  Logger.log(e);
  className = e.commonEventObject.formInputs.new_class_name_input.stringInputs.value[0];
  Logger.log(className);

  // Create new spreadsheet for the class.
  var ssNew = SpreadsheetApp.create("My Class Records: " + className);
  var first = ssNew.getSheetByName("Sheet1");
  first.setName("Reports");
  first.appendRow(['Student Name']);
  ssNew.setActiveSheet(first);

  var ssUrl = ssNew.getUrl();
  var ssReportsSheetID = ssNew.getActiveSheet().getSheetId();
  Logger.log(ssUrl);
  Logger.log(reportsSheetID);

  newClass = new Classroom(ssUrl, GENERIC_PLACEHOLDER, GENERIC_PLACEHOLDER, ssReportsSheetID, STUDENT_LIST_PLACEHOLDER);
  newClassInfo = JSON.stringify(newClass);
  Logger.log(newClassInfo);
  PropertiesService.getUserProperties().setProperty(className, newClassInfo);

  // Complete class creation process with other functions.
  createManageStudentListCard(className);
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
  // remove "Student" label
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