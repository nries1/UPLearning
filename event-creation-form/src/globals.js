var props = PropertiesService.getScriptProperties().getProperties();

boMap = {"bksouthpd@strongschools.nyc": {"system": "Brooklyn South PL System", "dm": "Nick", "prefix": "bks"}, "rdecaul3@strongschools.nyc": {"system": "Affinity PL System", "dm": "Robert", "prefix": "afn"},
         "awashington6@strongschools.nyc": {"system": "Brooklyn North PL System", "dm": "Anthony", "prefix": "bkn"}, "jpatterson6@strongschools.nyc": {"system": "Manhattan PL System", "dm": "John", "prefix": "mhn"},
         "lparlato@strongschools.nyc": {"system": "Bronx PL System", "dm": "Lauren", "prefix": "bx"}, "dracic@strongschools.nyc": {"system": "Queens North PL System", "dm": "Dan", "prefix": "qn"},
         "kcrutchfield@strongschools.nyc": {"system": "Queens South PL System", "dm":"Kamila", "prefix": "qs"}, "statenislandplo@strongschools.nyc": {"system": "Staten Island PL System", "dm": "Stephen", "prefix": "si"},
         "kedwards15@strongschools.nyc": {"system": "Central PL System", "dm": "Rhodie","prefix": "c"}, "kcuriel@strongschools.nyc": {"system": "Queens South PL System", "dm":"Kamila", "prefix": "qs"},
         "Brooklyn South PL System": {"prefix": "bks"}, "Affinity PL System": {"prefix": "afn"}, "Brooklyn North PL System": {"prefix": "bkn"}, "Manhattan PL System": {"prefix": "mhn"},
         "Bronx PL System": {"prefix": "bx"}, "Queens North PL System": {"prefix": "qn"}, "Central PL System": {"prefix": "c"}, "Queens South PL System": {"prefix": "qs"}, "Staten Island PL System": {"prefix": "si"}
        }

var directorEmails = {"Instruction": "tnl",
               "Advance": "tnl",
               "Academic Policy, Systems, Performance, and Assessment": "tnl",
               "Student Services": "student_support",
               "Special Education": "sped",
               "English Language Learners": "ell",
               "Operations": "ops",
               "Finance": "hr",
               "Human Resources": "hr",
               "Data Managers": "dm_email",
               "Language Acquisition": "language_acquisition"};
var fscCodes = {"affinity": "A", "bronx": "X", "brooklyn north": "N", "brooklyn south": "S", "manhattan": "M", "queens north": "P", "queens south": "Q", "staten island": "R", "central": "C"}
var divMap = {"Instruction": "T",
               "Advance": "V",
               "Academic Policy, Systems, Performance, and Assessment": "A",
               "Student Services": "U",
               "Special Education": "P",
               "English Language Learners": "L",
               "Operations": "N",
               "Finance": "F",
               "Human Resources": "H",
               "Data Managers": "M",
               "Language Access": "Q",
               "District": "D",
               "School Improvement": "S"
              }
              
var timeObj = createTimeObj();