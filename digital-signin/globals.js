var props = PropertiesService.getScriptProperties().getProperties();
boMap = {"bksouthpd@strongschools.nyc": {"system": "Brooklyn South PL System", "dm": "Nick", "prefix": "bks"}, "rdecaul3@strongschools.nyc": {"system": "Affinity PL System", "dm": "Robert", "prefix": "afn"},
         "awashington6@strongschools.nyc": {"system": "Brooklyn North PL System", "dm": "Anthony", "prefix": "bkn"}, "jpatterson6@strongschools.nyc": {"system": "Manhattan PL System", "dm": "John", "prefix": "mhn"},
         "lparlato@strongschools.nyc": {"system": "Bronx PL System", "dm": "Lauren", "prefix": "bx"}, "dracic@strongschools.nyc": {"system": "Queens North PL System", "dm": "Dan", "prefix": "qn"},
         "kcrutchfield@strongschools.nyc": {"system": "Queens South PL System", "dm":"Kamila", "prefix": "qs"}, "statenislandplo@strongschools.nyc": {"system": "Staten Island PL System", "dm": "Stephen", "prefix": "si"},
         "kedwards15@strongschools.nyc": {"system": "Central PL System", "dm": "Rhodie","prefix": "c"}, "kcuriel@strongschools.nyc": {"system": "Queens South PL System", "dm":"Kamila", "prefix": "qs"},
         "Brooklyn South PL System": {"prefix": "bks"}, "Affinity PL System": {"prefix": "afn"}, "Brooklyn North PL System": {"prefix": "bkn"}, "Manhattan PL System": {"prefix": "mhn"},
         "Bronx PL System": {"prefix": "bx"}, "Queens North PL System": {"prefix": "qn"}, "Central PL System": {"prefix": "c"}, "Queens South PL System": {"prefix": "qs"}, "Staten Island PL System": {"prefix": "si"}
        }
/*var regss = SpreadsheetApp.openById(props.reg_data_id);                              //A Spreadsheet object for the event registration spreadsheet
var regSheet = regss.getSheetByName("form registrations");                 //The sheet to which the reg form submits                       
var regData = regSheet.getDataRange().getValues();*/                      
var r_eventCodeIndex = 18;
var r_firstNameIndex = 2;
var r_eventTitleIndex = 1;
var r_lastNameIndex = 3;
var r_idIndex = 42;
var r_emailIndex = 4;
var r_regFormIndex = 43;
var r_dbnIndex = 5;
var r_responseIdIndex = 62;
var r_emailConfIndex = 63;
var r_wantsCtleIndex = 13;
var idLength = 7;
var r_date1AttnIndex = 44;
var qRshort = "https://chart.googleapis.com/chart?chs=150x150&cht=qr&chl=";