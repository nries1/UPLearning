function popAttnInfo(instance) {
      var prefix = boMap[instance].prefix;
      var ss = SpreadsheetApp.openById(props[prefix+"_database_id"])
      var regSheet = ss.getSheetByName("form registrations");
      var eventSheet = ss.getSheetByName("event creation form responses");
      var regData = regSheet.getDataRange().getValues();
      var eventData = eventSheet.getDataRange().getValues();
    var today = new Date();
    for (var k=1; k<eventData.length; k++) {
      //if (eventData[k][89] !== "no registrants" && eventData[k][89] !== 0) {
        var completedSessions = eventData[k].slice(21,32).reduce(function(countCurrent,date) {
          return new Date(date).getTime() <= today.getTime() ? ++countCurrent : countCurrent;
        },0);
        var attnInfo = getDbns(eventData[k][50],completedSessions,regData,false,false);
        var strAttnInfo = JSON.stringify(attnInfo);
      if (strAttnInfo.length>=50000) {
        eventSheet.getRange(Number(k)+1,88).setValue(JSON.stringify({"dbns":[],"registered":attnInfo.registered,"regRate":attnInfo.regRate,"sessions_attended":attnInfo.sessions_attended,"attended1day":attnInfo.attended1day,"attendanceRate":attnInfo.attendanceRate,"attendanceTrackRate":attnInfo.attendanceTrackRate}));
      } else {
        eventSheet.getRange(Number(k)+1,88).setValue(strAttnInfo);
      }
    }  
}

function popAttn() {
  var instances = Object.keys(boMap).filter(function(key) {return key.indexOf("System")!==-1});
  instances.forEach(function(instance) {
     popAttnInfo(instance);
  });
}