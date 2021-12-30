// Test 1
var testClass = new Classroom("122oijoi", "12309joi", "821983921", "821983921", ["Nancy", "Dalia", "Deandra"]);
var classes = PropertiesService.getUserProperties();
classes.setProperty("Fireflies", JSON.stringify(testClass));

var classesUpdated = PropertiesService.getUserProperties()
var data = classesUpdated.getProperties();
for (var key in data) {
    Logger.log('Key: %s, Value: %s', key, data[key]);
};

var testClassObject = JSON.parse(classesUpdated.getProperty("Fireflies"));
testClassObject.formID = "9992";
classesUpdated.setProperty("Fireflies", JSON.stringify(testClassObject));

var classesUpdatedAgain = PropertiesService.getUserProperties()
var data = classesUpdatedAgain.getProperties();
for (var key in data) {
    Logger.log('Key: %s, Value: %s', key, data[key]);
};

// Test 2
var testClass = new Classroom("122oijoi", "12309joi", "821983921", "821983921", ["Nancy", "Dalia", "Deandra"]);
var classes = PropertiesService.getUserProperties();
classes.setProperty("Fireflies", JSON.stringify(testClass));

var classesUpdated = PropertiesService.getUserProperties()
var data = classesUpdated.getProperties();
for (var key in data) {
  Logger.log('Key: %s, Value: %s', key, data[key]);
};

var testClassObject = JSON.parse(classesUpdated.getProperty("Fireflies"));
testClassObject.formID = "9992";
Logger.log(testClassObject.students[0]);
Logger.log(typeof testClassObject.students);
classesUpdated.setProperty("Fireflies", JSON.stringify(testClassObject));

var classesUpdatedAgain = PropertiesService.getUserProperties()
var data = classesUpdatedAgain.getProperties();
for (var key in data) {
  Logger.log('Key: %s, Value: %s', key, data[key]);
};