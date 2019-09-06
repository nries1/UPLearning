const doGet = e => {
    if (e.parameter.globalupdate) {
        setScriptProperties();
        return ContentService.createTextOutput("Your settings have been updated");
      } else {
      return HtmlService.createTemplateFromFile('index')
          .evaluate().setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL).setTitle("Event Catalog");
      }   
}

const include = filename => HtmlService.createHtmlOutputFromFile(filename).getContent();