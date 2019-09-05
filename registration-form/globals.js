var props = PropertiesService.getScriptProperties().getProperties();

var boMap = {"bksouthpd@strongschools.nyc": {"system": "Brooklyn South PL System", "dm": "Nick", "prefix": "bks"}, "rdecaul3@strongschools.nyc": {"system": "Affinity PL System", "dm": "Robert", "prefix": "afn"},
         "awashington6@strongschools.nyc": {"system": "Brooklyn North PL System", "dm": "Anthony", "prefix": "bkn"}, "jpatterson6@strongschools.nyc": {"system": "Manhattan PL System", "dm": "John", "prefix": "mhn"},
         "lparlato@strongschools.nyc": {"system": "Bronx PL System", "dm": "Lauren", "prefix": "bx"}, "dracic@strongschools.nyc": {"system": "Queens North PL System", "dm": "Dan", "prefix": "qn"},
         "kcrutchfield@strongschools.nyc": {"system": "Queens South PL System", "dm":"Kamila", "prefix": "qs"}, "statenislandplo@strongschools.nyc": {"system": "Staten Island PL System", "dm": "Stephen", "prefix": "si"},
         "kedwards15@strongschools.nyc": {"system": "Central PL System", "dm": "Rhodie","prefix": "c"}, "kcuriel@strongschools.nyc": {"system": "Queens South PL System", "dm":"Kamila", "prefix": "qs"},
         "Brooklyn South PL System": {"prefix": "bks", "borough": "Brooklyn South NYCDOE Borough Office"}, "Affinity PL System": {"prefix": "afn", "borough": "Affinity Citywide Office"}, "Brooklyn North PL System": {"prefix": "bkn", "borough": "Brooklyn North NYCDOE Borough Office"},
         "Manhattan PL System": {"prefix": "mhn", "borough": "Manhattan NYCDOE Borough Office"},
          "Bronx PL System": {"prefix": "bx", "borough": "Bronx NYCDOE Borough Office"}, "Queens North PL System": {"prefix": "qn", "borough": "Queens North NYCDOE Borough Office"}, "Central PL System": {"prefix": "c", "borough": "OFDC"}, "Queens South PL System": {"prefix": "qs", "borough": "Queens South NYCDOE Borough Office"}, "Staten Island PL System": {"prefix": "si", "borough": "Staten Island NYCDOE Borough Office"}
        }
var ctleMap = {"no": "No, I am not interested.", "yes": "Yes, I would like to receive CTLE certification hours, if they are available for my given session"}
var eventIdIndex = 50;
var r_eventIdIndex = 18;
var r_idIndex = 42;
var r_statusIndex = 63;
var eventIndex = 1;
var firstNameIndex = 2;
var lastNameIndex = 3;
var emailIndex = 4;
var dbnIndex = 5;
var subjectIndex = 9;
var expIndex = 8;
var roleIndex = 7;
var goalIndex = 10;
var comfortIndex = 11;
var ctleIndex = 13;
var dayIndex = 16;
var monthIndex = 15;
var yearIndex = 17;
var ssIndex = 14;
var e_idIndex = 50;
var e_datesIndex = 69;
var e_ecIndx = 1;
var e_facsIndx = 70;
var e_infoIndex = 35;
var e_locIndex = 19;
var e_maxIndex = 6;
var e_timesIndex = 71;
var e_titleIndex = 2;
var e_wlIndex = 43;
var e_wlSizeIndex = 44;