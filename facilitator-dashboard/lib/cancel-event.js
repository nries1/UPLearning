function cancelEvent(eventId, instance) {
  if (instance === "Queens South PL System Beta") {
    var prefix = "qs";
    var ecss = SpreadsheetApp.openById(props[prefix + "_event_data_id"]);
    var eventCreationSheet = ecss.getSheetByName("event creation form responses");
    var eventCreationData = eventCreationSheet.getDataRange().getValues();
  } else {
    var prefix = boMap[instance].prefix;
    var eventCreationSheet = SpreadsheetApp.openById(props[prefix + "_database_id"]).getSheetByName("event creation form responses");
    var eventCreationData = eventCreationSheet.getDataRange().getValues();
  }

  var rowDeleted = false;
  var eventObj = {
    "eventName": "",
    "eventId": eventId,
    "message": ""
  };

  for (var i = 0; i < eventCreationData.length; i++) {
    Logger.log(eventCreationData[i][eventIdIndex]);

    if (eventCreationData[i][eventIdIndex] === eventId) {
      if (eventCreationData[i][regFlyerIdIndex] != "") {
        try {
          DriveApp.removeFile(DriveApp.getFileById(eventCreationData[i][regFlyerIdIndex]));
        } catch (error) {
          Logger.log(error);
        } finally {}
      }

      if (eventCreationData[i][calendarEventIdIndex] != "no calendar event created" && eventCreationData[i][calendarEventIdIndex] != "") {
        try {
          CalendarApp.getCalendarsByName(props[prefix + "calendar_name"])[0].getEventById(eventCreationData[i][calendarEventIdIndex]).deleteEvent();
        } catch (error) {
          Logger.log(error);
        } finally {}
      }

      if (eventCreationData[i][attendanceFolderIndex] != "") {
        try {
          DriveApp.getFoldersByName(eventId).next().setTrashed(true);
        } catch (error) {
          Logger.log(error);
        } finally {}
      }

      eventObj.eventName = eventCreationData[i][2];
      eventCreationSheet.deleteRow(Number(i) + 1);
      rowDeleted = true;
      break;
    }
  }

  Logger.log(eventObj);
  return rowDeleted ? eventObj : false;
}