function getNotes(instance, eventid, status) {
  Logger.log(instance);
  var prefix = boMap[instance].prefix;
  var out = {
    sessions: [],
    facilitators: [],
    audience: "",
    title: "",
    borough_office: props[prefix + "_borough_office"],
    division: "",
    registered: 0,
    attended: 0
  };

  if (status === "active") {
    var database = SpreadsheetApp.openById(props[prefix + "_database_id"]);
    var eventData = database.getSheetByName("event creation form responses").getDataRange().getValues();
  } else {
    var archiveSheet = SpreadsheetApp.openById(props[prefix + "_archive_id"]);
    var eventData = archiveSheet.getSheetByName("Events").getDataRange().getValues();
  }

  for (var i = 0; i < eventData.length; i++) {
    if (eventData[i][50] === eventid) {
      out.facilitators = eventData[i][70];
      out.audience = eventData[i][36];
      out.title = eventData[i][2];
      out.division = eventData[i][15];
      out.registered = eventData[i][85];
      out.resource_folder = eventData[i][34];

      for (var j = 58; j < 69; j++) {
        if (eventData[i][j] !== "") {
          Logger.log(eventData[i][j]);
          var session = JSON.parse(eventData[i][j]);
          session.date = Utilities.formatDate(new Date(session.date), "GMT+4:00", "MM/dd/yyy");
          out.sessions.push(session);
        }
      }

      return JSON.stringify(out);
    }
  }

  return false;
}