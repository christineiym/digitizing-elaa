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

 const ORANGE = "#FF8000";

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
   //   .setImageUrl("https://docs.google.com/drawings/d/1lt3jbrl17WCVFJvQC_mE3NO7-smbLc3gk8ewgnJSL_I/edit?usp=sharing");
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
   // Note: Action parameter keys and values must be strings.
   var classes = PropertiesService.getUserProperties().getProperties();
   for (var classroom in classes) {
     // Obtain access to class information.
     var name = classroom;
     var clasroomDetails = JSON.parse(classes[classroom]);
 
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
         .setParameters({className: name}));
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
 
   // TODO: Completely change!!
 
   // Add instructions.
   var infoSection = CardService.newCardSection();
   var instructionParagraph = CardService.newTextParagraph()
       .setText("<b>Select student(s) for which to create reports.</b>");
   infoSection.addWidget(instructionParagraph);
   card.addSection(infoSection);
   
   // Create buttons for the classes created.
   // Note: Action parameter keys and values must be strings.
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
         .setParameters({className: name}));
     buttonSet.addButton(buttonSpreadsheet);
     
     // Create button for form.
     var buttonForm = CardService.newTextButton()
       .setText('Delete')
       .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
       .setBackgroundColor(ORANGE)
       .setOnClickAction(CardService.newAction()
         .setFunctionName("onDeleteClass")
         .setParameters({className: name}));
     buttonSet.addButton(buttonForm);
 
     section.addWidget(nameText);
     section.addWidget(buttonSet);
     card.addSection(section);
   }
 
   // Create the new class button.
   var fixedFooter = CardService.newFixedFooter()
       .setPrimaryButton(
           CardService.newTextButton()
               .setText("Save")
               .setOnClickAction(
                   CardService.newAction()
                       .setFunctionName(
                           "onSaveStudentListEdits")))
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
     // Note: Action parameter keys and values must be strings.
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
           .setParameters({className: name}));
       buttonSet.addButton(buttonSpreadsheet);
       
       // Create button for form.
       var buttonForm = CardService.newTextButton()
         .setText('Delete')
         .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
         .setBackgroundColor(ORANGE)
         .setOnClickAction(CardService.newAction()
           .setFunctionName("onDeleteClass")
           .setParameters({className: name}));
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
 
   // Add instructions.
   var infoSection = CardService.newCardSection();
   var instructionParagraph = CardService.newTextParagraph()
       .setText("<b>Please input a new class name.<br>\
       <i>Please note that once set, the class name cannot be changed.</i></b></u><br>");
   infoSection.addWidget(instructionParagraph);
   // TODO: finish input; feed class name to onCreateClass
   var inputName = CardService.newTextInput()
     .setFieldName("text_input_form_input_key")
     .setTitle("Text input title");
   infoSection.addWidget(inputName);
   card.addSection(infoSection);
   // Logger.log("Text input%s ",JSON.stringify(e.formInput.text_input_title))
 
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
 function createManageStudentListCard(students) { 
   // Create a new card.
   var card = CardService.newCardBuilder();
 
   // TODO: Completely change!!
 
   // Add instructions.
   var infoSection = CardService.newCardSection();
   var instructionParagraph = CardService.newTextParagraph()
       .setText("<b>Edit, delete, or create a class.</b>");
   infoSection.addWidget(instructionParagraph);
   card.addSection(infoSection);
   
   // Create buttons for the classes created.
   // Note: Action parameter keys and values must be strings.
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
         .setParameters({className: name}));
     buttonSet.addButton(buttonSpreadsheet);
     
     // Create button for form.
     var buttonForm = CardService.newTextButton()
       .setText('Delete')
       .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
       .setBackgroundColor(ORANGE)
       .setOnClickAction(CardService.newAction()
         .setFunctionName("onDeleteClass")
         .setParameters({className: name}));
     buttonSet.addButton(buttonForm);
 
     section.addWidget(nameText);
     section.addWidget(buttonSet);
     card.addSection(section);
   }
 
   // Create the new class button.
   var fixedFooter = CardService.newFixedFooter()
       .setPrimaryButton(
           CardService.newTextButton()
               .setText("Save")
               .setOnClickAction(
                   CardService.newAction()
                       .setFunctionName(
                           "onSaveStudentListEdits")))
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
       .setText("<u><b>Purpose</b></u><br> \
         To help teachers of students with special needs in generating and organizing class reports.<br><br> \
         u><b>Disclaimer</b></u><br> \
         While this was developed to the best of the developer’s abilities, there may be some bugs. \
         All code is provided as-is, but feel free to provide \
         <a href=\"https://docs.google.com/forms/d/e/1FAIpQLSfWvVxtXUXnUtUt258ypDvrdVCkJhD27tupPE5LAHPVpbnNNQ/viewform\">feedback</a>!<br><br> \
         u><b>Source Code</b></u><br> \
         See on GitHub at <a href=\"https://github.com/christineiym/digitizing-elaa\">this link</a>.");
   infoSection.addWidget(instructionParagraph);
   card.addSection(infoSection);
 
   // After all necessary components are added, return the card.
   return card.build();
 }