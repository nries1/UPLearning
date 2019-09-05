function doGet(e) {
  if (e.parameter.globalupdate) {
    setScriptProperties();
    MailApp.sendEmail("bksouthpd@strongschools.nyc", "App Updated", "Global Vars updated");
    return ContentService.createTextOutput("Your settings have been updated");
  } else {
  return HtmlService.createTemplateFromFile('form')
      .evaluate().setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL).addMetaTag('viewport', 'width=device-width, initial-scale=1').setFaviconUrl("https://www.schools.nyc.gov/favicon.ico").setTitle("Report Issues");
  }
}

function getDbns() {
  var dbnObj = {"all": []};
  var dbnSs = SpreadsheetApp.openById("1eb40-3XjECuXRJGRLLjFPdLXhLsRR8tk_heq0b25x-o").getSheetByName("all").getDataRange().getValues();
  dbnObj.all=dbnSs[0];
  return dbnObj;
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}

function postForm(formdata) {
  var dms=["lparlato@strongschools.nyc","awashington6@strongschools.nyc","rdecaul3@strongschools.nyc","dracic@strongschools.nyc","jpatterson6@strongschools.nyc","kedwards15@strongschools.nyc","kcuriel@strongschools.nyc","sschoepfer@strongschools.nyc"]
  var ss = SpreadsheetApp.openById("1FYtkXtbVPrIe4zANuV3M9vCVm2hYoQWJDJcMDfpmD3w");
  var s = ss.getSheetByName("new issues");
  var row = [new Date(), formdata.name,formdata.email,formdata.dbn,formdata.issue,formdata.event_id];
  s.appendRow(row);
  var affiliation = getAffiliation(formdata.dbn);
  if (affiliation) {var ccList = affiliation}
  else {var ccList = dms.join(",")}
  var body = "<p>Name: "+formdata.name+"</p><p>Email: "+formdata.email+"</p><p>DBN: "+formdata.dbn+"</p><p>Issue: "+formdata.issue+"</p><p>Event ID: "+formdata.event_id+"</p>"
  MailApp.sendEmail("kedwards15@schools.nyc.gov","UPLearning Issue No. "+Number(s.getLastRow()-1)+" DBN: "+formdata.dbn ,body, {noReply: true, htmlBody: body, cc:ccList})
  try {
    MailApp.sendEmail(formdata.email,"UPLearning Issue Report Received", "Greetings,\n\nThe issue your reported with UPLearning - "+formdata.issue+" - has been received, and will be processed as soon as possible. Thank you for your patience.\n\nSincerely,\nProfessional Learning Support\nNYCDOE")
  } catch(err) {Logger.log(err)}
}

function getAffiliation(dbn) {
  var out = {};
  var afiliations = SpreadsheetApp.openById("1JgXqzI6m4jv9fJ3fWh6NBqRJXmRmE9Kul-br0wcISPc").getSheets()[0].getDataRange().getValues();
  for (var i=0; i<afiliations.length;i++) {
    if (afiliations[i][0]===dbn) {
      return afiliations[i][2];
    }
  }
  return false;
}