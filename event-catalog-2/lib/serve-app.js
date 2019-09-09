var doGet = function doGet(e) {
  if (e.parameter.globalupdate) {
    setScriptProperties();
    return ContentService.createTextOutput("Your settings have been updated");
  } else {
<<<<<<< HEAD
    return HtmlService.createTemplateFromFile('catalog')
          .evaluate()
          .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
          .setTitle("Event Catalog")
          .setFaviconUrl("https://www.schools.nyc.gov/favicon.ico")
          .addMetaTag('viewport', 'width=device-width, initial-scale=1');
=======
    return HtmlService.createTemplateFromFile('catalog').evaluate().setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL).setTitle("Event Catalog");
>>>>>>> 17d8e51fb4d295377535516be6f4764c18ee94ec
  }
};

var include = function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
};