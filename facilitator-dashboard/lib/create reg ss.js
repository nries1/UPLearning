function createRegSs(events, instance) {
  Logger.log(instance);
  Logger.log(events[0]);
  var prefix = boMap[instance].prefix;
  var eventsData = [["Event ID", "Event Title", "Sessions", "Registered", "Registered Sessions", "Attended", "Sessions Attended", "Attendance Rate", "Attendance Track Rate"]];
  var newSs = SpreadsheetApp.openById(DriveApp.getFileById("1IDlWZ5vohb3be8PEUXxb9Y_vMx0YYux4SK1sp0Cn7Wc").makeCopy("Registrant info Report on " + new Date()).getId());
  var data = [["Event ID", "Event Title", "Sessions", "DBN", "Registered", "Attended Session 1", "Attended Session 2", "Attended Session 3", "Attended Session 4", "Attended Session 5", "Attended Session 6", "Attended Session 7", "Attended Session 8", "Attended Session 9", "Attended Session 10", "Attended Session 11"]];
  events.forEach(function (event, index) {
    var eventRow = [];
    eventRow.push(event.id, event.title, event.countDates, event.attendanceInfo.registered, event.attendanceInfo.regRate, event.attendanceInfo.attended1day, event.attendanceInfo.sessions_attended, event.attendanceInfo.attendanceRate || "NULL", event.attendanceInfo.attendanceTrackRate || "NULL");
    eventsData.push(eventRow);

    if (!event.attendanceInfo.dbns) {
      return;
    }

    event.attendanceInfo.dbns.forEach(function (dbn) {
      var dbnRow = [];
      dbnRow.push(event.id);
      dbnRow.push(event.title);
      dbnRow.push(event.countDates);
      dbnRow.push(dbn.dbn);
      dbnRow.push(dbn.registered);

      for (var i = 0; i < 11; i++) {
        if (dbn.attendance[i] || dbn.attendance[i] === 0) {
          dbnRow.push(dbn.attendance[i]);
        } else {
          dbnRow.push("N/A");
        }
      }

      data.push(dbnRow);
    });
  });
  newSs.getSheets()[0].setName("Registrants").getRange(1, 1, data.length, data[0].length).setValues(data);
  newSs.insertSheet("Events", 1).getRange(1, 1, eventsData.length, eventsData[0].length).setValues(eventsData);
  DriveApp.getFileById(newSs.getId()).setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.EDIT);
  return newSs.getUrl();
}