function getGlobals() {
  Logger.log("HELLLOOO Im getting globals");
  var props = PropertiesService.getScriptProperties().getProperties();
  var boMap = JSON.parse(props.boMap);
  return SpreadsheetApp.
         openById(refSheet).
         getSheetByName(boMap[Session.getActiveUser().getEmail()].system).
         getDataRange().
         getValues().map(function(row,index) {
           if (index===0) {return false};
           var lastUpdate = new Date(row[6]);
           if (!Number(lastUpdate.getMonth()+1)) {lastUpdate = "N/A";} else {lastUpdate = Number(lastUpdate.getMonth()+1)+"/"+Number(lastUpdate.getDate())}
           var obj = {"name": row[3], "data_type": row[2], "ref_type": row[5],
                      "last_update": lastUpdate,"ref": row[8], "key": row[4], "placeholder": row[10]
                     }
           return obj;
         });
}