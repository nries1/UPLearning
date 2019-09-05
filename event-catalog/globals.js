var props = PropertiesService.getScriptProperties().getProperties();
boMap = {"bksouthpd@strongschools.nyc": {"system": "Brooklyn South PL System", "dm": "Nick", "prefix": "bks"}, "rdecaul3@strongschools.nyc": {"system": "Affinity PL System", "dm": "Robert", "prefix": "afn"},
         "awashington6@strongschools.nyc": {"system": "Brooklyn North PL System", "dm": "Anthony", "prefix": "bkn"}, "jpatterson6@strongschools.nyc": {"system": "Manhattan PL System", "dm": "John", "prefix": "mhn"},
         "lparlato@strongschools.nyc": {"system": "Bronx PL System", "dm": "Lauren", "prefix": "bx"}, "dracic@strongschools.nyc": {"system": "Queens North PL System", "dm": "Dan", "prefix": "qn"},
         "kcrutchfield@strongschools.nyc": {"system": "Queens South PL System", "dm":"Kamila", "prefix": "qs"}, "statenislandplo@strongschools.nyc": {"system": "Staten Island PL System", "dm": "Stephen", "prefix": "si"},
         "kedwards15@strongschools.nyc": {"system": "Central PL System", "dm": "Rhodie","prefix": "c"}, "kcuriel@strongschools.nyc": {"system": "Queens South PL System", "dm":"Kamila", "prefix": "qs"},
         "Brooklyn South PL System": {"prefix": "bks"}, "Affinity PL System": {"prefix": "afn"}, "Brooklyn North PL System": {"prefix": "bkn"}, "Manhattan PL System": {"prefix": "mhn"},
         "Bronx PL System": {"prefix": "bx"}, "Queens North PL System": {"prefix": "qn"}, "Central PL System": {"prefix": "c"}, "Queens South PL System": {"prefix": "qs"}, "Staten Island PL System": {"prefix": "si"}
        }
/*
try {
var ss = SpreadsheetApp.openById(props.event_data_id);
var s = ss.getSheetByName("event creation form responses");
var r = s.getRange(2,1,s.getLastRow()-1,s.getLastColumn());
var rss = SpreadsheetApp.openById(props.reg_data_id);
var rs = rss.getSheetByName("form registrations");
var rd = rs.getRange(2,19,rs.getLastRow()-2,1).getValues();
var data = r.getValues();
} catch(error) {Logger.log(error)} finally {}
*/
var divisionIndex = 15; //col AD
var titleIndex = 2; //col E
var descriptionIndex = 3 //col Y
var locationIndex = 19; //col AG
var audienceIndex = 13; //col AB
var contentIndex = 16; //col AE
var gradeIndex = 14; //col AC
var dateIndex = 69; //col AJ
var regFormIndex = 52; //col BE
var currentRegistrantsIndex = 83; //col B
var lastDateIndex = 80;
var maxRegistrantsIndex = 6; //col G
var districtsIndex = 40;
var idIndex = 50;
var regFlyerIndex = 75;
var timesIndex = 71;
var publishIndex = 5;
var gradeBandIndex = 14;