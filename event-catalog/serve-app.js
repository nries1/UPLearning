function doGet(e) {
  if (e.parameter.globalupdate) {
    setScriptProperties();
    return ContentService.createTextOutput("Your settings have been updated");
  } else {
  return HtmlService.createTemplateFromFile('index')
      .evaluate().setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL).setTitle("Event Catalog");
  }
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}