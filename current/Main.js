/**
 * Callback for rendering the homepage card.
 * 
 * @return {CardService.Card} The card to show to the user.
 */
function onHomepage() {
  // logAllClassData();
  // var testClassObject = JSON.parse(classesUpdated.getProperty("Fireflies"));
  // testClassObject.formURL = "https://docs.google.com/forms/d/e/1FAIpQLSfiRDtR6G_JUZrJKrayBDi6j6q1Ppe7L3RT89wfa5dhKrZZ4g/viewform";
  // testClassObject.spreadsheetURL = "https://docs.google.com/spreadsheets/d/16mo3-FLBmHezSpzuwRirywtLA9vsGKQQrgLRFdxYSeg/edit#gid=1425994779";
  // classesUpdated.setProperty("Fireflies", JSON.stringify(testClassObject));
  // logAllClassData();

  // Create and return the card.
  return createHomepageCard(true);
}