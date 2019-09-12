function notifyRegs(updates, id, facilitatorEmail, title, instance) {
  Logger.log("notifying regs");
  Logger.log(updates);
  var prefix = boMap[instance].prefix;
  var regS = SpreadsheetApp.openById(props[prefix + "_database_id"]).getSheetByName("form registrations");
  var regD = regS.getDataRange().getValues();
  var participantsArray = [];
  var bucket = [];
  regD.forEach(function (row) {
    if (row[18] === id) {
      if (bucket.length === 40) {
        participantsArray.push(bucket);
        bucket = [];
      }

      bucket.push(row[4]);
    }
  });
  participantsArray.push(bucket);

  if (participantsArray[0].length === 0) {
    return;
  }

  var keys = Object.keys(updates);
  var changes = "<ul>";

  for (var i = 0; i < keys.length; i++) {
    changes += "<li><strong>" + keys[i] + ": </strong>" + updates[keys[i]] + "</li>";
  }

  changes += "</ul>";
  var body = "<div>Dear participants,<br><br>\
Please be advised that a facilitator for the professional learning session: <strong>" + title + "</strong>, hosted by the NYCDOE \
has made the following changes to their event:<br><br>\
<strong>Changes:</strong><br>" + changes + "<br><br>\
Please visit the <a href='" + props[prefix + "_embedded_registrant_portal"] + "' target=_blank>Registrant Portal </a> \
to view up to date information on all of the events to which you are registered.</div>";

  for (var k = 0; k < participantsArray.length; k++) {
    MailApp.sendEmail(facilitatorEmail, "Changes to your professional learning event", body, {
      cc: participantsArray[k].join(","),
      noReply: false,
      htmlBody: body,
      replyTo: facilitatorEmail,
      bcc: props[prefix + "_dm_email"]
    });
  }

  return "sent";
}