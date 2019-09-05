function getFeedback(eventId,instance) {
  
  if (instance==="Queens South PL System Beta") {
    var prefix = "qs";
    var fbss = SpreadsheetApp.openById(props[prefix+"_fb_data_id"]);
    var fbData = fbss.getSheetByName("Feedback Form Responses").getDataRange().getValues();
  } else {
    var prefix = boMap[instance].prefix;
    var fbData = SpreadsheetApp.openById(props[prefix+"_database_id"]).getSheetByName("Feedback Form Responses").getDataRange().getValues();
  }
  var eventFeedback = {"title": "", "id": eventId, "Q1":[],"Q2":[],"Q3":[],"Q4":[],"Q5":[],"Q6":[],"Q7":[]}
  fbData.forEach(function(form) {
    if (form[f_fullEventTitleIndex].slice(0,7)===eventId) {
      eventFeedback.title = form[f_fullEventTitleIndex];
      for (var i = f_firstResponseIndex; i <= f_lastResponseIndex; i++) {
        var questionNo = Number(i)-1;
        if (form[i] !== "") {eventFeedback["Q"+questionNo].push(form[i]);}
      }
    }
  });
  return eventFeedback;
}



function getNumFeedback(eventId,fbData) {
  var numFb = 0;
  for (var i=0; i<fbData.length; i++) {
    if (fbData[i][f_fullEventTitleIndex].slice(0,7)===eventId) {
      numFb++;
    }
  }
  return numFb;
}