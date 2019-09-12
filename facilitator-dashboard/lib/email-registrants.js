function emailRegistrants(eventObj, instance) {
  var prefix = boMap[instance].prefix;

  if (instance === "Queens South PL System Beta") {
    var rcss = SpreadsheetApp.openById(props[prefix + "_reg_data_id"]);
    var regData = rcss.getSheetByName("form registrations").getDataRange().getValues();
  } else {
    var regData = SpreadsheetApp.openById(props[prefix + "_database_id"]).getSheetByName("form registrations").getDataRange().getValues();
  }

  var regEmails = [props[prefix + "_dm_email"]];

  for (var i = 0; i < regData.length; i++) {
    if (regData[i][r_eventIdIndex] === eventObj.eventId) {
      regEmails.push(regData[i][r_emailIndex]);
    }
  }

  if (regEmails.length === 1) {
    return "Nobody registered for this event. So no emails were sent.";
  }

  try {
    var emailBody = "<div>Dear participants,<br><br>Please be advised that the event, " + eventObj.eventName + ", has been canceled by the facilitator. Please visit the " + props[prefix + "_borough_office"] + " Professional Learning Catalog to search for additional events.<br><br>We appologize for any inconvenience.<br><br>Sincerely,<br>Professional Learning Support<br>" + props[prefix + "_borough_office"] + "</div>";
    MailApp.sendEmail(userMail, "Professional Learning Session Canceled", emailBody, {
      htmlBody: emailBody,
      cc: regEmails.join(",")
    });
    var returnMsg = "Cancelation emails were sent to " + regEmails.length + " registrant(s).";
    return returnMsg;
  } catch (error) {
    return error;
  } finally {}
}