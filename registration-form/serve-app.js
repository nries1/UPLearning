var eventId;
var title;

function doGet(e) {
  if (e.parameter.globalupdate) {
    setScriptProperties();
    MailApp.sendEmail("bksouthpd@strongschools.nyc", "App Updated", "Global Vars updated");
    return ContentService.createTextOutput("Your settings have been updated");
  } else {
  return HtmlService.createTemplateFromFile('form')
      .evaluate().setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL).addMetaTag('viewport', 'width=device-width, initial-scale=1').setFaviconUrl("https://www.schools.nyc.gov/favicon.ico").setTitle("UPLearning Registration");
}
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}

function tryFetchCall() {
var payload = { 
    name : "Gene",
    text : "some text",
    time : new Date()
  };
var params = { 
    method : "get",
    payload : payload,
    followRedirects: false,
    muteHttpExceptions: true
  }
  var url =
  "https://script.google.com/macros/s/AKfycbwjZW5CX3l3jqDHqxU5xVG6AKZvHAJPlfYVGFCcKJkRN8rAld4/exec?something=helloworld";
  var HTTPResponse = UrlFetchApp.fetch(url);
  Logger.log(HTTPResponse.getContentText());  
}

