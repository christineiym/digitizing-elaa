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
    var placeholder = "https://www.google.com/"  // TODO: change
    // Get multiple script properties in one call, then log them all.
    var scriptProperties = PropertiesService.getScriptProperties();
    var data = scriptProperties.getProperties();
    for (var key in data) {
      //
    }
    return createClassManagerCard(placeholder, true);
  }
  
  /**
   * Creates a card, overlayed with the text.
   * @param {String} text The text.
   * @param {Boolean} isHomepage True if the card created here is a homepage;
   *      false otherwise. Defaults to false.
   * @return {CardService.Card} The assembled card.
   */
  function createClassManagerCard(text, isHomepage) {
    // Explicitly set the value of isHomepage as false if null or undefined.
    if (!isHomepage) {
      isHomepage = false;
    }
  
    // Use the "Cat as a service" API to get the cat image. Add a "time" URL
    // parameter to act as a cache buster.
    // var now = new Date();
    // // Replace formward slashes in the text, as they break the CataaS API.
    // // var caption = text.replace(/\//g, ' ');
    // var imageUrl =
    //     Utilities.formatString('https://www.google.com/url?sa=i&url=https%3A%2F%2Fwallpaperaccess.com%2Fcute-kitty&psig=AOvVaw0zWulS4hhs-p44D1SXnd6i&ust=1615677815067000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCLDO7Ifzq-8CFQAAAAAdAAAAABAD',
    //         encodeURIComponent(caption), now.getTime());
    // var image = CardService.newImage()
    //     .setImageUrl(imageUrl)
    //     .setAltText('Meow')
  
    // Create a button that creates a spreadsheet when pressed.
    // Note: Action parameter keys and values must be strings.
    var action = CardService.newAction()
        .setFunctionName('onCreateClass')
        .setParameters({isHomepage: isHomepage.toString()});
    var buttonSpreadsheet = CardService.newTextButton()
        .setText('Create Class')
        .setOnClickAction(action)
        .setTextButtonStyle(CardService.TextButtonStyle.FILLED);
    var buttonSet = CardService.newButtonSet()
        .addButton(buttonSpreadsheet);
    
    // Create a button to access the form tied to the new spreadsheet.
    var buttonForm = CardService.newTextButton()
        .setText('Access Form')
        .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
        .setOpenLink(CardService.newOpenLink()
          .setUrl(text));
    buttonSet.addButton(buttonForm);
  
    // Create a footer to be shown at the bottom.
    // var footer = CardService.newFixedFooter()
    //     .setPrimaryButton(CardService.newTextButton()
    //         .setText('Feedback')
    //         .setOpenLink(CardService.newOpenLink()
    //             .setUrl('https://docs.google.com/forms/d/e/1FAIpQLSfWvVxtXUXnUtUt258ypDvrdVCkJhD27tupPE5LAHPVpbnNNQ/viewform')));
  
    // Assemble the widgets and return the card.
    var section = CardService.newCardSection()
        // .addWidget(image)
        .addWidget(buttonSet);
    var card = CardService.newCardBuilder()
        .addSection(section)
        // .setFixedFooter(footer);
    
    // TODO: check where is the best place to store data
  
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
  
    var properties = ssNew.insertSheet('Properties'); // for debugging purposes
    var scriptProperties = PropertiesService.getScriptProperties();
    var data = scriptProperties.getProperties();
    for (var key in data) {
      properties.appendRow(['There is a property.'])
      properties.appendRow([key, data[key]]);
    }
  
    // Create new form tied to spreadsheet.
    var range = names.getDataRange();
    var values = range.getValues();
    var formUrl = setUpForm(ssNew, values);
    Logger.log(ssNew.getUrl());
  
    // Create a new card...
    var card = createClassManagerCard(formUrl, isHomepage);
  
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
   * @return {String} The URL to the form.
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
    Logger.log('Published URL: ' + form.getPublishedUrl());  // TODO: where are things logged?
    Logger.log('Editor URL: ' + form.getEditUrl());
  
    return form.getPublishedUrl();  // TODO: also return getEditUrl
  }