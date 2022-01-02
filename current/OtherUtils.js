function returnToHomepage() {
    var card = createHomepageCard(true);
    var navigation = CardService.newNavigation()
        .popToRoot()
        .updateCard(card);
    var actionResponse = CardService.newActionResponseBuilder()
        .setNavigation(navigation);
    return actionResponse.build();
}

function logAllClassData() {
    var classes = PropertiesService.getUserProperties()
    var data = classes.getProperties();
    for (var key in data) {
        Logger.log('Key: %s, Value: %s', key, data[key]);
    };
}