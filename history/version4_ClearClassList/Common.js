/**
 * This simple Google Workspace Add-on helps one manage one's class records.
 * Specifically, it lets you create and access a form to collect student data with
 * and the associated spreadsheet that serves as a class database.
 *
 * In the current development phase, there are two ways to install it:
 * 1) Email christine.mendoza@unc.edu with the test Gmail account
 *  with which you want to use the Add-on.
 * 2) (not recommended due to the time and effort involved) Copy the code and then deploy it. 
 *  This involves several steps:
 *  (1) Create a new AppsScript file and copy the code from Common.gs into it.
 *  (2) Go to project settings (the gear icon on the left in the new AppsScript editor). 
 *    Under 'General Settings', check 'Show "appsscript.json" manifest file in editor'.
 *    Go back to the project code and copy the code from appscript.json into it.
 *  (3) Follow the steps in https://cloud.google.com/resource-manager/docs/creating-managing-projects#creating_a_project to create a project on Google Cloud.
 *      - If you do not have a Google Cloud account already, you will have to
 *        create one. You should not have to connect your account to any form of payment.
 *      - If you are using a personal Gmail account, you do not have to worry
 *        about if you have the 'resourcemanager.projects.create' permission;
 *        you should already have that permission.
 *      - I recommend using the Cloud Console to create a new project.
 *      - Under OAuth scopes, paste each of the scopes listed under "oauthScopes"
 *        in appsscript.json.
 *   (4) Go to project settings again. Under 'Google Cloud Platform (GCP) Project',
 *     click the button and follow the instructions to connect the AppsScript file
 *     to the Google Cloud Project you created in step (3).
 *   (5) Click the arrow next to Deploy and select 'New Deployment' from the dropdown
 *      menu that appears. The type should be 'Add-on.' Add a description and hit 'Deploy'.
 *   (6) Refresh your Google Drive. You should see an 'A+' icon appear in the right sidebar.
 *      Click on it and then follow the instructions to allow the add-on to be installed
 *      and to let it access files within the necessary scopes.
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
  console.log(e);

  // Create and return the card.
  return createClassManagerCard(true);
}

/**
 * Creates a card, overlayed with the text.
 * 
 * @param {Boolean} isHomepage True if the card created here is a homepage;
 *      false otherwise. Defaults to false.
 * @return {CardService.Card} The assembled card.
 */
function createClassManagerCard(isHomepage) {
  // Explicitly set the value of isHomepage as false if null or undefined.
  if (!isHomepage) {
    isHomepage = false;
  }
  
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