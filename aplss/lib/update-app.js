function updateApp(apps) {
   var sheet = SpreadsheetApp.openById(refSheet).getSheetByName(getUser().system);
   var data = sheet.getDataRange().getValues();
  //delete old app
  for (var i=0;i<apps.length;i++) {
    var app=apps[i];
    DriveApp.getFoldersByName(getUser().system).next().getFilesByName(app).next().setTrashed(true);
    //copy new app
    var refApp = DriveApp.getFolderById(originalId).getFilesByName(app).next();
    var newApp = refApp.makeCopy(refApp.getName(), DriveApp.getFoldersByName(getUser().system).next());
    Drive.Files.update({"parents": [{"id": DriveApp.getFoldersByName(getUser().system).next().getId() }]}, newApp.getId());
    for (var j=0; j<data.length; j++) {
      if (data[i][3]===app) {
        sheet.getRange(Number(i)+1,8).setValue(newApp.getDescription().split(";")[0]);
        sheet.getRange(Number(i)+1,10).setValue(newApp.getDescription().split(";")[1]);
        break;
      }
    }
  }
    return apps.length;
}
