function getEventData(eventId, eventData) {
  var eventObj = {
    "location": "",
    "time": "",
    "facilitatorEmails": [],
    "title": "",
    "id": eventId,
    "dates": "",
    "allFacilitators": "",
    "waitlist": false
  };
  eventData.forEach(function (row, index) {
    if (row[eventIdIndex] == eventId) {
      eventObj.title = row[displayTitleIndex];
      eventObj.location = row[locationIndex];
      row[dateIndex].toString().indexOf(",") === -1 ? eventObj.dates = row[dateIndex].toString().slice(0, 15) : eventObj.dates = row[dateIndex];
      eventObj.time = row[timesIndex];
      eventObj.otherInfo = row[otherInfoIndex];
      eventObj["eventCreatorEmail"] = row[eventCreatorIndex];
      eventObj.facilitatorEmails.push(row[firstFacEmailIndex]);

      if (row[secondFacEmailIndex] !== "") {
        eventObj.facilitatorEmails.push(row[secondFacEmailIndex]);
      }

      if (row[thirdFacEmailIndex] !== "") {
        eventObj.facilitatorEmails.push(row[thirdFacEmailIndex]);
      }

      eventObj.allFacilitators = row[facilitatorsIndex];
    }
  });
  return eventObj;
}