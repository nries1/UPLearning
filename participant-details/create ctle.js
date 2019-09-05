function createCtleDoc(participantInfo,instance) {
  var prefix = boMap[instance].prefix;
  var ss = SpreadsheetApp.openById(props[prefix+"_archive_id"]);
  var s = ss.getSheetByName("Registrants");
  var es = ss.getSheetByName("Events");
  var d = s.getDataRange().getValues();
  var ed = es.getDataRange().getValues();
  var date = new Date();
  var ctleFolder = DriveApp.getFolderById(props[prefix+"_ctle_folder_id"]); //change this every school year
  var templateFile = DriveApp.getFileById(props[prefix+"_ctle_template_id"]).makeCopy("CTLE_"+participantInfo.fName+"_"+participantInfo.lName+"_"+date.getFullYear()+"_"+participantInfo.ctleId, ctleFolder).getId();
  var newDoc = DocumentApp.openById(templateFile);
  var hoursPresentStyle = newDoc.getBody().getParagraphs()[45].getAttributes();
  newDoc.getHeader().getParagraphs()[2].setText("Certificate ID: "+participantInfo.ctleId);
  newDoc.getFooter().getParagraphs()[0].setText("NYCDOE Certificate ID: "+participantInfo.ctleId);
  var tables = newDoc.getBody().getTables();
  tables[2].getRow(0).getCell(1).setText(participantInfo.fName+", "+participantInfo.lName);
  participantInfo.dob ? 
  tables[2].getRow(1).getCell(1).setText(participantInfo.dob)
  :
  tables[2].getRow(1).getCell(1).setText("");
  tables[2].getRow(2).getCell(1).setText("XXX-XX-"+participantInfo.ssnum);
  tables[4].getRow(0).getCell(1).setText(participantInfo.eventName);
  tables[4].getRow(1).getCell(1).setText(participantInfo.eventCtleType);
  tables[4].getRow(2).getCell(1).setText(participantInfo.eventDivision);
  tables[4].getRow(3).getCell(1).setText(participantInfo.eventGradeBand);
  tables[5].getRow(0).getCell(1).setText(participantInfo.eventStart.toString().slice(0,15));
  tables[5].getRow(1).getCell(1).setText(participantInfo.eventLocation);
  tables[7].getRow(0).getCell(0).setText("Total Number of Approved CTLE Hours:\n"+Number(participantInfo.hoursAttended).toPrecision(1));
  newDoc.getBody().getParagraphs()[44].setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  newDoc.getBody().getParagraphs()[40].clear();
  newDoc.getBody().getParagraphs()[41].clear();
  newDoc.getBody().getParagraphs()[41].setText("I certify that the individual listed above, "+participantInfo.lName+",\
 "+participantInfo.fName+", completed "+Number(participantInfo.hoursAttended).toPrecision(1)+" hours of the approved Continuing Teacher and Leader Education (CTLE) activity cited above pursuant to Subpart 80-6 of the Regulations of the Commissioner of Education ");
  newDoc.saveAndClose();
    var body = "Dear "+participantInfo.fName+" "+participantInfo.lName+",<br><br>Attached on this emaill, please find a copy of your CTLE certificate, which you earned by attending an eligible event hosted by the New York City Department of Education. For additional information on CTLE and other certification issues, visit: http://www.highered.nysed.gov/tcert.<br><br>Sincerely,<br>Professional Learning Support<br>New York City Department of Education";
    MailApp.sendEmail(participantInfo.email, "CTLE Certificate for "+participantInfo.eventName.slice(0,78), body, {htmlBody: body, attachments: [newDoc.getAs(MimeType.PDF)]});
  for (var i=1; i<d.length; i++) {
    if (d[i][42]===participantInfo.participant_id) {
      s.getRange(Number(i)+1,66).setValue(participantInfo.ctleId);
      s.getRange(Number(i)+1,65).setValue("Sent on "+new Date());
      break;
    }
  }
  for (var j=1; j<ed.length; j++) {
    if (ed[j][50]===participantInfo.event_id) {
      es.getRange(Number(j)+1, 95).setValue(ed[j][94]+1);
      break;
    }
  }
  return "A CTLE certificate was created and sent to "+participantInfo.fName+" "+participantInfo.lName;
}