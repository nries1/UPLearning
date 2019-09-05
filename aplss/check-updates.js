function checkUpdates() {
  var ss = SpreadsheetApp.openById(refSheet);
  var userData = ss.getSheetByName(getUser().system).getDataRange().getValues();
  var refData = ss.getSheetByName("Static PL System").getDataRange().getValues();
  var availableUpdates = [];
  for (var i=0;i<userData.length;i++) {
    if (userData[i][2]==="app") {
      for (var j=0; j<refData.length;j++) {
        if (userData[i][4]===refData[j][4] && userData[i][7] !== refData[j][7]) {
          availableUpdates.push({"name": userData[i][3], "key": userData[i][4],
                                 "last_update": userData[i][6].toString().slice(0,15),
                                 "user_version": userData[i][7], "latest_version": refData[j][7],
                                 "ver_desc": refData[j][9]});
        }
      }
    } else {continue;}
  }
  return availableUpdates;
}
