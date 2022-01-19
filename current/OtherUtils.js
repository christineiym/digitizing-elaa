/**
 * Navigate to the homepage, and prevent users from going back.
 * 
 * @param {Object} e The event object, documented {@link
 *  https://developers.google.com/gmail/add-ons/concepts/actions#action_event_objects
 *  here}.
 * @return {CardService.ActionResponse} The action response to apply.
 */
function returnToHomepage() {
  var card = createHomepageCard(true);
  var navigation = CardService.newNavigation()
    .popToRoot()
    .updateCard(card);
  var actionResponse = CardService.newActionResponseBuilder()
    .setNavigation(navigation);
  return actionResponse.build();
}


/**
 * Log all Classroom data. For development purposes.
 */
function logAllClassData() {
  var classes = PropertiesService.getUserProperties()
  var data = classes.getProperties();
  for (var key in data) {
    Logger.log('Key: %s, Value: %s', key, data[key]);
  };
  return;
}