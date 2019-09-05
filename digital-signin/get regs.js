function Participant(participantArray,dateIndex) {
  this.fName = participantArray[r_firstNameIndex];
  this.lName = participantArray[r_lastNameIndex];
  this.email = participantArray[r_emailIndex];
  this.dbn=participantArray[5];
  if (participantArray[r_date1AttnIndex+dateIndex]!=="") {
    this.signed_in=true;
  } else {
    this.signed_in=false;    
  }
  if (participantArray[r_wantsCtleIndex]!=="") {
    if (participantArray[r_wantsCtleIndex].indexOf("Yes")!==-1) {
      this.ctle = "Yes";
      var wantsCtle = "Yes"
      if (participantArray[r_date1AttnIndex+dateIndex] >0 && participantArray[r_date1AttnIndex+dateIndex]!=="") {
        this.completed_sign_out=true;
      }
    } else {
      this.ctle = "No";
      var wantsCtle = "No"
    }
  } else {
      this.ctle = participantArray[r_wantsCtleIndex];
      var wantsCtle = "N/A";
  }
  this.eventName = participantArray[r_eventTitleIndex].slice(8,participantArray[r_eventTitleIndex].length)
  this.id = participantArray[r_idIndex];
}

function getRegDetails(eventId,instance,dateIndex) {
  var p1; var p2;
  Logger.log(instance);
  var prefix = boMap[instance].prefix;
  if (instance==="Queens South PL System Beta") {
    var prefix = "qs";
    var rcss = SpreadsheetApp.openById(props[prefix+"_reg_data_id"]);
    var regData = rcss.getSheetByName("form registrations").getDataRange().getValues();
  } else {
    var prefix = boMap[instance].prefix;
    var regData = SpreadsheetApp.openById(props[prefix+"_database_id"]).getSheetByName("form registrations").getDataRange().getValues();
  }
  var regDetails = []
  for (var i=0; i<regData.length; i++) {
    if (regData[i][18] === eventId && (regData[i][63] === "standard" || regData[i][63] === "Waitlist" || regData[i][63] === "Added by Facilitator")) {
      regDetails.push(new Participant(regData[i],dateIndex));
    } 
  }
  return JSON.stringify(regDetails);
}