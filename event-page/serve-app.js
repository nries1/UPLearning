function doGet(e) {
  if (e.parameter.globalupdate) {
    setScriptProperties();
    return ContentService.createTextOutput("Your settings have been updated");
  } else {
  return HtmlService.createTemplateFromFile('index')
      .evaluate().setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL).addMetaTag('viewport', 'width=device-width, initial-scale=1').setFaviconUrl("https://www.schools.nyc.gov/favicon.ico").setTitle("Event Page");
  }
}
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}