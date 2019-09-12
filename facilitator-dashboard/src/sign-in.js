function participantSignIn(pid,instance,signout) {
    var prefix = boMap[instance].prefix;
    var database = SpreadsheetApp.openById(props[prefix+"_database_id"]);
    var regSheet = database.getSheetByName("form registrations");
    var regData = regSheet.getDataRange().getValues();
    for (var i=0; i<regData.length;i++) {
      if (regData[i][42]!=="") {
        if (regData[i][42].toLowerCase()===pid.toLowerCase()) {
          var eventInfo = getDateIndex(regData[i][18],instance);
          if (signout) {
            var range = regSheet.getRange(Number(i)+1,45+Number(eventInfo.dateIndex));
            var currentAttn = Number(range.getNote());
            range.setValue((Number((new Date().getTime()-currentAttn))/(60*60*1000)).toFixed(1));
            return {"msg": "Signed Out", "success": true}
          }
          if (!eventInfo.found) {
            return {"msg": "Event not found", "success": false}
          }
          if (eventInfo.dateIndex===-1) {return {"msg": "Invalid Signin Date", "success": false}}
          if (regData[i][13].indexOf("Yes")!== -1) {
            regSheet.getRange(Number(i)+1,45+Number(eventInfo.dateIndex)).setNote(new Date().getTime()).setValue(0);
            return {"msg": "Signed in. Don't forget to sign out!", "success": true, "require_sign_out": true}
          } else {
            regSheet.getRange(Number(i)+1,45+Number(eventInfo.dateIndex)).setValue(eventInfo.duration);
            return {"msg": "Signed In", "success": true}
          }
        }
      }
    }
  return {"msg": "ID not found", "success": false}
}

function getDateIndex(eventId,instance) {
  var prefix = boMap[instance].prefix;
  var today = new Date();
  var database = SpreadsheetApp.openById(props[prefix+"_database_id"]);
  var eventData = database.getSheetByName("event creation form responses").getDataRange().getValues();
  var eventInfo = {};
  for (var i=0; i<eventData.length; i++) {
    if (eventData[i][50]===eventId) {
      eventInfo.dateIndex = eventData[i].slice(21,32).reduce(function(acum, cur, index) {
        var thisDate = new Date(cur);
        if (thisDate.getDate()===today.getDate() && thisDate.getMonth()===today.getMonth() && thisDate.getFullYear() === today.getFullYear()) {
          return index;
        } else {
          return acum
        }
      },-1);
      eventInfo.duration = eventData[i][53];
      eventInfo.found = true;
      return eventInfo;
    }
  }
  return {"found": false};
}