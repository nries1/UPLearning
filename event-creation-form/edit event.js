function editEvent(id,form,instance) {
  var prefix = boMap[instance].prefix;
  var ss = SpreadsheetApp.openById(props[prefix+"_database_id"]);
  var s = ss.getSheetByName("event creation form responses");
  var foundEvent = false;
  var data = s.getDataRange().getValues();
  for (var i=1;i<data.length;i++) {
    if (data[i][50]===id) {
      var eventRow = Number(i)+1;
      foundEvent=true;
      var sessionNotes = data[i].slice(58, 69).reduce(function(allNotes, note) {
        
      });
      break;
    }
  }
  if (!foundEvent) {return "Sorry. There was an error when trying to edit your event. Please contact nries@schools.nyc.gov for support."}
  var allErrors = [];
  var numSessions = 0;
  var allDates = [];
  var location = "";
  form.sessions.forEach(function(session) {
    if (session.date) {
      numSessions++;
      var formattedDate = Utilities.formatDate(new Date(session.date), "GMT+4:00", "EEE MMM d yyyy");
      allDates.push(formattedDate);
      if (location==="") {
        location=session.location;
      } else if (location!==session.location && location!=="Various Locations") {
        location = "Various Locations";
      }
    }
  });
  var allFacs = form.facilitators.filter(function(fac){return fac.name!==""}).map(function(fac) {return fac.name});
  var facEmails = form.facilitators.filter(function(fac){return fac.email!==""}).map(function(fac) {return fac.email});
  //var eventCreator = Session.getActiveUser().getEmail();
  var startTime = new Date(2019,1, 1, Number(form.sessions[0].start_time.toString().slice(0,2)),Number(form.sessions[0].start_time.toString().slice(3,5)),0,0);
  var endTime = new Date(2019,1, 1, Number(form.sessions[0].end_time.toString().slice(0,2)),Number(form.sessions[0].end_time.toString().slice(3,5)),0,0);
  var duration = ((endTime-startTime)/(1000*60*60)).toFixed(1);
  var id = data[eventRow-1][50];
  var times = timeObj[form.sessions[0].start_time]+" - "+timeObj[form.sessions[0].end_time];
  times = times.replace(/:00 AM/g," AM").replace(/:00 PM/g," PM");
  var regForm = "https://script.google.com/a/strongschools.nyc/macros/s/AKfycbz13TA6TRLjXeWWS4UzoZp0Si7VH0DV8Qjhco5ZG2FHe2y7j-Y/exec?"+"id="+id+"&instance="+encodeURIComponent(instance);
  var editLink = "https://script.google.com/a/strongschools.nyc/macros/s/AKfycbyNuZDlNWQ-SOtdwZ3bXGFaLk0cg7WHVC9LCXUbOmOcCPxU1yiV/exec?instance="+encodeURIComponent(instance)+"&id="+id+"&edit=facilitatoredit";
  var eventPage = "https://script.google.com/macros/s/AKfycbz4AthfjpkN8d_pttRsnKfYnsQp_Fal9N5O4tHpQX6Q-Hm58oo/exec?instance="+encodeURIComponent(instance)+"&id="+id  
  var eventDataObj = {"title":form.title,"id":id,"location":location,"dates":allDates.join(", "),
                      "times":times,"start_time": form.sessions[0].start_time,
                      "description":form.description,"ctle":form.ctle,"facilitators":allFacs, "end_time": form.sessions[0].end_time,
                      "regUrl":regForm,"facEmails":facEmails,"otherInfo":form.other_info,"public":form.public,
                      "waitlist":form.waitlist,"maxParticipants":form.max,"reg_text": "Click Here to Register",
                      "doc_structure":data[eventRow-1][78],"duration": duration,"eventCreator": form.event_creator,"edit_form":editLink}
  var flyerObj = createCustomRegFlyer(eventDataObj,data[eventRow-1][77],instance);
  eventDataObj["regFlyer"] = flyerObj.url;
  //create a new row of data to replace the old row
  var row = [form.creation_date,form.event_creator,form.title,form.description,"new",form.public,form.max];
  //facilitators
  form.facilitators.forEach(function(fac) {row.push(fac.name); row.push(fac.email)});
  //audience, grade band, division, content area, start time, end time, location,allow non doe
  row.push(form.audience.join(", "),form["grade_level"],form.division[0],form.subject.join(", "),timeObj[form.sessions[0].start_time],timeObj[form.sessions[0].end_time],location,form["allow_non_doe"][0]);
  //dates 1 - 11
  form.sessions.forEach(function(session) {
    if (session.date) {
      var formattedDate = Utilities.formatDate(new Date(session.date), "GMT+4:00", "EEE MMM d yyyy");
      row.push(formattedDate)
    } else {
      row.push("")
    } 
  });
  //ctle, funding, resource folder, other info, display_audence, last edit date, framework, guskey, districts, support, extra,waitlist, waitlist size, feedback schedule,extra,extra,extra,email reminder,extra x4
  row.push(form.ctle,form.funding,form.resource_folder,form["other_info"],form.display_audience,new Date(),form.framework.join(", "),form.guskey.join(", "),JSON.stringify(form.districts),form.support.join(", "),Session.getActiveUser(),form.waitlist,form['wl-size'],form.feedback,"","","","");
  //id,full title,reg url,duration,extra,event page,division,extra
  row.push(id,id+"-"+form.title,regForm,duration,"",eventPage,props[prefix+"_"+directorEmails[form.division[0]]],"")
  //session objects 1-11
  form.sessions.forEach(function(session, index) {if (session!== "") {
      session.date=Utilities.formatDate(new Date(session.date), "GMT+4:00", "MM/dd/yyyy");
      if (data[Number(eventRow)-1][index+58] !== "") {
        var oldSessionInfo = JSON.parse(data[Number(eventRow)-1][index+58]);
        Object.keys(oldSessionInfo).forEach(function(key) {
          if (!session.hasOwnProperty(key)) session[key] = oldSessionInfo[key];
        });
      }
      row.push(JSON.stringify(session))
    } else {
      row.push("")
    }
  });
  //all dates, all facs, times, extra, edit link, extra, extra, flyer url, edit date, flyer id, flyer structure, extra, last date, extra,extra, num sessions,registrants,feedback received, archived, last reminder sent, attn track rate, extra
  row.push(allDates.join(", "),allFacs.join(", "),times,
          "",editLink,"",flyerObj.url,new Date(),flyerObj.id,flyerObj.doc_structure,"",form.sessions[numSessions-1].date,form.feedback,"","=countifs('form registrations'!S:S,INDIRECT(\"R[0]C[-33]\",FALSE),'form registrations'!BL:BL,\"Waitlist\")",numSessions,"=countifs('form registrations'!S:S,INDIRECT(\"R[0]C[-35]\",FALSE),'form registrations'!BL:BL,\"<>Waitlist\",'form registrations'!BL:BL,\"<>excess\")","=countif('Feedback Form Responses'!B:B,INDIRECT(\"R[0]C[-35]\",FALSE))","","","=iferror(sumif('form registrations'!S:S,INDIRECT(\"R[0]C[-39]\",FALSE),'form registrations'!BH:BH)/(INDIRECT(\"R[0]C[-5]\",FALSE)*INDIRECT(\"R[0]C[-4]\",FALSE)),\"no registrants\")","");
  if (data[eventRow-1][91]==="" || data[eventRow-1][91].indexOf("Exception")!==-1 || data[eventRow-1][91].indexOf("Error")!==-1) {
    try {
      var calId = createCalendarEvent(eventDataObj,instance);
      row.push(calId);
    } catch(error) { allErrors.push({"title": "Calendar Event", "error": error}); row.push(error);}
  } else {
    try {
      var calEvent = CalendarApp.getCalendarsByName(props[prefix+"_calendar_name"])[0].getEventById(data[eventRow-1][91]);
      var guestList = calEvent.getGuestList().map(function(g) {return g.getEmail()});
      calEvent.deleteEvent();
      var calId = createCalendarEvent(eventDataObj,instance,guestList);
      row.push(calId);      
    } catch(error) { Logger.log(error); allErrors.push({"title": "Calendar Event", "error": error}); row.push(error);} finally {}
  }
  if (form.notify && Object.keys(form.notifyObj).length>0) {
    var notificationRequest = true;
    try {
      notifyRegs(form.notifyObj,id,form.event_creator,form.title,instance);
      var registrantsNotified = true;
    } catch (error) {
      allErrors.push({"title": "Registrant Notification", "error": error});
      var registrantsNotified = false;
    } finally {}
  } else {
    var notificationRequest = false;
  }
  try {
    sendConfirmation(eventDataObj,true,instance);
    row.push("sent");
    var confirmationSent = true;
  } catch(error) {
    allErrors.push({"title": "Email Confirmation", "error": error});
    row.push(error);
    var confirmationSent = false;
  }
  try {
    s.getRange(eventRow,1,1,row.length).setValues([row]);
    var returnMsg = "Your event was edited successfully.";
    var eventPosted = true;
    if (allErrors.length>0) {
      returnMsg+=" But the following errors occured:<br><br>";
      allErrors.forEach(function(er,index) {
        returnMsg+="("+Number(index+1)+") "+er.title+": "+er.error+"<br>";
      });
    }
    var outObj = {confirmation_success: confirmationSent, edit: true, notification_requested: notificationRequest, notification_success: registrantsNotified, "msg": returnMsg, "reg_link": regForm, "edit_link":editLink, "reg_flyer": flyerObj.url, "event_page": "", "event_id": id}; 
  } catch(error) {
    return error;
  }
  finally {Logger.log(outObj)}
  return outObj;
}