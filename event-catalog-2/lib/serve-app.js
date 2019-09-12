var doGet = function doGet(e) {
  if (e.parameter.globalupdate) {
    setScriptProperties();
    return ContentService.createTextOutput("Your settings have been updated");
  } else {
    return HtmlService.createTemplateFromFile('catalog')
          .evaluate()
          .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
          .setTitle("Event Catalog")
          .setFaviconUrl("https://www.schools.nyc.gov/favicon.ico")
          .addMetaTag('viewport', 'width=device-width, initial-scale=1');
    return HtmlService.createTemplateFromFile('catalog').evaluate().setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL).setTitle("Event Catalog");
  }
};

var include = function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
};