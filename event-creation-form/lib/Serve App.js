function getCalId() {
Logger.log(CalendarApp.getCalendarsByName("BK South Professional Learning Calendar")[0].getId());
}

function doGet(e) {
  if (e.parameter.globalupdate) {
    setScriptProperties();
    MailApp.sendEmail("bksouthpd@strongschools.nyc", "App Updated", "Global Vars updated");
    return ContentService.createTextOutput("Your settings have been updated");
  }
  return HtmlService.createTemplateFromFile('form')
      .evaluate().setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL).setFaviconUrl("https://www.schools.nyc.gov/favicon.ico").setTitle("Event Creation").addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}