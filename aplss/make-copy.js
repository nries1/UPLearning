function makeCopy() {
  var props = PropertiesService.getScriptProperties().getProperties();
  var boMap = JSON.parse(props.boMap);
  var out = {"success": true, "new_folder_url": "", "golbal_refs_url": SpreadsheetApp.openById(refSheet).getUrl(), "num_files": 0, "num_refs_updated": 0}
  var newFolder = DriveApp.createFolder(boMap[Session.getActiveUser().getEmail()].system).setSharing(DriveApp.Access.DOMAIN_WITH_LINK, DriveApp.Permission.VIEW).addEditor("professionallearning@strongschools.nyc").getId();
  var newUrl = DriveApp.getFolderById(newFolder).getUrl();
  out.num_files = copyTemplate(newFolder);
  out.num_refs_updated=setGlobals(newFolder);
  out.new_folder_url=newUrl;
  return out;
}

function setGlobals(folderId) {
  var props = PropertiesService.getScriptProperties().getProperties();
  var boMap = JSON.parse(props.boMap);
  var date = new Date();
  var out = {"transfers": 0, "numFiles": 0,}
  var folder = DriveApp.getFolderById(folderId);
  var files = folder.getFiles();
  var sheet = SpreadsheetApp.openById(refSheet).getSheetByName(boMap[Session.getActiveUser().getEmail()].system);
  var data = sheet.getDataRange().getValues();
  while (files.hasNext()) {
    var file = files.next();
    out.numFiles++;
    data.forEach(function(row,index) {
      if (row[3]===file.getName()){
        if (file.getDescription()) {
          sheet.getRange(Number(index)+1,7,1,2).setValues([[date,file.getDescription().split(";")[0]]])
        } else {
          sheet.getRange(Number(index)+1,7,1,3).setValues([[date,"",file.getId()]]);
        }
        out.transfers++;
      }
    });
  }
  var folders = folder.getFolders();
  while (folders.hasNext()) {
    out.numFiles++;
    var f = folders.next();
    data.forEach(function(row,index) {
      if (row[3]===f.getName()) {
        sheet.getRange(Number(index)+1,7,1,3).setValues([[date,f.getDescription(),f.getId()]]);
        out.transfers++;
      }
    });
  }
  return out.transfers;
}

function copyTemplate(newParentFolder) {
  Logger.log("making copy");
  var numFiles = 0;
  var folder = DriveApp.getFolderById(originalId);
  var files = folder.getFiles();
  while (files.hasNext()) {
    var file = files.next();
    if (file.getName().indexOf("Copy")===-1) {
      numFiles++;
      var copy = DriveApp.getFileById(file.getId()).makeCopy(file.getName(), DriveApp.getFolderById(newParentFolder));
      copy.addEditor("bksouthpd@strongschools.nyc").addEditor("professionallearning@strongschools.nyc");
      if (file.getMimeType()===MimeType.GOOGLE_APPS_SCRIPT) {Drive.Files.update({"parents": [{"id": newParentFolder}]}, copy.getId())}
    }
  }
  var folders = folder.getFolders();
  while (folders.hasNext()) {
    var folderName = folders.next().getName();
    DriveApp.getFolderById(newParentFolder).createFolder(folderName);
  }
  return numFiles;
}