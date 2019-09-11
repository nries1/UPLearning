function setScriptProperties() {
  var properties = {};
  var globalRefSheets = SpreadsheetApp.openById("15Gv1ZbjUX2ZGSUOPBIUfDlo8jRod4DgwYoy2WLnmVoo").getSheets();
  for (var i=0; i<globalRefSheets.length; i++) {
    var instance = globalRefSheets[i].getName();
    Logger.log(boMap[instance]);
    var data = globalRefSheets[i].getDataRange().getValues();
    var tempArr = [];
    var tempObj = {};
    data.forEach(function(row) {
      var dataType = row[0];
      var keyName = row[4];
      if (dataType==="key") {if (boMap[instance]) {properties[boMap[instance].prefix+"_"+keyName]=row[8]}}
    });    
  }
  PropertiesService.getScriptProperties().setProperties(properties, true);
}

function getConfig() {
  Logger.log(PropertiesService.getScriptProperties().getProperty("bks_language_acquisition"));
}