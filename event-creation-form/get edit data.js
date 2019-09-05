function getEditData(id,instance) {
  var prefix = boMap[instance].prefix;
  var ss = SpreadsheetApp.openById(props[prefix+"_database_id"]);
  var s = ss.getSheetByName("event creation form responses");
  var data = s.getDataRange().getValues();
  var headers = data[0];
  var obj = {"sessions": []};
  for (var i=1;i<data.length;i++) {
    if (data[i][50]===id) {
      for (var j=0;j<52;j++) {
        if (data[i][j]!=="") {
          if (headers[j].indexOf("-email")!==-1) {
            obj[headers[j]]=data[i][j].toString().replace(/@strongschools.nyc/,"");
          } else {
            obj[headers[j]]=data[i][j].toString();
          }
        }
      }
      for (var k=58;k<69;k++) {
        if (data[i][k]!=="") {obj.sessions.push(JSON.parse(data[i][k]))}
      }
      break;
    }
  }
  Logger.log(obj);
  return obj;
}