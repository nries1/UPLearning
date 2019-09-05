function postAttendance(data,instance,archive) {
    var prefix = boMap[instance].prefix;
  Logger.log(data);
  var out = {found_regs: 0, attendance_complete: false};
    if (archive==="archived") {
      var regSheet = SpreadsheetApp.openById(props[prefix+"_archive_id"]).getSheetByName("Registrants")
      var regData = regSheet.getDataRange().getValues();
    } else {
      var ss = SpreadsheetApp.openById(props[prefix+"_database_id"])
      var regSheet = ss.getSheetByName("form registrations");
      var eventSheet = ss.getSheetByName("event creation form responses");
      var regData = regSheet.getDataRange().getValues();
      var eventData = eventSheet.getDataRange().getValues();
    }
  //set attendance values
  for (var i=0; i<regData.length; i++) {
    if (data[regData[i][42]]) {
      out.found_regs++;
      regSheet.getRange(Number(i)+1,44+Number(data.session_number)).setValue(data[regData[i][42]]);
    }
  }
  //update attendance info obj
  if (archive!=="archived") {
    var today = new Date();
    for (var k=0; k<eventData.length; k++) {
      if (eventData[k][50]===data.event_id) {
        //now that we set the attendance values we need to reload the registrant database so that the attendance info object is correct
        if (archive==="archived") {
          var regSheet = SpreadsheetApp.openById(props[prefix+"_archive_id"]).getSheetByName("Registrants")
          var regData = regSheet.getDataRange().getValues();
        } else {
          var regSheet = ss.getSheetByName("form registrations");
          var regData = regSheet.getDataRange().getValues();
        }        
        var completedSessions = eventData[k].slice(21,32).reduce(function(countCurrent,date) {
          return new Date(date).getTime() <= today.getTime() ? ++countCurrent : countCurrent;
        },0);
        var attnInfo = getDbns(data.event_id,completedSessions,regData,false,false);
        if (attnInfo.attendanceTrackRate === 1 && today.getTime() >= new Date(eventData[k][80]).getTime()) {
          out.attendance_complete = true;
        }
        Logger.log(attnInfo);
        var strAttnInfo = JSON.stringify(attnInfo);
        if (strAttnInfo.length>=50000) {
          eventSheet.getRange(Number(k)+1,88).setValue(JSON.stringify({dbns:[], registered:attnInfo.registered, regRate:attnInfo.regRate, sessions_attended:attnInfo.sessions_attended, attended1day:attnInfo.attended1day, attendanceRate:attnInfo.attendanceRate, attendanceTrackRate: attnInfo.attendanceTrackRate, truncated: true}));
        } else {
          eventSheet.getRange(Number(k)+1,88).setValue(strAttnInfo);
        }
        break;
      } 
    }
  }
  return out;
}

function getDbns(eventId,days,database,districts,dbn) {
  var dbns = [];
  var dbnObj;
  if (districts) {districts = districts.map(function(dist){return dist.toString()})}
  var sessionsAttended = 0;
  var totalRegistered = 0;
  var registeredSessions = 0; //number of people registered by the number of sessions (equal to registered*days completed)
  var attendanceTracked = 0; //number of sessions for each registrant in which attendance was entered
  var attended1day = 0;
  for (var i=1; i<database.length; i++) {
      if (database[i][r_eventIdIndex] === eventId) {
        totalRegistered++;
        var dbnIndex = dbns.map(function(dbn) {return dbn.dbn}).indexOf(database[i][r_dbnIndex]);
        if (dbnIndex !== -1) {
          dbns[dbnIndex].registered++;
          //iterate over the days attended cells and increment the value of each index of this dbn's attendance array every time someone attended more than 0 hours of a session.
          database[i].slice(44,44+days).forEach(function(date,index) {
            registeredSessions++;
            dbns[dbnIndex].registered_sessions++;
            if (date>0) {
              dbns[dbnIndex].attendance[index]=dbns[dbnIndex].attendance[index]+1;
              dbns[dbnIndex].sessions_attended++;
              sessionsAttended++;
              attendanceTracked++;
            } else if (date===0) {
              attendanceTracked++;
            } 
          });
          if (database[i][61]>0) {
            attended1day++;            
            dbns[dbnIndex].attended++;
          }
          dbns[dbnIndex]["atRate"] = dbns[dbnIndex].sessions_attended/dbns[dbnIndex].registered_sessions;
        }
        else {
          dbnObj = {"dbn": database[i][5],"registered": 1, "attended": 0, "attendance": [],"atRate": 0,
                    "district": database[i][58], "sessions_attended": 0, "registered_sessions": 0};
          database[i].slice(44,44+days).forEach(function(date,index) {
            registeredSessions++;
            dbnObj.registered_sessions++;
            if (date>0) {
              dbnObj.attendance[index]=1;
              dbnObj.sessions_attended++;
              sessionsAttended++;
              attendanceTracked++;
            } else if (date===0) {
              dbnObj.attendance[index]=0;
              attendanceTracked++;
            }
          });
          if (database[i][61] > 0) {
            attended1day++;
            dbnObj.attended = 1;
            dbnObj.atRate = 1;
            }
          dbns.push(dbnObj);
        }
      }  
  }
  return {"dbns": dbns.sort(function(a,b){
    if (a.registered < b.registered){return 1;}
    if (a.registered > b.registered){return -1;}
    return 0;}), "registered": totalRegistered,
          "regRate": registeredSessions,
          "sessions_attended": sessionsAttended, //previously named attended
          "attended1day": attended1day,
          "attendanceRate": sessionsAttended/(registeredSessions),
          "attendanceTrackRate": attendanceTracked/registeredSessions}
}