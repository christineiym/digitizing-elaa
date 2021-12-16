// Refresh the card to display buttons for the new spreadsheet and form.
var card = createClassManagerCard(isHomepage);
var navigation = CardService.newNavigation()
    .updateCard(card);
var actionResponse = CardService.newActionResponseBuilder()
    .setNavigation(navigation);
return actionResponse.build();