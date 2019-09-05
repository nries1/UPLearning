/* Server-side functions and variables here */
var eventId;
var title;
// Built in GAS function to serve HTML
function doGet(e) {
  if (e.parameter.globalupdate) {
    setScriptProperties();
    return ContentService.createTextOutput("Your settings have been updated");
  } else {
    eventId = e.parameter.id;
    title = e.parameter.title;
    return HtmlService.createTemplateFromFile('index').evaluate().setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL).addMetaTag('viewport', 'width=device-width, initial-scale=1').setFaviconUrl("https://www.schools.nyc.gov/favicon.ico").setTitle("Sign In");
  }
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}


function getConfig() {
  Logger.log(PropertiesService.getScriptProperties().getProperty("bks_language_acquisition"));
}