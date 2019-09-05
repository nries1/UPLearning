function scheduledReminders() {
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
    if (databases[i].borough_office!=="Static PL System") {
        sendReminders(databases[i]);
      }
  }
}

function getEventsToRemind(database) {
  var today = new Date();
  var eventsData = SpreadsheetApp.openById(database.database_id).getSheetByName("event creation form responses").getDataRange().getValues();
  var eventsToRemind = eventsData.map(function(eventRow,index) {
    var lastReminder = new Date(eventRow[emailRemindSentCol-1]);
    if (eventRow[emailRemindSentCol-1] == "") {
      var recentReminder = false;
    } else if (((today.getTime() - lastReminder.getTime())/(24*60*60*1000))<5) {
      recentReminder = true;
    }
    return eventRow.slice(21,32).reduce(function(dateChecker,eventData) {
      if (((new Date(eventData).getTime()-today.getTime())/(24*60*60*1000)) <=3 &&
          ((new Date(eventData).getTime()-today.getTime())/(24*60*60*1000)) >0 &&
            !recentReminder) {return ++dateChecker}
        else {return dateChecker};
    },0) >0 ? {"title": eventRow[2],
               "row": Number(index)+1,
               "id": eventRow[50],
               "participants": [],
                "location": eventRow[19],
                "times":  eventRow[71],
                "facilitators": eventRow[70],
               "facilitatorEmail": eventRow[8],
               "otherInfo": eventRow[35],
               "comingDates": eventRow.slice(21,32).filter(function(date) {
                 return new Date(date).getTime() > today.getTime() ? date : false;
               }).map(function(date) {return date.toString().slice(0,15)}),
               "loc_list": eventRow.slice(58,69)
  } : false
  }).filter(function(event) {
    return event ? event : false;
  });
  return getRegsToRemind(eventsToRemind,database);
};

function getRegsToRemind(events,database) {
  if (events.length === 0) {return [];}
  var regSheet = SpreadsheetApp.openById(database.database_id).getSheetByName("form registrations");
  var regData = regSheet.getDataRange().getValues();
  for (var i=0; i<regData.length; i++) {
    events.forEach(function(event) {
      if (regData[i][18] === event.id && regData[i][63] !== "Waitlist" && regData[i][63] != "excess") {
        event.participants.push(regData[i][4]);   
      return;
      }
    });
  }
  return events;
}

function sendReminders(database) {
  Logger.log(database.borough_office);
  var eventSheet = SpreadsheetApp.openById(database.database_id).getSheetByName("event creation form responses");
  var eventsList = getEventsToRemind(database);
  if (eventsList.length===0) {return;}
  eventsList.forEach(function(event) {
    if (event.participants.length === 0) {Logger.log("no participants for this event."); return;}
    try {
      emailReminder(event,database);
      eventSheet.getRange(event.row,emailRemindSentCol).setValue(new Date());
    }
    catch(error) {
      var body = "Hi,<br><br>The email reminder script encountered the following error: "+error+" when trying to send reminderd for <strong>"+event.title+"</strong>. Here are the emails of the participants who were intended to receiv the reminder:<br><ul>";
      event.participants.forEach(function(participant) {body+="<li>"+participant+"</li>"});
      body+="</ul><br>As a list these emails appear like this:<br>";
      body+=event.participants.join(",");
      GmailApp.sendEmail(database.dm_email, "error report email reminder function", body,{htmlBody: body})
    }
    finally {}
  });
}

function emailReminder(event,database) {
  Logger.log("sending reminders");
  var buckets = Math.ceil(event.participants.length/40);
  Logger.log(buckets);
  var today = new Date();
  var participantsArray=[];
  for (var i=0;i<buckets;i++) {
    var bucket = [];
    for (var j=i*40;j<i+40;j++) {
      if (!event.participants[j]) {break;}
      bucket.push(event.participants[j]);
    }
    participantsArray.push(bucket);
  }
  var locationTable ="<table cellspacing='15' style='table-layout: fixed;'><tr style='font-weight: bold;'><td>Session #</td><td>Date</td><td>Location</td></tr>";
  event.loc_list.forEach(function(loc,i) {
    if (loc!=="") {
      loc=JSON.parse(loc);
      if (new Date(loc.date).getTime()>=today.getTime()) {
        locationTable+="<tr><td>"+Number(i+1)+"</td><td>"+loc.date+"</td><td>"+loc.location+"</td></tr>";
      }
    }
  });
  Logger.log(participantsArray);
  var emailBody = "<div style='font-size: 1.4em;'><br><br><p>Dear participants,<br><br>\
This is a friendly reminder that your event: <strong>"+event.title+"</strong> \
offered by the "+database.borough_office+" will take place on the following date(s): "+event.comingDates.join(", ")+"<br><br>\
"+locationTable+"</table><br><br>\
Here are the event details:<br>\
<strong>Location: </strong>"+event.location+"<br>\
<strong>Time: </strong>"+event.times+"<br>\
<strong>Other info: </strong>"+event.otherInfo+"<br>\
<strong>Facilitators: </strong>"+event.facilitators+"<br>\
<strong>Facilitator contact: </strong>"+event.facilitatorEmail+".<br><br>\
You can visit the <a href='"+database.embedded_registrant_portal+"' target=_blank>"+database.borough_office+" registrant portal</a> \
any time to view up to date information on all of the events to which you are registered and, if necessary, to cancel your registration.<br><br>\
We look forward to seeing you at the event.<br><br>\
Professional Learning Support<br>\
New York City Department of Education</div>";
  try {
  for (var k=0; k<participantsArray.length;k++) {
    //Logger.log("sending emails to "+participantsArray[k])
    MailApp.sendEmail(event.facilitatorEmail, "Reminder -- Your Professional Learning Opportunity is coming up soon.", emailBody, {cc:participantsArray[k].join(","), noReply: false, htmlBody: emailBody, replyTo: event.facilitatorEmail})
  }
    return "reminders sent to "+event.participants.length+" participants.";
  } catch(error) {
    MailApp.sendEmail("nries@schools.nyc.gov","error sending reminders","Failed to send reminders for instance "+databse.borough_office+" due to error "+error);
  } finally {}
}