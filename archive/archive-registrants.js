function scheduledRegArchive() {
  var databases = SpreadsheetApp.openById("15Gv1ZbjUX2ZGSUOPBIUfDlo8jRod4DgwYoy2WLnmVoo")
                                .getSheets()
                                .map(function(sheet) {
                                  var obj = {};
                                  var data = sheet.getDataRange().getValues();
                                  data.forEach(function(row,index) {
                                    if (index===0) {obj.instance=sheet.getName()}
                                     else {
                                      obj[row[4]]=row[8];
                                    }
                                  });
                                  return obj;
                                });
  for (var i=0;i<databases.length; i++) {
      if (databases[i].borough_office !== "Static PL System")  {
          //if (databases[i].borough_office==="Office of the First Deputy Chancellor") {
            archiveRegs(databases[i]);
         // }
      }
  }
}

function archiveRegs(instance) {
  var eventsForArchiving = getEventsForArchiving(instance);
  if (eventsForArchiving.length !== 0) {
  var eventIds = eventsForArchiving.map(function(eventObj) {
    return eventObj.eventId;
  });
  var archiveSs = SpreadsheetApp.openById(instance.archive_id)
  var regSheet = SpreadsheetApp.openById(instance.database_id).getSheetByName("form registrations")
  var regData = regSheet.getDataRange().getValues();
  var archiveRegSheet = archiveSs.getSheetByName("Registrants");
  for (var i=regData.length-1;i>0; i--) {
    var eventIndex = eventIds.indexOf(regData[i][r_eventIdIndex]);
    if (eventIndex !== -1 && regData[i][r_archivedIndex] !== "archived") {
      archiveRegSheet.appendRow(regData[i]);
      eventsForArchiving[eventIndex].archivedRegistrants++;
      regSheet.deleteRow(Number(i)+1);
    }
  }
  getAttnInfo(archiveSs);
  var confirmationText = "Summary of archive registrant job:<br><br>";
  var table = "<table><tr><th>Event ID</th><th>Registered</th><th>Archived</th></tr>";
  eventsForArchiving.forEach(function(event) {
    table+="<tr><td>"+event.title+"</td><td>"+event.archivedRegistrants+"</td><td>"+event.archivedRegistrants+"</td></tr>";
  });
  table+="</table>";
  confirmationText+=table;
  MailApp.sendEmail(instance.dm_email, "Summary of Archive Registrant Job", confirmationText, {htmlBody: confirmationText, replyTo: instance.dm_email});
}
  else {
    MailApp.sendEmail(instance.dm_email, "Summary of Archive Registrant Job", "No registrants were archived today.");
  }
}

function getEventsForArchiving(instance) {
  var archivedEventsArray = [];
  var archiveEventData = SpreadsheetApp.openById(instance.archive_id).getSheetByName("Events").getDataRange().getValues();
  for (var i=1; i<archiveEventData.length;i++) {
    if (archiveEventData[i][ae_regsArchivedIndex] < archiveEventData[i][ae_registrantsIndex] && archiveEventData[i][ae_registrantsIndex] > 0) {
      archivedEventsArray.push({"eventId":archiveEventData[i][ae_eventIdIndex],
                                "title": archiveEventData[i][ae_eventIdIndex],
                                "registrants":archiveEventData[i][ae_registrantsIndex],
                                "archivedRegistrants": 0,
                                "row": Number(i)+1});
    }
  }
  Logger.log("events for archiving:")
  Logger.log(archivedEventsArray);
  return archivedEventsArray;
}

function getAttnInfo(ss) {
  var es = ss.getSheetByName("Events");
  var rs = ss.getSheetByName("Registrants");
  var ed = es.getDataRange().getValues();
  var rd = rs.getDataRange().getValues();
  for (var i=1; i<ed.length; i++) {
    var attnInfo = getDbns(ed[i][50],ed[i][84],rd,false,false);
    var strAttnInfo = JSON.stringify(attnInfo);
        if (strAttnInfo.length>=50000) {
          es.getRange(Number(i)+1,88).setValue(JSON.stringify({"dbns":[],"registered":attnInfo.registered,"regRate":attnInfo.regRate,"sessions_attended":attnInfo.sessions_attended,"attended1day":attnInfo.attended1day,"attendanceRate":attnInfo.attendanceRate,"attendanceTrackRate":attnInfo.attendanceTrackRate}));
        } else {
          es.getRange(Number(i)+1,88).setValue(strAttnInfo);
        }    
  }
}

function forceCalc() {
  getAttnInfo(SpreadsheetApp.openById("1t0lQTeXKn9HiOlbjQftUUfJW0GPtb6C94_Tv5SQ2o_I"));
}


function getDbns(eventId,days,database,districts,dbn) {
  var dbns = [];
  var dbnObj;
  if (districts) {districts = districts.map(function(dist){return dist.toString()})}
  var sessionsAttended = 0;
  var totalRegistered = 0;
  var attendanceTracked = 0;
  var attended1day = 0;
  var registeredSessions = 0; //number of people registered by the number of sessions (equal to registered*days completed)
  var attendanceTracked = 0; //number of sessions for each registrant in which attendance was entered
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
          dbnObj = {"dbn": database[i][5],"registered": 1, "attended": 0, "attendance": [],"atRate": 0, "sessions_attended": 0, "registered_sessions": 0, "district": database[i][58]};
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
          "sessions_attended": sessionsAttended,
          "attended1day": attended1day,
          "attendanceRate": sessionsAttended/(registeredSessions),
          "attendanceTrackRate": attendanceTracked/registeredSessions}
}
