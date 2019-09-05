function createFbSs(eventId,instance) {
  Logger.log(instance)
    var prefix = boMap[instance].prefix;
    var fbData = SpreadsheetApp.openById(props[prefix+"_database_id"]).getSheetByName("Feedback Form Responses").getDataRange().getValues();
  var data = [];
  var row = [];
  var headerRow = [];
  for (var j=0; j<fbData[0].length; j++) {
    headerRow.push(fbData[0][j]);
  }
  data.push(headerRow);
  for (var i=0; i<fbData.length; i++) {
    if (fbData[i][f_fullEventTitleIndex].slice(0,7) === eventId) {
      row = [];
      for (var k=0; k<headerRow.length; k++) {
        row.push(fbData[i][k]);
      }
      data.push(row);
    }
  }
  var newSs = SpreadsheetApp.openById(DriveApp.getFileById(props[prefix+"_fb_template_id"]).makeCopy("Feedback report on "+new Date(),DriveApp.getFolderById("1_uTklyEzbYPng9iKu4310i6DSy7j8FUr")).getId());
  newSs.getSheets()[0].getRange(1,1,data.length, data[0].length).setValues(data);
  DriveApp.getFileById(newSs.getId()).setSharing(DriveApp.Access.DOMAIN_WITH_LINK, DriveApp.Permission.EDIT);
  return newSs.getUrl();
}