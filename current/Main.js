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