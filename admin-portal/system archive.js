/*
  Why does the system archive live in the admin portal app?
  Because the admin portal needs access to the spreadsheets that are created when archives are arvhied.
  By keeping the archive script in the admin portal file, it is possible to save new spreadsheet IDs when
  they are created without making it talk to another app, or entering in manually.
*/

function scheduledSystemArchive() {
  var databases = SpreadsheetApp.openById("15Gv1ZbjUX2ZGSUOPBIUfDlo8jRod4DgwYoy2WLnmVoo")
                                .getSheets()
                                .map(function(sheet) {
                                  var obj = {};
                                  var data = sheet.getDataRange().getValues();
                                  data.forEach(function(row,index) {
                                    if (index===0) {
                                      obj.instance = sheet.getName()
                                    }
                                     else {
                                      obj[row[4]] = row[8];
                                    }
                                  });
                                  return obj;
                                });
  for (var i = 0; i < databases.length; i++) {
      if (databases[i].borough_office !== "Static PL System")  {
        //if (databases[i].instance_name==="Brooklyn South PL System") {  
          archiveSystem(databases[i]);
        //}
      }
  }
}

function archiveSystem(instance) {
  Logger.log("archiving system for "+instance["instance"]);
  var currentArchive = SpreadsheetApp.openById(instance.archive_id);
  var curYear = new Date().getFullYear();
  var curSy = "SY"+Number(curYear-1).toString().slice(2,4)+"-"+curYear.toString().slice(2,4);
  var newSsName = "PL System Archive "+curSy;
  try {
    var newArchive = DriveApp.getFileById(instance.archive_id).makeCopy(newSsName).addEditor(instance.dm_email);
    PropertiesService.getScriptProperties().setProperty(boMap[instance.instance_name].prefix+"_"+curSy, newArchive.getId());
    MailApp.sendEmail(instance.dm_email, "System Archive Report",
    "Hello,\n\nThe PL System archive for instance "+instance.instance_name+" was archived to a new spreadsheet.\
     Please make sure that the new spreadsheet contains all of your PL data from the previous school year and that \
     the contents of the 'PL System Archive Current' spreadsheet are deleted except for the headers.\n\nYour archive \
     from the previous school year has been copied to a new spreadsheet here: "+SpreadsheetApp.openById(newArchive.getId()).getUrl()+"\n\n\
     Your current working archive is here (this will always be the same spreadsheet): "+DriveApp.getFileById(instance.archive_id).getUrl(), {cc: "nries@schools.nyc.gov"});
     var currentEvents = currentArchive.getSheetByName("Events");
     var currentRegs = currentArchive.getSheetByName("Registrants");
     currentEvents.deleteRows(2,currentEvents.getLastRow()-1);
     currentRegs.deleteRows(2,currentEvents.getLastRow()-1);
  } catch(error) {
    MailApp.sendEmail(instance.dm_email,"Error archiving your archive",
    "Something went wrong while trying to archive your working archive.\n\nError: "+error+"\n\nPlease make sure that your PL System Archive Current file and its parent folder are shared for editing with professionallearning@strongschools.nyc", {cc: "nries@schools.nyc.gov"})
  }
}