/*var Event = function (values, headers) {
  for (var i=0; i<headers.length; i++) {
    this.headers[i]=values[i];
  }
}*/
//get all of the events associated witht the IDs in the events parameter.
//return an array containing objects for each event
function getEventDetails(events,instance) {
  Logger.log(instance);
  var prefix = boMap[instance].prefix;
  if (instance === "Queens South PL System Beta") {
    var eventData = SpreadsheetApp.openById(props[prefix+"_event_data_id"]).getSheetByName("event creation form responses").getDataRange().getValues();
  } else {
    var eventData = SpreadsheetApp.openById(props[prefix+"_database_id"]).getSheetByName("event creation form responses").getDataRange().getValues();    
  }
  var eventDetails = [];
  var eventIds = events.map(function(eventObj) {
    return eventObj.eventId;
  });
  for (var i=0; i<eventData.length; i++) {
    var eventIndex = eventIds.indexOf(eventData[i][idIndex])
    if (eventIndex !== -1) {
      eventDetails.push(new Event(eventData[i],events[eventIndex].participant_id));
    }
  }
  Logger.log(eventDetails);
  return eventDetails;
}

function Event(eventData, participantId) {
      this.participant_id = participantId;
      this["division"] = eventData[divisionIndex];
      this["title"] = eventData[titleIndex];
      this["description"] = eventData[descriptionIndex];
      this["location"] = eventData[locationIndex]
      this["content"] = eventData[contentIndex];
      this["audience"] = eventData[audienceIndex];
      this["firstDate"] = eventData[dateIndex].toString().slice(0,15);
      eventData[dateIndex].toString().length <= 40 ? this["dates"] = eventData[dateIndex].toString().slice(0,3)+"<span style='color: #f05537;'>"+eventData[dateIndex].toString().slice(3,10)+"</span>"+eventData[dateIndex].toString().slice(10,15) :  this["dates"] = eventData[dateIndex].toString().slice(0,3)+"<span style='color: #f05537;'>"+eventData[dateIndex].toString().slice(3,10)+"</span>"+eventData[dateIndex].toString().slice(10,15)+" <span style='color: #f05537;'>through</span> "+eventData[dateIndex].slice(eventData[dateIndex].length-15,eventData[dateIndex].length-12)+"<span style='color: #f05537;'>"+eventData[dateIndex].slice(eventData[dateIndex].length-12,eventData[dateIndex].length-5)+"</span>"+eventData[dateIndex].slice(eventData[dateIndex].length-5,eventData[dateIndex].length);
      eventData[dateIndex].toString().match((/,/g)||[])===null ? this["numDates"] = "<span style='color: #f05537;'>single date</span> on " : this["numDates"] = "<span style='color: #f05537;'>"+(eventData[dateIndex].toString().match(/,/g).length+1)+" dates</span> from ";
      eventData[dateIndex].toString().length <= 40 ? this["allDates"] = eventData[dateIndex].toString().slice(0,15) : this["allDates"] = eventData[dateIndex].toString();
      this["grade"] = eventData[gradeIndex];
      this["regForm"] = eventData[regFormIndex];
      this["regFlyer"] = eventData[regFlyerIndex];
      this["districts"] = eventData[districtsIndex];
      this["id"] = eventData[idIndex];
      this["times"] = eventData[timesIndex];
      eventData[maxRegistrantsIndex] - eventData[currentRegistrantsIndex] <= 5 ? this["closingSoon"] = "event is almost full" : this["closingSoon"] = "";
      eventData[maxRegistrantsIndex] - eventData[currentRegistrantsIndex] <= 5 ? this["registrants"] = "<span style='color: red;'>"+eventData[currentRegistrantsIndex]+"/"+eventData[maxRegistrantsIndex]+"</span>" : this["registrants"] = "<span style='color: green;'>"+eventData[currentRegistrantsIndex]+"/"+eventData[maxRegistrantsIndex]+"</span>"
      this["facilitators"] = eventData[facilitatorsIndex]
      this["otherInfo"] = eventData[otherInfoIndex]
      this["facilitatorContact"] = "Contact "+eventData[firstFacIndex]+" at "+eventData[firstFacEmailIndex];
      this.ctle_eligible = eventData[32];  
      this.event_page = eventData[55];
}