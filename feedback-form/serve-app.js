function doGet(e) {
  if (e.parameter.globalupdate) {
    setScriptProperties();
    return ContentService.createTextOutput("Your settings have been updated");
  } else {
  return HtmlService.createTemplateFromFile('index')
      .evaluate().setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL).addMetaTag('viewport', 'width=device-width, initial-scale=1');
  }
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}

function testDate() {
 var date = "2019-02-14";
  //var newDate = Utilities.formatDate(new Date(date), "GMT", "yyyy-MM-dd'T'HH:mm:ss'Z'");
  Logger.log(new Date(date));
}