function duplicateEvent(eventId, instance) {
  Logger.log("hello?");
  var prefix = boMap[instance].prefix;
  var eventCreationSs = SpreadsheetApp.openById(props[prefix + "_database_id"]);
  var eventCreationSheet = eventCreationSs.getSheetByName("event creation form responses");
  var idSheet = eventCreationSs.getSheetByName("ids");
  var eventCreationData = eventCreationSheet.getDataRange().getValues();
  var eventObj = {
    "eventName": "",
    "eventId": eventId,
    "message": ""
  };

  for (var i = 0; i < eventCreationData.length; i++) {
    if (eventCreationData[i][eventIdIndex] === eventId) {
      Logger.log("found id"); //try {

      var row = eventCreationData[i];
      row[0] = new Date();
      var newId = getId(row[divisionIndex], idSheet, instance);
      row[2] = "Duplicate of " + row[2];
      row[51] = newId + "-" + row[2];
      row[eventIdIndex] = newId;
      row[55] = "https://script.google.com/macros/s/AKfycbz4AthfjpkN8d_pttRsnKfYnsQp_Fal9N5O4tHpQX6Q-Hm58oo/exec?instance=" + instance.replace(/ /g, "+") + "&id=" + newId; //Event Page

      row[52] = "https://script.google.com/a/strongschools.nyc/macros/s/AKfycbz13TA6TRLjXeWWS4UzoZp0Si7VH0DV8Qjhco5ZG2FHe2y7j-Y/exec?id=" + newId + "&instance=" + instance.replace(/ /g, "+"); //Reg url

      row[73] = "https://script.google.com/a/strongschools.nyc/macros/s/AKfycbyNuZDlNWQ-SOtdwZ3bXGFaLk0cg7WHVC9LCXUbOmOcCPxU1yiV/exec?id=" + newId + "&edit=facilitatoredit&instance=" + instance.replace(/ /g, "+"); //Edit Event Link

      row[75] = ""; // reg flyer url

      row[77] = ""; // reg flyer doc id

      row[83] = "=countifs('form registrations'!S:S,INDIRECT(\"R[0]C[-33]\",FALSE),'form registrations'!BL:BL,\"Waitlist\")";
      row[85] = "=countifs('form registrations'!S:S,INDIRECT(\"R[0]C[-35]\",FALSE),'form registrations'!BL:BL,\"<>Waitlist\")";
      row[86] = "=countif('Feedback Form Responses'!B:B,INDIRECT(\"R[0]C[-35]\",FALSE))";
      row[89] = "=iferror(sumif('form registrations'!S:S,INDIRECT(\"R[0]C[-39]\",FALSE),'form registrations'!BH:BH)/(INDIRECT(\"R[0]C[-5]\",FALSE)*INDIRECT(\"R[0]C[-4]\",FALSE)),\"no registrants\")";
      row[82] = "Duplicate Event";
      row[90] = ""; //Attendance sheet

      row[91] = "no calendar event created";
      eventCreationSheet.appendRow(row);
      return true;
      /*} catch(err) {
        MailApp.sendEmail("bksouthpd@strongschools.nyc", "failed to duplicate event", "eventid: "+eventId+"\nerror: "+err);
        return false;
      }*/
    }
  }
}

function testGetEC() {
  SpreadsheetApp.openById(props["bks_database_id"]).appendRow(["hello"]);
}