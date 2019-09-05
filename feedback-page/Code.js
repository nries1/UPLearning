function doGet(e) {
  if (e.parameter.globalupdate) {
    setScriptProperties();
    MailApp.sendEmail("bksouthpd@strongschools.nyc", "App Updated", "Global Vars updated");
    return ContentService.createTextOutput("Your settings have been updated");
  } else {
  return HtmlService.createTemplateFromFile('index')
      .evaluate().setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
  .setFaviconUrl("https://www.schools.nyc.gov/favicon.ico").setTitle("Feedback");
  }
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}
