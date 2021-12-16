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
  
  /**
   * Placeholder function for development purposes.
   */
  function placeholder() {
    // Here to do nothing!
  }