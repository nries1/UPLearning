function sendCtleAffinity() {sendCtle(new Database(Sheet("Affinity PL System")));}
function sendCtleBKN() {sendCtle(new Database(Sheet("Brooklyn North PL System")));}
function sendCtleBKS() {sendCtle(new Database(Sheet("Brooklyn South PL System")));}
function sendCtleBronx() {sendCtle(new Database(Sheet("Bronx PL System")));}
function sendCtleCentral() {sendCtle(new Database(Sheet("Central PL System")));}
function sendCtleManhattan() {sendCtle(new Database(Sheet("Manhattan PL System")));}
function sendCtleQueensNorth() {sendCtle(new Database(Sheet("Queens North PL System")));}
function sendCtleQueensSouth() {sendCtle(new Database(Sheet("Queens South PL System")));}
function sendCtleSI() {sendCtle(new Database(Sheet("Staten Island PL System")));}

function Sheet(instance) {
  return SpreadsheetApp.openById("15Gv1ZbjUX2ZGSUOPBIUfDlo8jRod4DgwYoy2WLnmVoo").getSheetByName(instance).getDataRange().getValues();
}

function Database(data) {
  for (var i=0; i<data.length; i++) {
    this[data[i][4]]=data[i][8];
  }
}

function sendCtle(instance) {
  Logger.log("sending ctle for "+instance.borough_office)
  var archiveSs = SpreadsheetApp.openById(instance.archive_id); var archiveRegSheet = archiveSs.getSheetByName("Registrants");
  var archiveEventSheet = archiveSs.getSheetByName("Events"); var archiveRegData = archiveRegSheet.getDataRange().getValues();
  var archiveEventData = archiveEventSheet.getDataRange().getValues();
  var participantObj = []; var eventObj = []; var missingInfoList = []; var errors = ["none"]; var ctleSent = 0; var ctleUnsent = 0; var currentRow = 0;
  var today = new Date();
  //2) filter for events that offer ctle and haven't had certs sent yet
  for (var n=archiveEventData.length-1; n>0; n--) {
    if (archiveEventData[n][ae_ctleTypeIndex] !== "This offering is NOT CTLE eligible"
        &&
        archiveEventData[n][ae_regsArchivedIndex]  - archiveEventData[n][ae_ctleSentIndex] > 0
        &&
        archiveEventData[n][ae_ctleTypeIndex] !== "CTLE eligible, but certificate issued by NON-FSC office") {
      eventObj.push({
        "location": archiveEventData[n][ae_locationIndex],
        "gradeBand": archiveEventData[n][ae_gradeBandIndex],
        "ctleType": archiveEventData[n][ae_ctleTypeIndex],
        "eventStart": archiveEventData[n][ae_eventStartIndex],
        "eventDivision": archiveEventData[n][ae_divisionIndex],
        "id": archiveEventData[n][ae_eventIdIndex],
        "duration": archiveEventData[n][53]})
    }
  }
  
  //3) if there are certs ready to send, then loop over the reg archives to collect the info for registrants that need ctle sent
  for (var i in eventObj) {
    for (var k=archiveRegData.length-1; k>0; k--) {
      var hoursAttended = archiveRegData[k][ar_hoursAttendedIndex];
      if (archiveRegData[k][ar_eventIdIndex] === eventObj[i].id
          && archiveRegData[k][ar_wantsCtleIndex].indexOf("Yes") !== -1
          && archiveRegData[k][ar_ctleSentIndex].indexOf("Sent") === -1
          && hoursAttended > 0) {
            var ssNum = "";
            if (archiveRegData[k][ar_ssNumIndex] !== "") { for (var x=4-archiveRegData[k][ar_ssNumIndex].toString().length; x>0; x--){ssNum+="0"}}
            if (archiveRegData[k][ar_ssNumIndex] !== "") {ssNum+=archiveRegData[k][ar_ssNumIndex];}
            if (hoursAttended>eventObj.duration) {hoursAttended=Number(duration).toPrecision(1)}
            participantObj.push({"ctleId": eventObj[i].id+"-"+archiveRegData[k][ar_pIdIndex],"id": archiveRegData[k][ar_pIdIndex],
                             "eventId": eventObj[i].id,"eventLocation": eventObj[i].location,
                             "eventStart": eventObj[i].eventStart,"eventDivision": eventObj[i].eventDivision,
                             "eventCtleType": eventObj[i].ctleType,"eventGradeBand": eventObj[i].gradeBand,
                             "fName": archiveRegData[k][ar_fNameIndex],"lName": archiveRegData[k][ar_lNameIndex],
                             "email": archiveRegData[k][ar_emailIndex],"ss-num": ssNum,
                             "birth-month": archiveRegData[k][ar_bMonthIndex],"birth-day": archiveRegData[k][ar_bDayIndex],
                             "birth-year": archiveRegData[k][ar_bYearIndex],"rowNum": Number(k)+1,
                             "hoursAttended": hoursAttended,"eventName": archiveRegData[k][ar_eventNameIndex].slice(8,archiveRegData[k][ar_eventNameIndex].length),
                             "missingInfo": function() {
                                var missing = [];
                                var keys = Object.keys(this);
                                for (var i in keys) {
                                  if (this[keys[i]] === "") {
                                    missing.push(keys[i]);
                                  }
                                }
                               return missing.length > 0 ? missing : false;
                              }
      })
    }
    }
  }
  //4) If there are partcipants who need certs, pass the collected participant and event info to the
  // createCtle function and email the result of that function call to each participant.
  participantObj.forEach(function(participant,index) {
    if (participant.missingInfo()) {missingInfoList.push(participant); return;}
      //var ctleDoc = `CtleDoc(participant,instance);
      var ctleDoc = createCtle(participant,instance);
      var body = "Dear "+participant.fName+" "+participant.lName+",<br><br>Attached on this emaill, please find a copy of your CTLE certificate, which you earned by attending an eligible event hosted by the "+instance.borough_office+". For additional information on CTLE and other certification issues, visit: http://www.highered.nysed.gov/tcert.<br><br>Sincerely,<br>Professional Learning Support<br>New York City Department of Education";
        try {
          MailApp.sendEmail(participant.email, "CTLE Certificate for "+participant.eventName.slice(0,78), body, {htmlBody: body, attachments: [DocumentApp.openById(ctleDoc).getAs(MimeType.PDF)], replyTo: instance.dm_email});
          archiveRegSheet.getRange(participant.rowNum,ar_ctleSentIndex+1).setValue("Sent on "+new Date().toString().slice(0,15));
          ctleSent++;
          archiveRegSheet.getRange(participant.rowNum,ar_ctleSentIndex+2).setValue(participant.ctleId);
          for (var x=0; x<archiveEventData.length; x++) {
            if (archiveEventData[x][ae_eventIdIndex] === participant.eventId) {
              archiveEventSheet.getRange(Number(x)+1,ae_ctleSentIndex+1).setValue(archiveEventSheet.getRange(Number(x)+1,ae_ctleSentIndex+1).getValue()+1);
            }
          }
        }
        catch(error) {
          archiveRegSheet.getRange(participant.rowNum,ar_ctleSentIndex+1).setValue(error);
          if (errors[0] === "none") {errors.pop()};
          errors.push(error);
          }
  });
var summary = "Here is a summary of the CTLE Certificate Send Job on "+today.toString().slice(0,15)+"<br><br>\
The send ctle function:<br><ul>\
<li>Found "+eventObj.length+" events that are CTLE eligible.</li>\
<li>Found "+participantObj.length+" participants who wanted CTLE for those events.</li>\
<li>Sent "+ctleSent+" certificates</li>\
<li>Encountered the following errors: "+errors.join("\n")+"</li>\
<li>Found "+missingInfoList.length+" particiapnts with missing personal information in their registration form.</li>\
</ul><br><br>";
          if (missingInfoList.length>0) {
            summary+="<p>Summary of Registrants's Missing Information</p>\
<table>\
<tr><th>Name</th><th>ID</th><th>Email</th><th>Event</th><th>Missing Info</th></tr>";
            missingInfoList.forEach(function(registrant) {
              summary+="<tr><td>"+registrant.fName+" "+registrant.lName+"</td><td>"+registrant.id+"</td><td>"+registrant.email+"</td><td>"+registrant.missingInfo().join("\n")+"</td><td></td></tr>";
            });
            summary+="</table><br><br><a href='"+archiveSs.getUrl()+"'>Click here for archive sheet.</a>";
          }
          Logger.log("sending summary to "+instance.dm_email);
          GmailApp.sendEmail(instance.dm_email, "Summary of CTLE Certificate Send Job", summary, {htmlBody: summary});
}