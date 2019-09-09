var props = PropertiesService.getScriptProperties().getProperties();
// These refer to the column indexes in the Event Creation Form Responses Sheet
var displayTitleIndex = 2;
var eventCreatorIndex = 1;
var firstFacEmailIndex = 8; // col# of the first facilitator email field - 1

var secondFacEmailIndex = 10; // col# of the second facilitator email field - 1

var thirdFacEmailIndex = 12; // col# of the third facilitator email field - 1

var eventTitleIndex = 51; // col# of the eventname - 1                   

var eventIdIndex = 50; // col# of the event id - 1   

var durationIndex = 53; // col# of the event duration - 1   

var firstDateIndex = 21; // col# of the first event date - 1   

var lastDateIndex = 80; // col# of the last event date - 1 

var eventRegLinkIndex = 57; // col# of the event registration link - 1

var openEventRegLinkIndex = 52;
var regFlyerIndex = 75; // col# of the ploDoc link - 1

var regFlyerIdIndex = 77;
var editEventLink = 73;
var userMail = Session.getActiveUser().getEmail(); // The email address of the user accessing the web app.

var resourceFolderIndex = 34;
var directorEmailIndex = 56;
var calendarEventIdIndex = 91;
var calendarName = props.calendar_name;
var attendanceFolderIndex = 90;
var divisionIndex = 15;
var descriptionIndex = 3;
var locationIndex = 19;
var audienceIndex = 13;
var contentIndex = 16;
var gradeIndex = 14;
var dateIndex = 69;
var districtsIndex = 40;
var maxRegistrantsIndex = 6;
var timesIndex = 71;
var facilitatorsIndex = 70;
var otherInfoIndex = 35;
var firstFacIndex = 7;
var firstFacEmailIndex = 8;
var secondFacEmailIndex = 10;
var thirdFacEmailIndex = 12;
var regFormIndex = 52;
var currentRegistrantsIndex = 83;
var archiveIndex = 87;
var feedbackIndex = 92;
var isCtleIndex = 32;
var fundingIndex = 33; // These refer to the column indexes in the Registration sheet

var r_eventTitleIndex = 19;
var r_eventIdIndex = 18;
var r_firstNameIndex = 2;
var r_lastNameIndex = 3;
var r_emailIndex = 4;
var r_dbnIndex = 5;
var r_roleIndex = 7;
var r_experienceIndex = 8;
var r_goalsIndex = 10;
var r_comfortIndex = 11;
var r_wantsCtleIndex = 13;
var r_idIndex = 42;
var r_hoursAttendedIndex = 61;
var r_waitlistIndex = 63;
var r_sentCtleIndex = 64;
var r_attendanceTrackedIndex = 59;
var r_day1AttnIndex = 44; // These refer to the column indexes in the feedback sheet

var f_fullEventTitleIndex = 1;
var f_firstResponseIndex = 2;
var f_lastResponseIndex = 8;