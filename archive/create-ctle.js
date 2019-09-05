/*function createCtleDoc(participantInfo,instance) {
  var date = new Date();
  //Logger.log("ctle folder id "+instance.ctle_folder_id)
  //Logger.log("ctle folder id access "+DriveApp.getFileById(instance.ctle_folder_id).getAccess("professionallearning@strongschools.nyc"));
  var ctleFolder = DriveApp.getFolderById(instance.ctle_folder_id); //change this every school year
  //Logger.log("ctle template id "+instance.ctle_template_id);
  //Logger.log("ctle template id "+DriveApp.getFileById(instance.ctle_template_id).getAccess("professionallearning@strongschools.nyc"));
  var templateFile = DriveApp.getFileById(instance.ctle_template_id).makeCopy("CTLE_"+participantInfo.fName+"_"+participantInfo.lName+"_"+date.getFullYear()+"_"+participantInfo.ctleId, ctleFolder).getId();
  var newDoc = DocumentApp.openById(templateFile);
  var hoursPresentStyle = newDoc.getBody().getParagraphs()[45].getAttributes();
  newDoc.getHeader().getParagraphs()[2].setText("Certificate ID: "+participantInfo.ctleId);
  newDoc.getFooter().getParagraphs()[0].setText("NYCDOE Certificate ID: "+participantInfo.ctleId);
  var tables = newDoc.getBody().getTables();
  tables[2].getRow(0).getCell(1).setText(participantInfo.fName+", "+participantInfo.lName);
  participantInfo["birth-day"] ? 
  tables[2].getRow(1).getCell(1).setText(participantInfo["birth-day"]+" "+participantInfo["birth-month"]+", "+participantInfo["birth-year"])
  :
  tables[2].getRow(1).getCell(1).setText("");
  tables[2].getRow(2).getCell(1).setText("XXX-XX-"+participantInfo["ss-num"]);
  tables[4].getRow(0).getCell(1).setText(participantInfo.eventName);
  tables[4].getRow(1).getCell(1).setText(participantInfo.eventCtleType);
  tables[4].getRow(2).getCell(1).setText(participantInfo.eventDivision);
  tables[4].getRow(3).getCell(1).setText(participantInfo.eventGradeBand);
  tables[5].getRow(0).getCell(1).setText(participantInfo.eventStart.toString().slice(0,15));
  tables[5].getRow(1).getCell(1).setText(participantInfo.eventLocation);
  tables[7].getRow(0).getCell(0).setText("Total Number of Approved CTLE Hours:\n"+participantInfo.hoursAttended.toFixed(1));
  newDoc.getBody().getParagraphs()[44].setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  newDoc.getBody().getParagraphs()[40].clear();
  newDoc.getBody().getParagraphs()[41].clear();
  newDoc.getBody().getParagraphs()[41].setText("I certify that the individual listed above, "+participantInfo.lName+",\
 "+participantInfo.fName+", completed "+participantInfo.hoursAttended.toFixed(1)+" hours of the approved Continuing Teacher and Leader Education (CTLE) activity cited above pursuant to Subpart 80-6 of the Regulations of the Commissioner of Education ");
  newDoc.saveAndClose();
  try {
    //return {"url": newDoc.getUrl(), "pdf": newDoc.getAs(MimeType.PDF)}
    return newDoc.getId();
  }
  catch(error) {
    return error;
    }
  finally {
  }
}
*/

function createCtle(participantInfo,instance) {
Logger.log("creating ctle");
var date = new Date();
  //Logger.log("ctle folder id "+instance.ctle_folder_id)
  //Logger.log("ctle folder id access "+DriveApp.getFileById(instance.ctle_folder_id).getAccess("professionallearning@strongschools.nyc"));
  var ctleFolder = DriveApp.getFolderById(instance.ctle_folder_id); //change this every school year
  //Logger.log("ctle template id "+instance.ctle_template_id);
  //Logger.log("ctle template id "+DriveApp.getFileById(instance.ctle_template_id).getAccess("professionallearning@strongschools.nyc"));
  var templateFile = DriveApp.getFileById(instance.ctle_template_id).makeCopy("CTLE_"+participantInfo.fName+"_"+participantInfo.lName+"_"+date.getFullYear()+"_"+participantInfo.ctleId, ctleFolder).getId();
  var newDoc = DocumentApp.openById(templateFile);
  var body = newDoc.getBody();
  var header = newDoc.getHeader();
  header.replaceText("<<Certificate ID:>>", participantInfo.ctleId);
  body.replaceText("<<Certificate ID:>>", participantInfo.ctleId);
  body.replaceText("<<First Name:>>", participantInfo.fName);
  body.replaceText("<<Last Name:>>",participantInfo.lName);
  participantInfo["birth-day"] ? 
    body.replaceText("<<Date of Birth:>>",participantInfo["birth-day"]+" "+participantInfo["birth-month"]+", "+participantInfo["birth-year"])
  :
    body.replaceText("<<Date of Birth:>>","");
  body.replaceText("<<Last 4 Digits of Social Security Number:>>", participantInfo["ss-num"]);
  body.replaceText("<<Session Name:>>",participantInfo.eventName);
  body.replaceText("<<Area:>>", participantInfo.eventCtleType);
  body.replaceText("<<Session Type:>>",participantInfo.eventDivision);
  body.replaceText("<<Grade Levels:>>", participantInfo.eventGradeBand);
  body.replaceText("<<Session Date:>>", participantInfo.eventStart.toString().slice(0,15));
  body.replaceText("<<Session Location:>>", participantInfo.eventLocation);
  body.replaceText("<<CTLE Session Hours:>>",participantInfo.hoursAttended.toFixed(1));
  newDoc.saveAndClose();
  return newDoc.getId();
}