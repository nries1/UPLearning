function sendConfirmation(data,update,instance) {
  var prefix = boMap[instance].prefix;
  var errors;
  var boroughOffice = instance; 
  var body = emailBody(data,update,instance);
  var subject = "Confirming Creation of "+data.title;
  if (update) {subject = "Information has been edited for your event "+data.title;}
  //try {
  MailApp.sendEmail(data.facEmails, subject, body, {htmlBody: body});
  //}
  /*catch(error) {
   errors = error;
    MailApp.sendEmail(dmEmail,"error in event creation email confirmation", "The sendConfirmation function (in the event creation sheet) encountered the following error - "+error+" - when trying to email facilitators for the event: "+data.title);
  }
  finally {
    return errors ? errors : "sent";
  }*/
}

function emailBody(data,update,instance) {
  var prefix = boMap[instance].prefix;
  //var script = ScriptApp.getScriptId();
  if (update) {
    var intro = "<div>Changes have been made to your event <strong>"+data.title+"</strong>. Please take a moment to review your information.</div>"
  } else {
    var intro ="<div>You are receiving this email because \
you have been listed as a facilitator on a new professional learning session posting. \
Please take a moment to review your session information. If you need to make any \
changes, you may do so <a href='"+data.edit_form+"'>here.</a></div>";
  }
  if (data.fb_schedule === "every day") {var fbMsg = "This will be sent to participants automatically on the morning of each of your sessions";}
  else {var fbMsg = "This will be sent to participants automatically on the morning of the last date of your event.";}
  if (!data.otherInfo) {data.otherInfo="none"}
  var body =
  "<div style='font-size: 1.4em'>\
  <div>Dear facilitator(s),</div>\
  <br>"+intro+"<h3>Event Information:</h3>\
<div><strong>Title: </strong>"+data.title+"</div>\
<div><strong>ID: </strong>"+data.id+"  <span style='color: red;'>*Use this as your reference number for questions about your event</span></div>\
<div><strong>Facilitators: </strong>"+data.facilitators+"</div>\
<div><strong>Location: </strong>"+data.location+"</div>\
<div><strong>Date(s): </strong>"+data.dates+"</div>\
<div><strong>Times: </strong>"+data.times+"</div>\
<div><strong>Description: </strong>"+data.description+"</div>\
<div><strong>CTLE Eligibility: </strong>"+data.ctle+"</div>\
<div><strong>Other Info: </strong>"+data.otherInfo+"</div>\
<div><strong>Available on public catalog? </strong>"+data.public+"</div>\
<div><strong>Maximum participants: </strong>"+data.maxParticipants+"</div>\
<div><strong>Waitlist available? </strong>"+data.waitlist+"</div>\
<div><strong>Registration form: </strong><a href='"+data.regUrl+"'>register here</a>&nbsp;*For best performance open in Chrome.</div>\
<div><strong>Registration flyer: </strong><a href='"+data.regFlyer+"'>registration flyer</a></div>\
</div><br>\
<div style='font-size: 1.4em;'>\
<h3>Useful Links:</h3>\
<div><a href='https://script.google.com/macros/s/AKfycbz4AthfjpkN8d_pttRsnKfYnsQp_Fal9N5O4tHpQX6Q-Hm58oo/exec?instance="+instance.replace(/ /g,"+")+"&id="+data.id+"' target=_blank>Event Page</a></div>\
<div><a href='"+props[prefix+"_embedded_attendance_app"]+"'>track attendance</a></div>\
<div><a href='"+props[prefix+"_embedded_facilitator_dashboard"]+"'>facilitator dashboard</a></div>\
<div><a href='"+createFbForm(data.title,data.id,"TBD",instance)+"'>feedback form</a>. <strong>"+fbMsg+"</strong></div>\
<br><br>\
<div><strong>Questions? </strong>Contact "+props[prefix+"_dm_name"]+" at "+props[prefix+"_dm_email"]+"</div>\
<br>\
<div>Sincerely,<br>Professional Learning Support</div>\
</div>";
return body;
}