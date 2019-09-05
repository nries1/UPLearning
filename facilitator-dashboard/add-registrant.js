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