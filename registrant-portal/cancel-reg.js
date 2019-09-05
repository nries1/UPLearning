function cancelRegistration(email,eventId,instance) {
  var prefix = boMap[instance].prefix;
  if (instance === "Queens South PL System Beta") {
    var regSheet = SpreadsheetApp.openById(props[prefix+"_reg_data_id"]).getSheetByName("form registrations")
    var regData = regSheet.getDataRange().getValues();
  } else {
    var regSheet = SpreadsheetApp.openById(props[prefix+"_database_id"]).getSheetByName("form registrations")
    var regData = regSheet.getDataRange().getValues();  
  }
  var errorThrown;
  var foundParticipant;
  var hasAttendance;
  var returnMsg = "";
  for (var i=0; i<regData.length; i++) {
    if (regData[i][r_emailIndex].toString().toLowerCase() === email && regData[i][r_eventIdIndex] === eventId) {
      var eventName = regData[i][r_eventTitleIndex];
      var fName = regData[i][r_fNameIndex];
      var lName = regData[i][r_lNameIndex];
        if (regData[i][r_hoursAttendedIndex] === 0) {
          regSheet.getRange(Number(i)+1,Number(r_eventIdIndex)+1).setValue(regData[i][r_eventIdIndex]+"-cancel");
          try {
           var body = "<div>Dear "+fName+" "+lName+",<br><br>This is an automated message confirming that your registration for the event, "+eventName+", has been canceled.<br><br>Sincerely,<br>"+emailSignature+"</div>";
           MailApp.sendEmail(email, "Registration Canceled", body, {htmlBody: body})           
          } catch(error) {Logger.log(error)} 
          foundParticipant = true;
          break;
        }
        else {
          hasAttendance = true;
          break;
        }
    }
  }
  if (hasAttendance) {return "It looks like you have already attended at least one of the sessions for this professional learning opportunity. You cannot cancel your registration once your event has begun and you have attended at least once."}
  if (!foundParticipant) {return "Couldn't find that registration."}
  return "Your registration has been canceled";
}
