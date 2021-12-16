/**
 * This simple Google Workspace Add-on helps one manage one's class records.
 * Specifically, it lets you create and access a form to collect student data with
 * and the associated spreadsheet that serves as a class database.
 *
 * In the current development phase, the add-on can be installed by doing the following:
 * 1) Email christine.mendoza@unc.edu with the test Gmail account
 *  with which you want to use the Add-on. I (Christine) will give you read access
 *  to the add-on code file.
 * 2) Follow the steps in https://developers.google.com/workspace/add-ons/how-tos/testing-gsuite-addons#install_an_unpublished_add-on to install the add-on. The page
 *  also has instructions for uninstalling the add-on.
 * 
 * Please do not hesitate to email me directly at christine.mendoza@unc.edu with any questions, 
 * errors, concerns, and/or feedback! In the installed add-on, you can also provide feedback by
 * clicking the three dots at the top and filling out the form accessed through 'Provide Feedback'.
 */

/**
 * Callback for rendering the homepage card.
 * 
 * @param {Object} e The event object, documented {@link
 *     https://developers.google.com/gmail/add-ons/concepts/actions#action_event_objects
 *     here}.
 * @return {CardService.Card} The card to show to the user.
 */
function onHomepage(e) {
  // console.log(e);

  // var classesUpdated = PropertiesService.getUserProperties()
  // var data = classesUpdated.getProperties();
  // for (var key in data) {
  //     Logger.log('Key: %s, Value: %s', key, data[key]);
  // };

  // var testClassObject = JSON.parse(classesUpdated.getProperty("Fireflies"));
  // testClassObject.formURL = "https://docs.google.com/forms/d/e/1FAIpQLSfiRDtR6G_JUZrJKrayBDi6j6q1Ppe7L3RT89wfa5dhKrZZ4g/viewform";
  // testClassObject.spreadsheetURL = "https://docs.google.com/spreadsheets/d/16mo3-FLBmHezSpzuwRirywtLA9vsGKQQrgLRFdxYSeg/edit#gid=1425994779";
  // classesUpdated.setProperty("Fireflies", JSON.stringify(testClassObject));

  // var classesUpdatedAgain = PropertiesService.getUserProperties()
  // var data = classesUpdatedAgain.getProperties();
  // for (var key in data) {
  //     Logger.log('Key: %s, Value: %s', key, data[key]);
  // };

  // Create and return the card.
  return createHomepageCard(true);
}

function createHomepageCard(isHomepage) {
  // Explicitly set the value of isHomepage as false if null or undefined.
  if (!isHomepage) {
    isHomepage = false;
  }

  // Create a new card.
  var card = CardService.newCardBuilder();

  // Create buttons for the classes created.
  // Note: Action parameter keys and values must be strings.
  var classes = PropertiesService.getUserProperties().getProperties();
  for (var classroom in classes) {
    // Obtain access to class information.
    var name = classroom;
    var clasroomDetails = JSON.parse(classes[classroom]);

    // Create a section with a labelled set of buttons for each class.
    var section = CardService.newCardSection();
    var nameParagraph = CardService.newTextParagraph()
      .setText(name);
    var buttonSet = CardService.newButtonSet();
    
    // Create button for spreadsheet.
    var buttonSpreadsheet = CardService.newTextButton()
      .setText('View Data')
      .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
      .setOpenLink(CardService.newOpenLink()
        .setUrl(clasroomDetails.spreadsheetURL)
        .setOpenAs(CardService.OpenAs.FULL_SIZE)
        .setOnClose(CardService.OnClose.NOTHING));
    buttonSet.addButton(buttonSpreadsheet);
    
    // Create button for form.
    var buttonForm = CardService.newTextButton()
      .setText('View Form')  // how to access spreadsheet name?
      .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
      .setOpenLink(CardService.newOpenLink()
        .setUrl(clasroomDetails.spreadsheetURL)
        .setOpenAs(CardService.OpenAs.FULL_SIZE)
        .setOnClose(CardService.OnClose.NOTHING));
    buttonSet.addButton(buttonForm);

    section.addWidget(nameParagraph);
    section.addWidget(buttonSet);
    card.addSection(section);
  }

  // Create the settings button and new report button.
  var fixedFooter = CardService.newFixedFooter()
      .setPrimaryButton(
          CardService.newTextButton()
              .setText("Create Report")
              .setOnClickAction(
                  CardService.newAction()
                      .setFunctionName(
                          "deleteClassList")))
      .setSecondaryButton(
          CardService.newTextButton()
              .setText("Manage List")
              .setOnClickAction(
                  CardService.newAction()
                      .setFunctionName(
                          "deleteClassList")));
  card.setFixedFooter(fixedFooter);

  // After all necessary components are added, return the card.
  return card.build();
}

/**
 * Creates the class manager card.
 * 
 * @return {CardService.Card} The assembled card.
 */
function createClassManagerCard() { 
  // Create a new card.
  var card = CardService.newCardBuilder();
  
  // Create buttons for the classes created.
  // Note: Action parameter keys and values must be strings.
  var classes = PropertiesService.getUserProperties().getProperties();
  for (var spreadsheet in classes) {
    // Create a section with a set of buttons for each class.
    var section = CardService.newCardSection();
    var buttonSet = CardService.newButtonSet();
    
    // Create button for spreadsheet.
    var buttonSpreadsheet = CardService.newTextButton()
      .setText('Access Spreadsheet')  // how to access spreadsheet name?
      .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
      .setOpenLink(CardService.newOpenLink()
        .setUrl(spreadsheet));
    buttonSet.addButton(buttonSpreadsheet);
    
    // Create button for form.
    var buttonForm = CardService.newTextButton()
      .setText('Access Form')  // how to access spreadsheet name?
      .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
      .setOpenLink(CardService.newOpenLink()
        .setUrl(classes[spreadsheet]));
    buttonSet.addButton(buttonForm);

    section.addWidget(buttonSet);
    card.addSection(section);
  }

  // Create a new section with a button that creates new class spreadsheet
  // and its associated form when pressed.
  var sectionNew = CardService.newCardSection();
  var buttonSetNew = CardService.newButtonSet();
  var action = CardService.newAction()
      .setFunctionName('onCreateClass')
      .setParameters({isHomepage: isHomepage.toString()});
  var buttonNewSpreadsheet = CardService.newTextButton()
      .setText('Create Class')
      .setOnClickAction(action)
      .setTextButtonStyle(CardService.TextButtonStyle.FILLED);
  buttonSetNew.addButton(buttonNewSpreadsheet);
  sectionNew.addWidget(buttonSetNew);
  card.addSection(sectionNew);

  // After all necessary components are added, return the card.
  return card.build();
}

/**
 * Callback for the "Create Class" button.
 * 
 * @param {Object} e The event object, documented {@link
 *     https://developers.google.com/gmail/add-ons/concepts/actions#action_event_objects
 *     here}.
 * @return {CardService.ActionResponse} The action response to apply.
 */
function onCreateClass(e) {
  console.log(e);

  // The isHomepage parameter is passed as a string, so convert to a Boolean.
  var isHomepage = e.parameters.isHomepage === 'true';

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

/**
 * Deletes all classes from the add-on's class listing.
 * Any files created are retained.
 * For development purposes only.
 * 
 * @return {CardService.ActionResponse} The action response to apply.
 */
function deleteClassList() {
  // Delete all classes from the add-on's hidden class listing.
  var classes = PropertiesService.getUserProperties();
  classes.deleteAllProperties();
  Logger.log("Deleting all mappings of spreadsheets to forms.")

  // Refresh the card to show no classes listed.
  var card = createClassManagerCard(true);
  var navigation = CardService.newNavigation()
      .updateCard(card);
  var actionResponse = CardService.newActionResponseBuilder()
      .setNavigation(navigation);
  return actionResponse.build();
}