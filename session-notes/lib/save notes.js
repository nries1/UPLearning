function saveNotes(notes, instance, eventid, sessionNumber, status) {
  Logger.log(instance);
  Logger.log(sessionNumber);
  var prefix = boMap[instance].prefix;

  if (status === "active") {
    var eventSheet = SpreadsheetApp.openById(props[prefix + "_database_id"]).getSheetByName("event creation form responses");
    var eventData = eventSheet.getDataRange().getValues();
  } else {
    var eventSheet = SpreadsheetApp.openById(props[prefix + "_archive_id"]).getSheetByName("Events");
    var eventData = eventSheet.getDataRange().getValues();
  }

  for (var i = 0; i < eventData.length; i++) {
    if (eventData[i][50] === eventid) {
      var session = JSON.parse(eventData[i][58 + Number(sessionNumber - 1)]);
      session.title = notes.title;
      session.admin_notes = notes.admin_notes;
      session.school_notes = notes.school_notes;
      eventSheet.getRange(Number(i) + 1, 59 + Number(sessionNumber - 1)).setValue(JSON.stringify(session));
    }
  }
}