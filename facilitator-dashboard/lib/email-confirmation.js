function emailConfirmation(participant, event, instance) {
  if (instance === "Queens South PL System Beta") {
    var prefix = "qs";
  } else {
    var prefix = boMap[instance].prefix;
  }

  var errorMsg = "";
  var subject = "Auto-confirmation for " + event.title;
  var emailBody = "<div style='background-color: aliceblue; font-size: 1.4em;'><br><br><p>Dear " + participant.fName + " " + participant.lName + ",<br><br>\
Thank you for registering for a professional learning opportunity \
offered by the NYCDOE.<br><br><strong>Your confirmation code is: " + participant.id + "</strong><br><br>You may visit the <a target=_blank href='" + props[prefix + "_embedded_registrant_portal"] + "'>" + instance + "</a> at any time \
to view up to date information on all of the events to which you are currently registered and, if necessary, to cancel your registration.<br><br>Here are your event details:<br>\
<strong>Session Title:</strong> " + event.title + "<br>\
<strong>Session ID: </strong>" + event.id + "<br>\
<strong>Location:</strong> " + event.location + "<br>\
<strong>Date(s):</strong> " + event.dates + "<br>\
<strong>Times:</strong> " + event.time + "<br><br>\
<strong>Other Information for Participants: </strong>" + event.otherInfo + "<br>\
<strong>Facilitators:</strong> " + event.allFacilitators + "<br><br>\
<strong>Questions about your event? </strong> reply to this email to contact your facilitator.\
 We look forward to seeing you at the event!<br><br><br><br></div>";

  try {
    MailApp.sendEmail(participant.email, subject, emailBody, {
      htmlBody: emailBody,
      replyTo: event.eventCreatorEmail
    });
  } catch (error) {
    errorMsg = error;
  } finally {
    return errorMsg === "" ? "An email confirmation was sent to " + participant.email : errorMsg;
  }
}