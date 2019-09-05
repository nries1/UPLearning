var boMap = {"bksouthpd@strongschools.nyc": {"system": "Brooklyn South PL System", "dm": "Nick", "prefix": "bks"}, "rdecaul3@strongschools.nyc": {"system": "Affinity PL System", "dm": "Robert", "prefix": "afn"},
         "awashington6@strongschools.nyc": {"system": "Brooklyn North PL System", "dm": "Anthony", "prefix": "bkn"}, "jpatterson6@strongschools.nyc": {"system": "Manhattan PL System", "dm": "John", "prefix": "mhn"},
         "lparlato@strongschools.nyc": {"system": "Bronx PL System", "dm": "Lauren", "prefix": "bx"}, "dracic@strongschools.nyc": {"system": "Queens North PL System", "dm": "Dan", "prefix": "qn"},
         "kcrutchfield@strongschools.nyc": {"system": "Queens South PL System", "dm":"Kamila", "prefix": "qs"}, "statenislandplo@strongschools.nyc": {"system": "Staten Island PL System", "dm": "Stephen", "prefix": "si"},
         "kedwards15@strongschools.nyc": {"system": "Central PL System", "dm": "Rhodie","prefix": "c"}, "kcuriel@strongschools.nyc": {"system": "Queens South PL System", "dm":"Kamila", "prefix": "qs"},
         "Brooklyn South PL System": {"prefix": "bks", "borough": "Brooklyn South NYCDOE Borough Office"}, "Affinity PL System": {"prefix": "afn", "borough": "Affinity Citywide Office"}, "Brooklyn North PL System": {"prefix": "bkn", "borough": "Brooklyn North NYCDOE Borough Office"},
         "Manhattan PL System": {"prefix": "mhn", "borough": "Manhattan NYCDOE Borough Office"},
          "Bronx PL System": {"prefix": "bx", "borough": "Bronx NYCDOE Borough Office"}, "Queens North PL System": {"prefix": "qn", "borough": "Queens North NYCDOE Borough Office"}, "Central PL System": {"prefix": "c", "borough": "OFDC"}, "Queens South PL System": {"prefix": "qs", "borough": "Queens South NYCDOE Borough Office"}, "Staten Island PL System": {"prefix": "si", "borough": "Staten Island NYCDOE Borough Office"}
        }


//columns in the archive events sheet
var ae_gradeBandIndex = 14;
var ae_divisionIndex = 15;
var ae_locationIndex = 19;
var ae_eventStartIndex = 21;
var ae_ctleTypeIndex = 32;
var ae_regsArchivedIndex = 93;
var ae_ctleSentIndex = 94;
var ae_registrantsIndex = 85;
var ae_eventIdIndex = 50;
var ae_eventTitleIndex = 2;

//columns in the archive regs sheet
var ar_fNameIndex = 2;
var ar_lNameIndex = 3;
var ar_emailIndex = 4;
var ar_wantsCtleIndex =13;
var ar_ssNumIndex = 14;
var ar_bMonthIndex = 15;
var ar_bDayIndex = 16;
var ar_bYearIndex = 17;
var ar_eventIdIndex = 18;
var ar_eventNameIndex = 19;
var ar_eventStartIndex = 20;
var ar_pIdIndex = 42;
var ar_hoursAttendedIndex = 61;
var ar_ctleSentIndex = 64;

//columns in the registration response sheet
var r_dbnIndex = 5;
var r_eventIdIndex = 18;
var r_archivedIndex = 60;
var r_responseIdIndex = 62;
var r_waitlistIndex = 63;
var r_attendance1Index = 44;
var r_attendance11Index = 54;

//columns in the event creation sheet
var responseIdIndex = 74;
var editResponseCol = 74;
var eventIdLength = 8; //including dash
var dmEmail = "nries@schools.nyc.gov";
var dmName = "Nicolas Ries";
var eventCreatorIndex = 1;
var sessionTitleIndex = 2;
var fac1Index = 7;
var fac1EmailIndex = 8;
var fac2Index = 9;
var fac2EmailIndex = 10;
var fac3Index = 11;
var fac3EmailIndex = 12;
var sessionStartTimeIndex = 17;
var sessionEndTimeIndex = 18;
var sessionFirstDateIndex = 21;
var sessionLastDateIndex = 31;
var sessionDescriptionIndex = 3;
var sessionLocationIndex = 19;
var sessionDatesIndex = 69;
var sessionFacsIndex = 70;
var sessionTimesIndex = 71;
var daysInEventIndex = 84;
var idCol = 51;
var regUrlCol = 53;
var timesCol = 72;
var fullPlTitleCol = 52;
var firstFullDateCol = 59;
var allFacsCol = 71;
var regFlyerCol = 76;
var regFlyerIdCol = 78;
var regFlyerIdIndex = 77;
var regFlyerEditDateCol = 77;
var lastDateOfEventCol = 81;
var timeDurationCol = 54;
var closedRegUrlCol = 58;
var fbFormStatusCol = 82;
var signInSheetCol = 83;
var attendanceTrackRateCol = 87;
var archiveCol = 88;
var facReminderCol = 89;
var attendanceFolderCol = 91;