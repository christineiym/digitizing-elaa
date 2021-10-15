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
    var message = "Hi!"
    return createClassManagerCard(message, true);
  }
  
  /**
   * Creates a card with an image of a cat, overlayed with the text.
   * @param {String} text The text to overlay on the image. Currently nothing here.
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
  
    // Create a button that changes the cat image when pressed.
    // Note: Action parameter keys and values must be strings.
    var action = CardService.newAction()
        .setFunctionName('onCreateClass')
        .setParameters({isHomepage: isHomepage.toString()});
    var button = CardService.newTextButton()
        .setText('Create Class')
        .setOnClickAction(action)
        .setTextButtonStyle(CardService.TextButtonStyle.FILLED);
    var buttonSet = CardService.newButtonSet()
        .addButton(button);
  
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
  
    var ssNew = SpreadsheetApp.create("My Class Records");
    Logger.log(ssNew.getUrl());
  
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