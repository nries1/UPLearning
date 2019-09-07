function activateEvent(eventid, instance) {
  var out = {
    success: false,
    msg: ""
  };
  var prefix = boMap[instance].prefix;
  var mainDb = SpreadsheetApp.openById(props[prefix + "_database_id"]);
  var archiveDb = SpreadsheetApp.openById(props[prefix + "_archive_id"]);
  var mainEventsSheet = mainDb.getSheetByName("event creation form responses");
  var mainRegSheet = mainDb.getSheetByName("form registrations");
  var archiveEventSheet = archiveDb.getSheetByName("Events");
  var archiveRegSheet = archiveDb.getSheetByName("Registrants");
  var archiveEventData = archiveEventSheet.getDataRange().getValues();
  var archiveRegData = archiveRegSheet.getDataRange().getValues();
  var event = [];
  var registrants = [];

  for (var i = 0; i < archiveEventData.length; i++) {
    if (archiveEventData[i][50] === eventid) {
      event.push(archiveEventData[i]);
      event[0].pop();
      event[0].pop();
      archiveEventSheet.deleteRow(Number(i) + 1);
      break;
    }
  }

  for (var j = archiveRegData.length - 1; j > 0; j--) {
    if (archiveRegData[j][18] === eventid) {
      registrants.push(archiveRegData[j]);
      registrants[registrants.length - 1].pop();
      registrants[registrants.length - 1].pop();
      archiveRegSheet.deleteRow(Number(j) + 1);
    }
  }

  try {
    mainEventsSheet.appendRow(event[0]);
    registrants.forEach(function (reg) {
      mainRegSheet.appendRow(reg);
    });
  } catch (err) {
    event[0].push('=COUNTIF(Registrants!S:S,AY' + Number(archiveEventSheet.getLastRow() + 1) + ')');
    event[0].push(0);
    archiveEventSheet.appendRow(event[0]);
    registrants.forEach(function (reg) {
      archiveRegSheet.appendRow(reg);
    });
    out.msg = err;
    return out;
  }

  out.success = true;
  out.msg = "Activated event " + eventid + " and restored " + registrants.length + " registrants";
  return out;
}