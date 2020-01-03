//Take in a participant object, event object
//If the event is at capacity, and there is space available on the waitlist, then send a waitlist email.
//If the event is below capacity, send a standard email.
//If the event is at capacity and there's no space on the waitlist, send an excess email.
function emailConfirmation(regInfo,instance) {
  var prefix = boMap[instance].prefix;
  Logger.log("data for email confirmation:");
  Logger.log(regInfo);
  var errorMsg = "";
  var returnObj = {};
  
  //standard non-waitlist
  if (!regInfo.waitlist) {
    var subject = "Auto-confirmation for "+regInfo.title;
    if (instance!=="Brooklyn North PL System") {
    var emailBody = "<div style='font-size: 1.4em;'><br><br><p>Dear "+regInfo.fName+" "+regInfo.lName+",<br><br>\
Thank you for registering for a professional learning opportunity \
offered by the "+boMap[instance].borough+".<br><br><strong>Your confirmation code is: "+regInfo.id+"</strong><br><br>You may visit the <a target=_blank href='"+props[prefix+"_embedded_registrant_portal"]+"'>Registrant Portal</a> at any time \
to view up to date information on all of the events to which you are currently registered and, if necessary, to cancel your registration. If you need to edit your registration, you may do so <a href='"+regInfo.edit_link+"' target=_blank>here.</a> \
<br><br>Here are your event details:<br>\
<strong>Session Title:</strong> "+regInfo.title+"<br>\
<strong>Session ID: </strong>"+regInfo.eventId+"<br>\
<strong>Location:</strong> "+regInfo.location+"<br>\
<strong>Date(s):</strong> "+regInfo.dates.join(", ")+"<br>\
<strong>Times:</strong> "+regInfo.time+"<br><br>\
<strong>Other Information for Participants: </strong>"+regInfo.otherInfo+"<br>\
<strong>Resource Folder: </strong>"+regInfo.resource_folder+"<br>\
<strong>Facilitators:</strong> "+regInfo.allFacilitators+"<br><br>\
<strong>Your goal(s): </strong> "+regInfo.goals+"<br>\
<strong>Questions about your event? </strong> reply to this email to contact your facilitator.\
 We look forward to seeing you at the event!<br><br><br><br></div>"
 } else {
    var emailBody = "<div style='font-size: 1.4em;'><br><br><p>Dear "+regInfo.fName+" "+regInfo.lName+",<br><br>\
Thank you for your interest in this professional learning opportunity offered by Brooklyn North.  You will receive another confirmation email or waitlist notification from the facilitator.  Please check your DOE email regularly to ensure that you see the email.\
<br><br><strong>Your request code is: "+regInfo.id+"</strong><br><br>You may visit the <a target=_blank href='"+props[prefix+"_embedded_registrant_portal"]+"'>Registrant Portal</a> at any time \
to view up to date information on all of the events to which you are currently registered and, if necessary, to cancel your registration. If you need to edit your registration request, you may do so <a href='"+regInfo.edit_link+"' target=_blank>here.</a> \
<br><br>Here are your event details:<br>\
<strong>Session Title:</strong> "+regInfo.title+"<br>\
<strong>Session ID: </strong>"+regInfo.eventId+"<br>\
<strong>Location:</strong> "+regInfo.location+"<br>\
<strong>Date(s):</strong> "+regInfo.dates.join(", ")+"<br>\
<strong>Times:</strong> "+regInfo.time+"<br><br>\
<strong>Other Information for Participants: </strong>"+regInfo.otherInfo+"<br>\
<strong>Resource Folder: </strong>"+regInfo.resource_folder+"<br>\
<strong>Facilitators:</strong> "+regInfo.allFacilitators+"<br><br>\
<strong>Your goal(s): </strong> "+regInfo.goals+"<br>\
<strong>Questions about the event? </strong> reply to this email to contact the facilitator. Have a great day</div>";
 }
 }
 //waitlist
 else {
   var subject = "You have been added to the wait list for a professional learning session";
   var emailBody = "<div style='font-size: 1.4em;'><br><br><p>Dear "+regInfo.fName+" "+regInfo.lName+",<br><br>\
It looks like you tried to register for the event "+regInfo.title+". Unfortunately, this event is at capacity and is no longer accepting registrations. \
Your request to register has been recorded and you have been added to the waitlist. If space opens up, the facilitator for this event will contact you.<br><br>\
Thank you for your patience.<br><br>Sincerely,<br>Professional Learning Support<br>\
New York City Department of Education";  
 }
 var remainingQuota = MailApp.getRemainingDailyQuota();
 //if (remainingQuota<=100) {MailApp.sendEmail("nries@schools.nyc.gov", "Less than 100 registration emails left", "The account professionallearning@strongschools.nyc has sent 1400 emails today. One hundred emails remaining.")}
 if (remainingQuota<=15) {
   var overflowEmailStatus = UrlFetchApp.fetch("https://script.google.com/macros/s/AKfycbwjZW5CX3l3jqDHqxU5xVG6AKZvHAJPlfYVGFCcKJkRN8rAld4/exec?regInfo="+encodeURIComponent(JSON.stringify(regInfo))+"&instance="+encodeURIComponent(instance));
   Logger.log("email overflow status: ");
   Logger.log(overflowEmailStatus);
   returnObj.msg = overflowEmailStatus.msg;
   returnObj.success=overflowEmailStatus.success;
   returnObj.status=overflowEmailStatus.status;
   return returnObj;
 }
 try {
   if (!regInfo.waitlist) {
     MailApp.sendEmail(regInfo.email.replace(/ /g,""), subject, emailBody, {htmlBody: emailBody, replyTo: regInfo.event_creator});
   }
   else {
     MailApp.sendEmail(regInfo.event_creator, subject, emailBody, {htmlBody: emailBody, replyTo: regInfo.event_creator, cc: [regInfo.email, props[prefix+"_dm_email"]].join(",")});
   }
   returnObj.msg = "You will receive an email shortly with details about your registration.<br><br>Visit the <a target=_blank href='"+props[prefix+"_embedded_registrant_portal"]+"'> Registrant Portal</a> any time to \
view up to date information on all of the events for which you are currently registered.<br><br>For questions about your event please contact "+regInfo.event_creator
   returnObj.success=true;
   returnObj.status="sent";
   var today = new Date();
   var month = Number(today.getMonth())+1;
   var day = today.getDate();
   var year = today.getFullYear();
 }
 catch (error) {
   returnObj.msg = "Unfortunately, we were unable to send you a confirmation email.\
If you are sure that you entered your email address correctly, then you can \
visit the <a target=_blank href='"+props[prefix+"_embedded_registrant_portal"]+"'>Registrant Portal</a> any time to \
view up to date information on all of the events for which you are currently registered. If \
you think you have entered your email address incorrectly, you can edit your registration <a href='"+regInfo.edit_link+"' target=_blank>here</a>."
   returnObj.success=false;
   returnObj.status=error;
   MailApp.sendEmail("nries@schools.nyc.gov","Failed to send comfirmation", "Couldn't send an email confirmation to "+regInfo.email+" for instance: "+instance+" due to the following error: "+error);
 }
 return returnObj;
 }