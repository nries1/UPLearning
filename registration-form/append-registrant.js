function appendRegistrant(data,dbnList,instance,emailStatus) {
  var prefix = boMap[instance].prefix;
  var returnMsg = {}
  var rss = SpreadsheetApp.openById(props[prefix+"_database_id"]);
  Logger.log(rss.getUrl());
  var rs = rss.getSheetByName("form registrations");
  var errors = [];
  var arr = createRow(data,dbnList,instance,emailStatus);
    try {
      rs.appendRow(arr);
      return true;
    } catch(error) {
      MailApp.sendEmail("nries@schools.nyc.gov","Failed to append a registration", "Couldn't append a registration for email: "+data.email+", instance: "+instance+", "+" event "+data.title+". due to the error: "+error);
      return false;
    }
}