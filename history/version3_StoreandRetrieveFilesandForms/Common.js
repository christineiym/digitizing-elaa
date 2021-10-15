/**
 * This simple Google Workspace Add-on helps one manage one's class records.
 *
 * Click "File > Make a copy..." to copy the script, and "Publish > Deploy from
 * manifest > Install add-on" to install it.
 */

/**
 * Callback for rendering the homepage card.
 * @return {CardService.Card} The card to show to the user.
 */
 function onHomepage(e) {
    console.log(e);
    // var userProperties = PropertiesService.getUserProperties();
    // userProperties.deleteAllProperties();
    // Logger.log("deleting all properties")  // TODO: make RESET button? or no?
    // TODO: when delete spreadsheet/form completely, delete class?
    return createClassManagerCard(true);
  }
  
  /**
   * Creates a card, overlayed with the text.
   * @param {String} text The text.
   * @param {Boolean} isHomepage True if the card created here is a homepage;
   *      false otherwise. Defaults to false.
   * @return {CardService.Card} The assembled card.
   */
  function createClassManagerCard(isHomepage) {
    // Explicitly set the value of isHomepage as false if null or undefined.
    if (!isHomepage) {
      isHomepage = false;
    }
    
    var card = CardService.newCardBuilder()
        // .setFixedFooter(footer);
    
    // Create buttons for the classes created.
    var classes = PropertiesService.getUserProperties().getProperties();
    var allSpreadsheetUrls = [];
    var allFormUrls = [];
  
    for (var key in classes) {
      if(key) { // ensures links are not null.
        currentSpreadsheet = key;
        allSpreadsheetUrls.push(currentSpreadsheet);
  
        currentForm = classes[key];
        allFormUrls.push(currentForm);
      }
    }
  
    for (var i = 0; i < allSpreadsheetUrls.length; i++) {
      // Create section for each class.
      var section = CardService.newCardSection();
      
      // Creates buttons for the spreadsheet and the form of each class.
      // Note: Action parameter keys and values must be strings.
      var buttonSet = CardService.newButtonSet();
  
      var buttonSpreadsheet = CardService.newTextButton()
        .setText('Access Spreadsheet')  // how to access spreadsheet name?
        .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
        .setOpenLink(CardService.newOpenLink()
          // .setUrl("https://docs.google.com/"));
          .setUrl(allSpreadsheetUrls[i]));
      buttonSet.addButton(buttonSpreadsheet);
  
      var buttonForm = CardService.newTextButton()
        .setText('Access Form')  // how to access spreadsheet name?
        .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
        .setOpenLink(CardService.newOpenLink()
          // .setUrl("https://docs.google.com/"));
          .setUrl(allFormUrls[i]));
      buttonSet.addButton(buttonForm);
  
      section.addWidget(buttonSet);
      card.addSection(section);
    }
  
    var sectionNew = CardService.newCardSection();
    var buttonSetNew = CardService.newButtonSet();
    // Create a button that creates a spreadsheet when pressed.
    // Note: Action parameter keys and values must be strings.
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
  
    return card.build();
  }
  
  /**
   * Callback for the "Create Class" button.
   * @param {Object} e The event object, documented {@link
   *     https://developers.google.com/gmail/add-ons/concepts/actions#action_event_objects
   *     here}.
   * @return {CardService.ActionResponse} The action response to apply.
   */
  function onCreateClass(e) {
    console.log(e);
    // Get the text that was shown in the current cat image. This was passed as a
    // parameter on the Action set for the button.
    // var text = e.parameters.text;
  
    // The isHomepage parameter is passed as a string, so convert to a Boolean.
    var isHomepage = e.parameters.isHomepage === 'true';
  
    // Create new spreadsheet for the class.
    // TODO: populate with input.
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
    
    var ssUrl = ssNew.getUrl();
    var formUrl = ssNew.getFormUrl();
  
    // Store mapping of spreadsheet to form.
    var userProperties = PropertiesService.getUserProperties();
    userProperties.setProperty(ssUrl, formUrl); // TODO: use input; change homepage rendering
    Logger.log(ssUrl + " : " + formUrl);
  
    var properties = ssNew.insertSheet('Properties'); // for debugging purposes
    var links = PropertiesService.getUserProperties().getProperties(); // testing if it updates...
    for (var key in links) {
      properties.appendRow(['There is a property.'])
      properties.appendRow([key, links[key]]);
      Logger.log('Property: ' + key + ' is mapped to ' + links[key])
    }
  
    // Create a new card...
    var card = createClassManagerCard(isHomepage);
  
    // Create an action response that instructs the add-on to replace
    // the current card with the new one.
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
    // Create a new form, then add a student dropdown
    // and a grid of questions for the scales.
    var form = FormApp.create('Student Records Test Form');
    form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());
    form.setConfirmationMessage('Thanks for responding!')
    form.setAllowResponseEdits(true)
    form.setPublishingSummary(true)
    form.setShowLinkToRespondAgain(true)
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
    // may make a better HTML interface in the future, but would require Drive read/write permission... 
  
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
    // Logger.log('Published URL: ' + form.getPublishedUrl());
    // Logger.log('Editor URL: ' + form.getEditUrl());
  
    // return form.getPublishedUrl();  // TODO: return getEditUrl?
  }
  
  // /**
  //  * Tests if a string is a valid URL.
  //  * Taken from https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url .
  //  *
  //  * @param {String} ss The string to test.
  //  * @param {Array<String[]>} values Cell values for the spreadsheet range.
  //  * @return {String} The URL to the form.
  //  */
  // function isValidHttpUrl(string) {
  //   var url = ""; // placeholder
    
  //   try {
  //     url = new URL(string);
  //   } catch (_) {
  //     return false;  
  //   }
  
  //   return url.protocol === "http:" || url.protocol === "https:";
  // }