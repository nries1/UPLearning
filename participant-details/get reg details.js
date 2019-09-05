function Participant(participantArray,sessions,archive) {
  this.fName = participantArray[r_firstNameIndex];
  this.lName = participantArray[r_lastNameIndex];
  this.email = participantArray[r_emailIndex];
  if (participantArray[r_wantsCtleIndex]!=="") {
    if (participantArray[r_wantsCtleIndex].indexOf("Yes")!==-1) {
      this.ctle = "Yes";
      var wantsCtle = "Yes"
    } else {
      this.ctle = "No";
      var wantsCtle = "No"
    }
  } else {
      this.ctle = participantArray[r_wantsCtleIndex];
      var wantsCtle = "N/A";
  }
  this.more_info = [{label: "Role", value: participantArray[r_roleIndex]},
                    {label: "Comfort Level w. Subject", value: participantArray[r_comfortIndex]},
                    {label: "Learning Goal", value: participantArray[r_goalsIndex]},
                    {label: "Hours Attended", value: participantArray[r_hoursAttendedIndex]},
                    {label: "Experience", value: participantArray[r_experienceIndex]},
                    {label: "Wants CTLE", value: wantsCtle},
                    {label: "Confirmation Code", value: participantArray[r_idIndex]}
                   ];
  if (archive==="archived") {
    if (participantArray[64] && participantArray[64]!=="") {
      if (participantArray[64].indexOf("Sent")!==-1) {
        this.more_info.push({label: "Received CTLE", value: participantArray[64]});
      }
    } else  {
      this.more_info.push({label: "Received CTLE", value: "No"});
    }
  }
  this.attendanceArray = [];
  for (var x=0;x<sessions;x++) {
      this.attendanceArray.push(participantArray[44+Number(x)]);
  }
  this.dbn = participantArray[r_dbnIndex];
  this.role = participantArray[r_roleIndex];
  this.experience = participantArray[r_experienceIndex];
  this.goals = participantArray[r_goalsIndex];
  this.comfortLevel = participantArray[r_comfortIndex];
  this.eventName = participantArray[r_eventTitleIndex].slice(8,participantArray[r_eventTitleIndex].length)
  this.id = participantArray[r_idIndex];
  this.attendance = participantArray[r_hoursAttendedIndex];
  this.edit_link = participantArray[43];
  if (archive==="archived") {
    if (participantArray[r_sentCtleIndex]==="") {
      this.sent_ctle="Not sent"
    } else if (participantArray[r_sentCtleIndex].toString().toLowerCase().indexOf("sent")!==-1) {
      this.sent_ctle = "Sent"
    }
  } else {
    this.sent_ctle = "N/A"
  }
  this.bday = participantArray[16];
  this.bmonth = participantArray[15];
  this.byear = participantArray[17];
  this.ssnum = participantArray[14];
  this.hours_attended = participantArray[r_hoursAttendedIndex]
}

function getRegDetails(eventId,instance,archive,sessions) {
  var p1; var p2;
  Logger.log(instance);
  var prefix = boMap[instance].prefix;
  if (instance==="Queens South PL System Beta") {
    var prefix = "qs";
    var rcss = SpreadsheetApp.openById(props[prefix+"_reg_data_id"]);
    var regData = rcss.getSheetByName("form registrations").getDataRange().getValues();
  } else {
    var prefix = boMap[instance].prefix;
    if (archive==="archived") {
      var regData = SpreadsheetApp.openById(props[prefix+"_archive_id"]).getSheetByName("Registrants").getDataRange().getValues();
    } else {
      var regData = SpreadsheetApp.openById(props[prefix+"_database_id"]).getSheetByName("form registrations").getDataRange().getValues();
    }
  }
  var regDetailsObj = {"participants": [], "waitlist": 0, "sent_ctle": "N/A"}
  for (var i=0; i<regData.length; i++) {
    if (regData[i][r_eventIdIndex] === eventId && (regData[i][r_waitlistIndex] === "standard" || regData[i][r_waitlistIndex] === "Waitlist" || regData[i][r_waitlistIndex] === "Added by Facilitator")) {
      regDetailsObj["participants"].push(new Participant(regData[i],sessions,archive));
      if (regData[i][r_waitlistIndex] == "Waitlist") {
        regDetailsObj["participants"][regDetailsObj["participants"].length-1]["waitlist"] = true
        regDetailsObj.waitlist++;
      }
      else {regDetailsObj["participants"][regDetailsObj["participants"].length-1]["waitlist"] = false;}
    } 
  }
  var avgComfortLevel = regDetailsObj.participants.reduce(function(sum,participantObject) {
    return sum+=participantObject.comfortLevel;
  },0)/regDetailsObj.participants.length;
  regDetailsObj["avgComfortLevel"] = avgComfortLevel.toFixed(1);
  try{
  regDetailsObj.participants = regDetailsObj.participants.sort(function(person1,person2) {
    p1=person1; p2=person2
    var dbn1 = person1.dbn.slice(0,2);
    var dbn2 = person2.dbn.slice(0,2);
    var name1 = person1.lName.toUpperCase();
    var name2 = person2.lName.toUpperCase();
    if (dbn1 < dbn2) {
      return -1;
    }
    if (dbn1 > dbn2) {
      return 1;
    }
    if (name1 < name2) {
      return -1;
    }
    if (name1 > name2) {
      return 1;
    }
    return 0;
  });
  }
  catch(error) {Logger.log(p1);
               Logger.log(p2);
               Logger.log(error);}
  return JSON.stringify(regDetailsObj);
}