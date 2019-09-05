//search the registrant database for the email address provided.
//collect the event Ids associated with the email
//return an array of event Ids
function getEventIds(email,instance) {
  Logger.log(instance);
  var events = [];
  var prefix = boMap[instance].prefix;
  if (instance === "Queens South PL System Beta") {
    var regData = SpreadsheetApp.openById(props[prefix+"_reg_data_id"]).getSheetByName("form registrations").getDataRange().getValues();
  } else {
    var regData = SpreadsheetApp.openById(props[prefix+"_database_id"]).getSheetByName("form registrations").getDataRange().getValues();
  }
  for (var i=0; i<regData.length; i++) {
    if (regData[i][r_emailIndex].toLowerCase() === email.toLowerCase() && regData[i][r_eventIdIndex].indexOf("cancel")===-1 && regData[i][r_emailConfStatusIndex] !== "Waitlist" && regData[i][r_emailConfStatusIndex] !== "excess") {
      events.push({"eventId": regData[i][r_eventIdIndex], "participant_id": regData[i][r_participantIdIndex], "email": email})
    }
  }
  return events;
}