
function scheduledEventArchive() {
  var databases = SpreadsheetApp.openById("15Gv1ZbjUX2ZGSUOPBIUfDlo8jRod4DgwYoy2WLnmVoo")
                                .getSheets()
                                .map(function(sheet) {
                                  var obj = {};
                                  var data = sheet.getDataRange().getValues();
                                  data.forEach(function(row,index) {
                                    if (index===0) {obj.instance=sheet.getName()}
                                     else {
                                      obj[row[4]]=row[8];
                                    }
                                  });
                                  return obj;
                                });
  for (var i=0;i<databases.length; i++) {
      if (databases[i].borough_office !== "Bronx NYCDOE Borough Office")  {
        if (databases[i].borough_office==="Bronx") {
          archiveEvents(databases[i]);
        }
      }
  }
}

function archiveEvents(instance) {
  var archiveEventSheet = SpreadsheetApp.openById(instance.archive_id).getSheetByName("Events");
  var eventCreationSheet = SpreadsheetApp.openById(instance.database_id).getSheetByName("event creation form responses")
  var eventsData = eventCreationSheet.getDataRange().getValues();
  var archivedEvents = 0;
  var reminderEmailsSent = [];
  var errors = ["none"];
  for (var i=eventsData.length-1;i>0;i--) {
    // If the event ended 7 or more days ago
    if ((((new Date() - eventsData[i][lastDateOfEventCol-1])/(24*60*60*1000)) >= 7)) {
      //If all attendance was entered and the event wasn't already archived
      var atTrackRate = eventsData[i][89];
      if (atTrackRate===1 && eventsData[i][archiveCol-1] !== "archived") {
        var values = eventsData[i];
        values[72] = new Date(); // archive date
        values.push('=COUNTIF(Registrants!S:S,AY'+Number(archiveEventSheet.getLastRow()+1)+')');
        values.push(0);
        archiveEventSheet.appendRow(values);
        eventCreationSheet.deleteRow(Number(i)+1);
        archivedEvents++;
      }
      //If all attendance was NOT entered, then...
      else
        var numRegs = eventsData[i][85];
        if (atTrackRate<1 && numRegs > 0) {
        //If a reminder hasn't been sent for 5 days, email the facillitators for the event to remind them to enter the info
        if (eventsData[i][facReminderCol-1] =="" || ((new Date().getTime() - new Date(eventsData[i][facReminderCol-1]).getTime())/(24*60*60*1000)) >= 5) {
          var ctle = true;
          if (eventsData[i][ae_ctleTypeIndex] === "This offering is NOT CTLE eligible") {ctle = false;}
          var particiapntLinkDates = [];
          eventsData[i][69].toString().split(",").forEach(function(date) {
            var formatDate = new Date(date);
            particiapntLinkDates.push(Number(formatDate.getMonth()+1)+"-"+formatDate.getDate()+"-"+formatDate.getFullYear());
          });
          if (eventsData[i][32]!=="This offering is NOT CTLE eligible" && eventsData[32]!=="CTLE eligible, but certificate issued by NON-FSC office") {
            var urlctle = eventsData[i][32];
          } else {
            var urlctle = "ineligible";
          }
          var participantPage = "https://script.google.com/macros/s/AKfycbw-Svb9_fWqYXlW153ST_htOeGLytyjB-tSq8aV66vahu5ETIc7/exec?instance="+encodeURIComponent(instance.instance_name)+"&eventid="+eventsData[i][50]+"&status=active&sessions="+eventsData[i][84]+"&duration="+eventsData[i][53]+"&dates="+particiapntLinkDates.join("/")+"&title="+encodeURIComponent(eventsData[i][2])+"&ctle="+encodeURIComponent(urlctle)+"&division="+eventsData[i][15]+"&gradeband="+eventsData[i][14]+"&eventstart="+encodeURIComponent(new Date(eventsData[i][21]).toString().slice(0,15))+"&location="+eventsData[i][19];
        var emailBody = "<div>Dear facilitator(s),<br><br>It looks like the event, "+eventsData[i][sessionTitleIndex]+", is \
missing attendance for some participants.<br><br><span style='font-size: 1.25em;'>You can record attendance, and de-register participants <a target=_blank href='"+participantPage+"'>here.</a></span> (works best in Chrome). Please take a few minutes \
to finalize your attendance records so that your registration data can be archived.<br><br>Thank you in advance for your time.<br><br>\
<strong>Questions?</strong> email "+instance.dm_email+".</div>";
          var facilitatorEmails = [];
          facilitatorEmails.push(eventsData[i][eventCreatorIndex]);
          if (eventsData[i][fac1EmailIndex] != "") { facilitatorEmails.push(eventsData[i][fac1EmailIndex]) }
          if (eventsData[i][fac2EmailIndex] != "") { facilitatorEmails.push(eventsData[i][fac2EmailIndex]) }
          if (eventsData[i][fac3EmailIndex] != "") { facilitatorEmails.push(eventsData[i][fac3EmailIndex]) }
            try {
              GmailApp.sendEmail(facilitatorEmails, "Attendance information needed for your professional learning session", emailBody, {htmlBody:emailBody, replyTo: instance.dm_email});
              eventCreationSheet.getRange(Number(i)+1,facReminderCol).setValue(new Date());
              reminderEmailsSent.push(facilitatorEmails);
            }
            catch(error) {
              if (errors[0]==="none") {errors.pop()}
              errors.push(error);
            }
            finally {}
      }
    }
    }
  }
  Logger.log(reminderEmailsSent.length);
  Logger.log("emailing "+instance.dm_email);
  MailApp.sendEmail(instance.dm_email,"Summary of Archive Event Job","The scheduled archive events function archived "+archivedEvents+" events, sent "+reminderEmailsSent.length+" reminder emails to the following facilitators: \n\n"+reminderEmailsSent.join("\n")+"\n\n and encountered the following errors: "+errors.join("\n"));
}