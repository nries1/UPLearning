var props = PropertiesService.getScriptProperties().getProperties();

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

var boMap = {"bksouthpd@strongschools.nyc": {"system": "Brooklyn South PL System", "dm": "Nick", "prefix": "bks"}, "rdecaul3@strongschools.nyc": {"system": "Affinity PL System", "dm": "Robert", "prefix": "afn"},
         "awashington6@strongschools.nyc": {"system": "Brooklyn North PL System", "dm": "Anthony", "prefix": "bkn"}, "jpatterson6@strongschools.nyc": {"system": "Manhattan PL System", "dm": "John", "prefix": "mhn"},
         "lparlato@strongschools.nyc": {"system": "Bronx PL System", "dm": "Lauren", "prefix": "bx"}, "dracic@strongschools.nyc": {"system": "Queens North PL System", "dm": "Dan", "prefix": "qn"},
         "kcrutchfield@strongschools.nyc": {"system": "Queens South PL System", "dm":"Kamila", "prefix": "qs"}, "statenislandplo@strongschools.nyc": {"system": "Staten Island PL System", "dm": "Stephen", "prefix": "si"},
         "kedwards15@strongschools.nyc": {"system": "Central PL System", "dm": "Rhodie","prefix": "c"}, "kcuriel@strongschools.nyc": {"system": "Queens South PL System", "dm":"Kamila", "prefix": "qs"},
         "Brooklyn South PL System": {"prefix": "bks", "borough": "Brooklyn South NYCDOE Borough Office"}, "Affinity PL System": {"prefix": "afn", "borough": "Affinity Citywide Office"}, "Brooklyn North PL System": {"prefix": "bkn", "borough": "Brooklyn North NYCDOE Borough Office"},
         "Manhattan PL System": {"prefix": "mhn", "borough": "Manhattan NYCDOE Borough Office"},
          "Bronx PL System": {"prefix": "bx", "borough": "Bronx NYCDOE Borough Office"}, "Queens North PL System": {"prefix": "qn", "borough": "Queens North NYCDOE Borough Office"}, "Central PL System": {"prefix": "c", "borough": "OFDC"}, "Queens South PL System": {"prefix": "qs", "borough": "Queens South NYCDOE Borough Office"}, "Staten Island PL System": {"prefix": "si", "borough": "Staten Island NYCDOE Borough Office"}
        }
        
function getUserPermissions() {
  var user = Session.getActiveUser().getEmail();
  if (Object.keys(boMap).indexOf(user) !== -1 || user==="professionallearning@strongschools.nyc") {
    return "dm";
  } else {
    return "basic";
  }
}