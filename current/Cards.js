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
 * Creates the homepage card.
 * 
 * @return {CardService.Card} The assembled card.
 */
 function createHomepageCard(isHomepage) {
  // Explicitly set the value of isHomepage as false if null or undefined.
  if (!isHomepage) {
    isHomepage = false;
  }

  // Create a new card.
  var card = CardService.newCardBuilder();

  // Add an image.
  // var backgroundSection = CardService.newCardSection();
  // var backgroundImage = CardService.newImage()
  //   .setAltText("A background image with a bird, cloud, and sun.")
  //   .setImageUrl("https://photos.app.goo.gl/kY4bd2UpvYWBrgT17");
  // backgroundSection.addWidget(backgroundImage);
  // card.addSection(backgroundSection);

  // Create buttons for the classes created.
  // Note: Action parameter keys and values must be strings.
  var classes = PropertiesService.getUserProperties().getProperties();

  // TODO: if classes.length is 0, display image/text to create your first class.
  // Otherwise, do below...

  for (var classroom in classes) {
    // Obtain access to class information.
    var name = classroom;
    var clasroomDetails = JSON.parse(classes[classroom]);

    // Create a section with a labelled set of buttons for each class.
    var section = CardService.newCardSection();
    var nameText = CardService.newDecoratedText()
      .setText(name)
      .setStartIcon(CardService.newIconImage()
        .setAltText("Star")
        .setIcon(CardService.Icon.STAR));
    var buttonSet = CardService.newButtonSet();

    // Create button for spreadsheet.
    var buttonSpreadsheet = CardService.newTextButton()
      .setText('View Data')
      .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
      .setBackgroundColor(ORANGE)
      .setOpenLink(CardService.newOpenLink()
        .setUrl(clasroomDetails.spreadsheetURL)
        .setOpenAs(CardService.OpenAs.FULL_SIZE)
        .setOnClose(CardService.OnClose.NOTHING));
    buttonSet.addButton(buttonSpreadsheet);

    // Create button for form.
    var buttonForm = CardService.newTextButton()
      .setText('View Form')
      .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
      .setBackgroundColor(ORANGE)
      .setOpenLink(CardService.newOpenLink()
        .setUrl(clasroomDetails.spreadsheetURL)
        .setOpenAs(CardService.OpenAs.FULL_SIZE)
        .setOnClose(CardService.OnClose.NOTHING));
    buttonSet.addButton(buttonForm);

    section.addWidget(nameText);
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
              "createReportGeneratorCard")))
    .setSecondaryButton(
      CardService.newTextButton()
        .setText("Manage List")
        .setOnClickAction(
          CardService.newAction()
            .setFunctionName(
              "createClassManagerCard")));
  card.setFixedFooter(fixedFooter);

  // After all necessary components are added, return the card.
  return card.build();
}

/**
 * Creates the report generator card.
 * 
 * @return {CardService.Card} The assembled card.
 */
function createReportGeneratorCard() {
  // Create a new card.
  var card = CardService.newCardBuilder();

  // Add instructions.
  var infoSection = CardService.newCardSection();
  var instructionParagraph = CardService.newTextParagraph()
    .setText("<b>Select a class to generate reports for.</b>");
  infoSection.addWidget(instructionParagraph);
  card.addSection(infoSection);

  // Create buttons for the classes created.
  var classes = PropertiesService.getUserProperties().getProperties();
  for (var classroom in classes) {
    // Obtain access to class information.
    var name = classroom;

    // Create a section with a labelled set of buttons for each class.
    var section = CardService.newCardSection();
    var buttonSet = CardService.newButtonSet();

    // Create button for class.
    var buttonSpreadsheet = CardService.newTextButton()
      .setText(name)
      .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
      .setBackgroundColor(ORANGE)
      .setOnClickAction(CardService.newAction()
        .setFunctionName("createSelectStudentsForReportsCard")
        .setParameters({ className: name }));
    buttonSet.addButton(buttonSpreadsheet);

    section.addWidget(buttonSet);
    card.addSection(section);
  }

  // After all necessary components are added, return the card.
  return card.build();
}

/**
 * Creates the select students for reports card.
 * 
 * @return {CardService.Card} The assembled card.
 */
function createSelectStudentsForReportsCard(className) {
  // Create a new card.
  var card = CardService.newCardBuilder();

  // Obtain access to current class data.
  var classes = PropertiesService.getUserProperties()
  var currentClassInfo = JSON.parse(classes.getProperty(className));
  var currentStudents = currentClassInfo.students;

  // Add instructions.
  var infoSection = CardService.newCardSection();
  var instructionParagraph = CardService.newTextParagraph()
    .setText("<b>Select student(s) to generate reports for.</b>");
  infoSection.addWidget(instructionParagraph);
  card.addSection(infoSection);

  // Create checkboxes for each student.
  var selectionSection = CardService.newCardSection();
  var checkboxGroup = CardService.newSelectionInput()
    .setType(CardService.SelectionInputType.CHECK_BOX)
    .setTitle("Students")
    .setFieldName(STUDENT_LIST_SELECTIONS_FIELD_NAME);
  for (var student in currentStudents) {
    checkboxGroup.addItem(student, student, true);
  }
  card.addSection(selectionSection);

  // Create the Next button.
  var fixedFooter = CardService.newFixedFooter()
    .setPrimaryButton(
      CardService.newTextButton()
        .setText("Next")
        .setOnClickAction(
          CardService.newAction()
            .setFunctionName("onSelectStudentsForReports")
            .setParameters({ className: className })))
  card.setFixedFooter(fixedFooter);

  // After all necessary components are added, return the card.
  return card.build();
}

/**
 * Creates the customize reports card.
 * 
 * @return {CardService.Card} The assembled card.
 */
function createCustomizeReportsCard(className, selectedStudents) {
  // Create a new card.
  var card = CardService.newCardBuilder();

  // Add title.
  var infoSection = CardService.newCardSection();
  var instructionParagraph = CardService.newTextParagraph()
    .setText("<b>Customize Report</b>");
  infoSection.addWidget(instructionParagraph);
  card.addSection(infoSection);

  // Set start and end dates.
  var dateSection = CardService.newCardSection();
  var startDatePicker = CardService.newDatePicker()
    .setTitle("Start Date:")
    .setFieldName(START_DATE_FIELD_NAME)
    // Set default value to approximately one year before today
    .setValueInMsSinceEpoch(new Date().setFullYear(new Date().getFullYear() - ONE_YEAR_INCREMENT).getTime());
  dateSection.addWidget(startDatePicker);
  var endDatePicker = CardService.newDatePicker()
    .setTitle("End Date:")
    .setFieldName(END_DATE_FIELD_NAME)
    // Set default value to today
    .setValueInMsSinceEpoch(new Date().getTime());
  dateSection.addWidget(endDatePicker);
  card.addSection(dateSection);

  // Set maximum number of examples to include.
  var selectionSection = CardService.newCardSection();
  var dropdownGroup = CardService.newSelectionInput()
    .setType(CardService.SelectionInputType.DROPDOWN)
    .setTitle("Maximum number of examples to include:")
    .setFieldName(MAX_EXAMPLES_FIELD_NAME);
  for (let i = 0; i < LIMIT_MAX_EXAMPLES; i++) {  // TODO: customize max number of examples
    dropdownGroup.addItem(i, i, false);
  }
  card.addSection(selectionSection);

  // Create the Generate Reports button.
  var fixedFooter = CardService.newFixedFooter()
    .setPrimaryButton(
      CardService.newTextButton()
        .setText("Generate Reports")
        .setOnClickAction(
          CardService.newAction()
            .setFunctionName("onReportGeneration")
            .setParameters({ className: className, selectedStudents: selectedStudents })))
  card.setFixedFooter(fixedFooter);

  // After all necessary components are added, return the card.
  return card.build();
}

/**
 * Creates the reports generated confirmation card.
 * 
 * @return {CardService.Card} The assembled card.
 */
function createReportsGeneratedCard() {
  // Create a new card.
  var card = CardService.newCardBuilder();

  // Add information.
  var infoSection = CardService.newCardSection();
  var instructionParagraph = CardService.newTextParagraph()
    .setText("<b>Report(s) have been generated!</b>");
  infoSection.addWidget(instructionParagraph);
  card.addSection(infoSection);

  // Create the settings button and new report button.
  var fixedFooter = CardService.newFixedFooter()
    .setPrimaryButton(
      CardService.newTextButton()
        .setText("View Reports")
        // TODO: change to link to reports sheet within spreadsheet
        .setOpenLink(CardService.newOpenLink()
          .setUrl(clasroomDetails.spreadsheetURL)
          .setOpenAs(CardService.OpenAs.FULL_SIZE)
          .setOnClose(CardService.OnClose.NOTHING)))
    .setSecondaryButton(
      CardService.newTextButton()
        .setText("Home")
        .setOnClickAction(
          CardService.newAction()
            .setFunctionName(
              "returnToHomepage")));
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

  // Add instructions.
  var infoSection = CardService.newCardSection();
  var instructionParagraph = CardService.newTextParagraph()
    .setText("<b>Edit, delete, or create a class.</b>");
  infoSection.addWidget(instructionParagraph);
  card.addSection(infoSection);

  // Create buttons for the classes created.
  var classes = PropertiesService.getUserProperties().getProperties();
  for (var classroom in classes) {
    var name = classroom;

    // Create a section with a labelled set of buttons for each class.
    var section = CardService.newCardSection();
    var nameText = CardService.newDecoratedText()
      .setText(name)
      .setStartIcon(CardService.newIconImage()
        .setAltText("Star")
        .setIcon(CardService.Icon.STAR));
    var buttonSet = CardService.newButtonSet();

    // Create edit button.
    var buttonSpreadsheet = CardService.newTextButton()
      .setText('Edit')
      .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
      .setBackgroundColor(ORANGE)
      .setOnClickAction(CardService.newAction()
        .setFunctionName("onEditClass")
        .setParameters({ className: name }));
    buttonSet.addButton(buttonSpreadsheet);

    // Create delete button.
    var buttonForm = CardService.newTextButton()
      .setText('Delete')
      .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
      .setBackgroundColor(ORANGE)
      .setOnClickAction(CardService.newAction()
        .setFunctionName("onDeleteClass")
        .setParameters({ className: name }));
    buttonSet.addButton(buttonForm);

    section.addWidget(nameText);
    section.addWidget(buttonSet);
    card.addSection(section);
  }

  // Create the new class button.
  var fixedFooter = CardService.newFixedFooter()
    .setPrimaryButton(
      CardService.newTextButton()
        .setText("Create Class")
        .setOnClickAction(
          CardService.newAction()
            .setFunctionName(
              "createNewClassSetUpCard")))
    .setSecondaryButton(
      CardService.newTextButton()
        .setText("Done")
        .setOnClickAction(
          CardService.newAction()
            .setFunctionName(
              "returnToHomepage")));
  card.setFixedFooter(fixedFooter);

  // After all necessary components are added, return the card.
  return card.build();
}

/**
 * Creates the new class set-up card.
 * 
 * @return {CardService.Card} The assembled card.
 */
function createNewClassSetUpCard() {
  // Create a new card.
  var card = CardService.newCardBuilder();

  // Add instructions and area for input.
  var infoSection = CardService.newCardSection();
  var instructionParagraph = CardService.newTextParagraph()
    .setText("<b>Please input a new class name.<br><i>Please note that once set, the class name cannot be changed.</i></b>");
  infoSection.addWidget(instructionParagraph);
  var inputName = CardService.newTextInput()
    .setFieldName("new_class_name_input")
    .setTitle("Class Name");
  infoSection.addWidget(inputName);
  card.addSection(infoSection);

  // Create the continue button.
  var fixedFooter = CardService.newFixedFooter()
    .setPrimaryButton(
      CardService.newTextButton()
        .setText("Create Class")
        .setOnClickAction(
          CardService.newAction()
            .setFunctionName(
              "onCreateClass")))
  card.setFixedFooter(fixedFooter);

  // After all necessary components are added, return the card.
  return card.build();
}

/**
 * Creates the manage student list card.
 * 
 * @return {CardService.Card} The assembled card.
 */
function createManageStudentListCard(className, placeholders) {
  // Create a new card.
  var card = CardService.newCardBuilder();

  // Obtain access to current class data.
  var classes = PropertiesService.getUserProperties()
  var currentClassInfo = JSON.parse(classes.getProperty(className));
  var currentStudents = currentClassInfo.students;
  Logger.log(currentStudents);

  // Add title.
  var infoSection = CardService.newCardSection();
  var instructionParagraph = CardService.newTextParagraph()
    .setText("<b>Students in " + className + " </b>");
  infoSection.addWidget(instructionParagraph);
  card.addSection(infoSection);

  // Add current students to card.
  for (let i = 0; i < currentStudents.length; i++) {
    let student = currentStudents[i];
    Logger.log(student);
    var section = CardService.newCardSection();

    // Display student name.
    var nameText = CardService.newTextParagraph()
    nameText.setText(student);
    section.addWidget(nameText);

    // Create delete button.
    var buttonSet = CardService.newButtonSet();
    var buttonForm = CardService.newTextButton()
    buttonForm.setText('Delete')
      .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
      .setBackgroundColor(ORANGE)
      .setOnClickAction(CardService.newAction()
        .setFunctionName("onDeleteStudent")
        .setParameters({ className: className, studentName: student }));
    buttonSet.addButton(buttonForm);
    section.addWidget(buttonSet);

    card.addSection(section);
  }

  placeholderList = Object.keys(placeholders);
  Logger.log(placeholders);
  Logger.log(placeholderList);
  for (let i = 0; i < placeholderList.length; i++) {
    var student = placeholderList[i];
    Logger.log("Key: " + student);
    Logger.log("Value: " + placeholders[student]);
    var section = CardService.newCardSection();

    // Create text input field for form.
    var inputName = CardService.newTextInput()
    inputName.setFieldName(student)
      .setValue(placeholders[student].toString());  // set default name to be the name currently stored.
    infoSection.addWidget(inputName);

    // Create delete button.
    var buttonSet = CardService.newButtonSet();
    var buttonForm = CardService.newTextButton();
    buttonForm.setText('Delete')
      .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
      .setBackgroundColor(ORANGE)
      .setOnClickAction(CardService.newAction()
        .setFunctionName("onDeleteStudent")
        .setParameters({ className: className, studentName: student }));
    buttonSet.addButton(buttonForm);

    section.addWidget(inputName);
    section.addWidget(buttonSet);
    card.addSection(section);
  }

  // Create add button.
  var addSection = CardService.newCardSection();
  var addButtonSet = CardService.newButtonSet();
  var addButton = CardService.newTextButton()
    .setText('Add Student')
    .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
    .setBackgroundColor(ORANGE)
    .setOnClickAction(CardService.newAction()
      .setFunctionName("onAddStudent")
      .setParameters({ className: className }));
  addButtonSet.addButton(addButton);
  addSection.addWidget(addButtonSet);
  card.addSection(addSection);

  // Create the save button.
  var fixedFooter = CardService.newFixedFooter()
    .setPrimaryButton(
      CardService.newTextButton()
        .setText("Save")
        .setOnClickAction(
          CardService.newAction()
            .setFunctionName("onSaveStudentListEdits")
            .setParameters({ className: className })))
  card.setFixedFooter(fixedFooter);

  // After all necessary components are added, return the card.
  return card.build();
}

/**
 * Creates the about card.
 * 
 * @return {CardService.Card} The assembled card.
 */
function createAboutCard() {
  // Create a new card.
  var card = CardService.newCardBuilder();

  // Add information.
  var infoSection = CardService.newCardSection();
  var instructionParagraph = CardService.newTextParagraph()
    .setText("<u><b>Purpose</b></u><br>To help teachers of students with special needs in generating and organizing class reports.<br><br><u><b>Disclaimer</b></u><br>While this was developed to the best of the developer’s abilities, there may be some bugs. All code is provided as-is, but feel free to provide <a href=\"https://docs.google.com/forms/d/e/1FAIpQLSfWvVxtXUXnUtUt258ypDvrdVCkJhD27tupPE5LAHPVpbnNNQ/viewform\">feedback</a>!<br><br><u><b>Source Code</b></u><br>See on GitHub at <a href=\"https://github.com/christineiym/digitizing-elaa\">this link</a>.");
  infoSection.addWidget(instructionParagraph);
  card.addSection(infoSection);

  // After all necessary components are added, return the card.
  return card.build();
}