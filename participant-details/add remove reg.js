function addRegistrant(id,instance) {
  Logger.log(id);
  if (instance==="Queens South PL System Beta") {
    var prefix = "qs";
    var ecss = SpreadsheetApp.openById(props[prefix+"_event_data_id"]);
    var rcss = SpreadsheetApp.openById(props[prefix+"_reg_data_id"]);
    var eventCreationData = ecss.getSheetByName("event creation form responses").getDataRange().getValues();
    var regData = rcss.getSheetByName("form registrations").getDataRange().getValues();
  } else {
    var prefix = boMap[instance].prefix;
    var database = SpreadsheetApp.openById(props[prefix+"_database_id"]);
    var regSheet = database.getSheetByName("form registrations")
    var regData = regSheet.getDataRange().getValues();
    var eventCreationData = database.getSheetByName("event creation form responses").getDataRange().getValues(); 
  }    
  var participantObj = {};
  var foundParticipant;
  var returnMsg = "";
  for (var i=regData.length-1; i>0; i--) {
    if (regData[i][r_idIndex] === id) {
      var event = getEventData(regData[i][r_eventIdIndex],eventCreationData);
      participantObj["fName"] = regData[i][r_firstNameIndex];
      participantObj["lName"] = regData[i][r_lastNameIndex];
      participantObj["email"] = regData[i][r_emailIndex];
      participantObj["id"] = regData[i][r_idIndex];
      foundParticipant = true;
      var regRow = Number(i)+1;
      break;
    }
  }
  if (foundParticipant) {
    Logger.log("found participant");
    try {
      returnMsg = emailConfirmation(participantObj, event, instance);
      regSheet.getRange(regRow,r_waitlistIndex+1).setValue("Added by Facilitator");
      returnMsg="Registrant added";
      return returnMsg;
    }
    catch(error) {
      return error;
    }
    finally {
    }
  }
  if (!foundParticipant) {
    return "Couldn't find that participant's id in the registrant database.";
  }
}

function removeRegistrant(id,instance) {
  var prefix = boMap[instance].prefix;
  var regSheet = SpreadsheetApp.openById(props[prefix+"_database_id"]).getSheetByName("form registrations");
  var regData = regSheet.getDataRange().getValues();
  var participantObj = {};
  var foundParticipant;
  var returnMsg = "";
  for (var i=regData.length-1; i>0; i--) {
    if (regData[i][r_idIndex] === id) {
      regSheet.getRange(Number(i)+1,r_eventIdIndex+1).setValue(regData[i][r_eventIdIndex]+"-cancel");
      foundParticipant = true;
      break;
    }
  }
  if (foundParticipant) {
    return "Registration canceled successfully";
  }
  if (!foundParticipant) {
    return "Couldn't find that participant";
  }  
}

function getEventData(eventId,eventData) {
  var eventObj = {"location": "", "time": "", "facilitatorEmails": [], "title": "", "id": eventId, "dates": "", "allFacilitators": "", "waitlist": false}
  eventData.forEach(function(row,index) {
    if (row[eventIdIndex]==eventId) {
      eventObj.title = row[displayTitleIndex];
      eventObj.location = row[locationIndex];
      row[dateIndex].toString().indexOf(",") === -1 ? eventObj.dates = row[dateIndex].toString().slice(0,15) : eventObj.dates = row[dateIndex];
      eventObj.time = row[timesIndex];
      eventObj.otherInfo = row[otherInfoIndex];
      eventObj["eventCreatorEmail"] = row[eventCreatorIndex]
      eventObj.facilitatorEmails.push(row[firstFacEmailIndex]);
      if (row[secondFacEmailIndex] !== "") {eventObj.facilitatorEmails.push(row[secondFacEmailIndex]);}
      if (row[thirdFacEmailIndex] !== "") {eventObj.facilitatorEmails.push(row[thirdFacEmailIndex]);}
      eventObj.allFacilitators = row[facilitatorsIndex];
    }
  });
  return eventObj;
}

function emailConfirmation(participant,event,instance) {
  if (instance === "Queens South PL System Beta") {
    var prefix = "qs"
    } else {
  var prefix = boMap[instance].prefix;
    }
  var errorMsg = "";
  var subject = "Auto-confirmation for "+event.title;
  var emailBody = "<div style='background-color: aliceblue; font-size: 1.4em;'><br><br><p>Dear "+participant.fName+" "+participant.lName+",<br><br>\
Thank you for registering for a professional learning opportunity \
offered by the NYCDOE.<br><br><strong>Your confirmation code is: "+participant.id+"</strong><br><br>You may visit the <a target=_blank href='"+props[prefix+"_embedded_registrant_portal"]+"'>"+instance+"</a> at any time \
to view up to date information on all of the events to which you are currently registered and, if necessary, to cancel your registration.<br><br>Here are your event details:<br>\
<strong>Session Title:</strong> "+event.title+"<br>\
<strong>Session ID: </strong>"+event.id+"<br>\
<strong>Location:</strong> "+event.location+"<br>\
<strong>Date(s):</strong> "+event.dates+"<br>\
<strong>Times:</strong> "+event.time+"<br><br>\
<strong>Other Information for Participants: </strong>"+event.otherInfo+"<br>\
<strong>Facilitators:</strong> "+event.allFacilitators+"<br><br>\
<strong>Questions about your event? </strong> reply to this email to contact your facilitator.\
 We look forward to seeing you at the event!<br><br><br><br></div>"
 try {
   MailApp.sendEmail(participant.email, subject, emailBody, {htmlBody: emailBody, replyTo: event.eventCreatorEmail})
 }
  catch(error) {
    errorMsg = error;
  }
  finally {
    return errorMsg === "" ?
      "An email confirmation was sent to "+participant.email
    :
      errorMsg;
  } 
}