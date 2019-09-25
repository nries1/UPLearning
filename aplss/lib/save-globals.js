function saveGlobals(form) {
  Logger.log("saving globals");
  Logger.log(form);
  var props = PropertiesService.getScriptProperties().getProperties();
  var boMap = JSON.parse(props.boMap);
  var sheet = SpreadsheetApp.openById(refSheet).getSheetByName(boMap[Session.getActiveUser().getEmail()].system);
  var data = sheet.getDataRange().getValues();
  for (var j=0;j<data.length;j++) {
    for (var i=0;i<form.length;i++) {
      if (form[i].key===data[j][4] && form[i].value!==data[j][8]) {
         sheet.getRange(Number(j)+1,7).setValue(new Date());
         sheet.getRange(Number(j)+1,9).setValue(form[i].value);
      }
    }
  }
  var displayForm = JSON.stringify(form);
  MailApp.sendEmail("bksouthpd@strongschools.nyc", "updates to reference variables", boMap[Session.getActiveUser().getEmail()].system+" has posted the following new reference variables: "+displayForm)
  return {"success": true}
}

function runSetup(app) {
  var url=app+"?globalupdate=true";
  return UrlFetchApp.fetch(url);
  //UrlFetchApp.fetch(url);
}

function testRunSetUp() {
  Logger.log(UrlFetchApp.fetch("https://script.google.com/a/strongschools.nyc/macros/s/AKfycbya54RGEUuaDyx7zixx0a0dvkkXr5ci9BRI4XqgjkPPxfKUrX4/exec"));
}