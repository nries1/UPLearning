function postForm(form,instance) {
  Logger.log(form);
  Logger.log(instance);
  var prefix = boMap[instance].prefix;
  if (instance === "Queens South PL System Beta") {
  var ss = SpreadsheetApp.openById(props[prefix+"_event_data_id"]);
  } else {
    var ss = SpreadsheetApp.openById(props[prefix+"_database_id"]);
  }
  var s = ss.getSheetByName("Feedback Form Responses");
  s.appendRow(form);
  return {"msg": "Your form was submitted successfully. You may close this page."}
}