function trySignIn(formBlob,instance) {
  Logger.log(formBlob);
  Logger.log(instance);
  var prefix = boMap[instance].prefix;
    var regss = SpreadsheetApp.openById(props[prefix+"_database_id"]);                             
    var regSheet = regss.getSheetByName("form registrations");                                 
    var regData = regSheet.getDataRange().getValues();    
  var out = {"sign_out": false};
  var found = false;
  var dateIndex = Number(r_date1AttnIndex)+Number(formBlob.dateIndex);
  for (var i=1; i<regData.length; i++) {
    if (regData[i][r_idIndex] === "" ) {continue}
    if (regData[i][r_idIndex].toLowerCase() === formBlob.confirmation.toLowerCase()) {
       found = true;
       out["name"] = regData[i][r_firstNameIndex]+" "+regData[i][r_lastNameIndex];
       out["email"] = regData[i][r_emailIndex];
       out["event"] = regData[i][r_eventTitleIndex].slice(idLength+1,regData[i][r_eventTitleIndex].length);
       out["eventId"] = regData[i][r_eventCodeIndex];
       out["confirmation"] = regData[i][r_idIndex];
       if (regData[i][dateIndex] !== "") {out.sign_out = true;}
       break;
    }
  }
  return found ? out : false;
}