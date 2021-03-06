function postToArchive(eventid, instance, sy) {
  var prefix = boMap[instance].prefix;
  var mainDb = SpreadsheetApp.openById(props[prefix+"_database_id"]);
  if (sy==="current") {
    var archiveDb = SpreadsheetApp.openById(props[prefix+"_archive_id"]);
  } else {
    var archiveDb = SpreadsheetApp.openById(props[prefix+"_"+sy]);
  }
  var eventSheet = mainDb.getSheetByName("event creation form responses");
  var eventData = eventSheet.getDataRange().getValues();
  var regSheet = mainDb.getSheetByName("form registrations");
  var regData = regSheet.getDataRange().getValues();
  var archiveEventSheet = archiveDb.getSheetByName("Events");
  var archiveRegSheet = archiveDb.getSheetByName("Registrants");
  var event = [];
  var registrants = [];
  // find and delete the event and its registrants
  for (var i=0; i<eventData.length; i++) {
    if (eventData[i][50] === eventid) {
      var thisEvent = eventData[i];
      thisEvent.push('=COUNTIF(Registrants!S:S,AY'+Number(archiveEventSheet.getLastRow()+1)+')')
      thisEvent.push(0);
      event.push(thisEvent);
      eventSheet.deleteRow(Number(i)+1)
      break;
    }
  }
  for (var j=regData.length-1; j>0; j--) {
    if (regData[j][18] === eventid) {
      registrants.push(regData[j]);
      regSheet.deleteRow(Number(j)+1);
    }
  }
  //append the event and its registrants to the archive
  try {
    archiveEventSheet.appendRow(event[0]);
    registrants.forEach(function(registrant) {
      archiveRegSheet.appendRow(registrant);
    });
    return {success: true, msg: "Event ID "+eventid+" was archived along with "+registrants.length+" registrants."}
  }
  //roll back the deletions if you're unable to append the data to the archive.
  catch(err) {
    event.pop();
    event.pop();
    eventSheet.appendRow(event[0])
    registrants.forEach(function(registrant) {
      regSheet.appendRow(registrant);
    });
    return {success: false, msg: err}
  }
}

function debug() {
  postToArchive("999MS19", "Brooklyn South PL System", "current");
}