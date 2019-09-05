function editRow(formData,dbnList,instance) {
  var prefix = boMap[instance].prefix;
  var rss = SpreadsheetApp.openById(props[prefix+"_database_id"]);
  var rs = rss.getSheetByName("form registrations");
  var rd = rs.getDataRange().getValues();
  var found = false;
  for (var i=0; i<rd.length; i++) {
    if (rd[i][r_idIndex]===formData.id) {
      Logger.log("found reg");
      Logger.log(rd[i][62])
      var arr=createRow(formData,dbnList,instance,rd[i][62],rd[i])
      rs.getRange(Number(i)+1,1,1,arr.length).setValues([arr]);
      found=true;
      return found;
    }
  }
}