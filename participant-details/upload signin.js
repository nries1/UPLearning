function uploadToDrive(formObj) {
  Logger.log(formObj);
  var prefix = boMap[formObj.instance].prefix;
  var attnfolder = DriveApp.getFolderById(props[prefix+"_attendance_folder_id"]);
  var eventfolder = attnfolder.getFoldersByName(formObj.event_id);
  if (!eventfolder.hasNext()) {
    eventfolder = attnfolder.createFolder(formObj.event_id);
  } else {
    eventfolder = eventfolder.next();
  }
  var datefolder = eventfolder.getFoldersByName(formObj.upload_session_date);
  if (!datefolder.hasNext()) {
    datefolder = eventfolder.createFolder(formObj.upload_session_date);
  } else {
    datefolder = datefolder.next();
  }
  datefolder.createFile(formObj.sign_in_sheet);
  return eventfolder.getUrl();
}