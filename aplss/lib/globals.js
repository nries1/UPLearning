var refSheet = "15Gv1ZbjUX2ZGSUOPBIUfDlo8jRod4DgwYoy2WLnmVoo";
var originalId = "1kwbrVsiqIgzONZWZeBNe4I25tg8T4r-w";
//var i = "10lP9NMzIcx8sNqvNB65K7RvQKGW9m2P3"
var boMap = {"bksouthpd@strongschools.nyc": {system: "Brooklyn South PL System", dm: "Nick"}, "affinityfsc@strongschools.nyc": {system: "Affinity PL System", dm: "Robert"},
         "awashington6@strongschools.nyc": {system: "Brooklyn North PL System", dm: "Anthony"},"bknorthpl@strongschools.nyc": {system: "Brooklyn North PL System", dm: "Anthony"}, "mnboplos@strongschools.nyc": {system: "Manhattan PL System", dm: "John"},
         "lparlato@strongschools.nyc": {system: "Bronx PL System", dm: "Lauren"}, "dracic@strongschools.nyc": {system: "Queens North PL System", dm: "Dan"}, "queensnorth@strongschools.nyc": {system: "Queens North PL System", dm: "Dan"},
         "kcrutchfield@strongschools.nyc": {system: "Queens South PL System", dm:"Kamila"}, "statenislandplo@strongschools.nyc": {system: "Staten Island PL System", dm: "Stephen"},
         "kedwards15@strongschools.nyc": {system: "Central PL System", dm: "Rhodie"}, "kcuriel@strongschools.nyc": {system: "Queens South PL System", dm:"Kamila"}
        }

function setProps() {
  PropertiesService.getScriptProperties().setProperty("boMap", JSON.stringify(boMap));
  Logger.log(JSON.parse(PropertiesService.getScriptProperties().getProperty("boMap"))["bksouthpd@strongschools.nyc"]);
  Logger.log(PropertiesService.getScriptProperties().getProperty("boMap"));
}