function doGet(e) {
    if (e.parameter.globalupdate) {
      setScriptProperties();
      MailApp.sendEmail("ofdcpl@strongschools.nyc", "App Updated", "Global Vars updated");
      return ContentService.createTextOutput("Your settings have been updated");
    } else {
      return HtmlService.createTemplateFromFile('home').evaluate().setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL).setFaviconUrl("https://www.schools.nyc.gov/favicon.ico").setTitle("UPLearning Home").addMetaTag('viewport', 'width=device-width, initial-scale=1');
    }
  }
  
  function include(filename) {
    return HtmlService.createHtmlOutputFromFile(filename).getContent();
  }