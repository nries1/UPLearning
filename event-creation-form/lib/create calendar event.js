function getFormattedDate(datestring, timezone) {
  return Utilities.formatDate(new Date(datestring), timezone, "EEE MMM d yyyy");
}

function createCalendarEvent(eventInfo, instance, guestList) {
  var prefix = boMap[instance].prefix;
  Logger.log(eventInfo);
  Logger.log(guestList);
  var allDates = eventInfo.dates.split(",");
  Logger.log(allDates);
  var firstDate = new Date(allDates[0].toString().trim()); //firstDate.setDate(firstDate.getDate()+1);
  //.setDate(new Date(allDates[0].toString().trim()).getDate()+1);

  Logger.log(firstDate);
  Logger.log(firstDate.getDate());
  var startTime = new Date(firstDate.getFullYear(), firstDate.getMonth(), firstDate.getDate(), Number(eventInfo.start_time.slice(0, 2)), Number(eventInfo.start_time.slice(3, 5)));
  var endTime = new Date(firstDate.getFullYear(), firstDate.getMonth(), firstDate.getDate(), Number(eventInfo.end_time.slice(0, 2)), Number(eventInfo.end_time.slice(3, 5)));
  Logger.log(startTime);
  Logger.log(endTime);

  if (guestList) {
    eventInfo.facEmails.forEach(function (f) {
      guestList.push(f);
    });
    var allGuests = guestList.join(",");
  } else {
    var allGuests = eventInfo.facEmails.join(",");
  }

  var eventDescription = "";
  eventInfo["public"] ? eventDescription = eventInfo.description + "<br><br><a href='" + eventInfo.regUrl + "'>Use this link to register for the event(s)</a>" : eventDescription = "Registration for this event is by invitation only.";
  var newEvent = CalendarApp.getCalendarsByName(props[prefix + "_calendar_name"])[0].createEventSeries(eventInfo.title, startTime, endTime, CalendarApp.newRecurrence().addDate(firstDate), {
    description: eventDescription,
    location: eventInfo.location,
    sendInvites: true,
    guests: allGuests
  });

  if (allDates.length > 1) {
    //Logger.log("adding dates");
    for (var i = 1; i < allDates.length; i++) {
      var thisDate = new Date(allDates[i].toString().trim()); //thisDate.setDate(thisDate.getDate()+1);

      newEvent.setRecurrence(CalendarApp.newRecurrence().addDate(thisDate), startTime, endTime);
    }
  }

  return newEvent.getId();
}

function testCal() {
  Logger.log(CalendarApp.getCalendarsByName("BK South Professional Learning Calendar")[0].getEventById("jdluenjjs0hgflmeh7d4qc5r4o@google.com").getStartTime());
  /*var start_time = "11:25";
  var end_time = "13:30";
  var dates = ["Tue Jun 11 2019"];
  var firstDate = new Date(dates[0]);
  var startTime = new Date(firstDate.getFullYear(),firstDate.getMonth(),firstDate.getDate(),Number(start_time.slice(0,2)),Number(start_time.slice(3,5)));
  Logger.log(startTime);*/
}