"use strict";

function createRegSs(events, instances, filters) {
  Logger.log(filters);
  var eventsData = [["Borough Office", "Event ID", "Event Title", "Description", "Public", "Capacity", "Facilitators", "Audience", "Grade Level", "Division", "Subject", "Times", "Location", "CTLE", "Funding", "Resource Folder", "Districts", "Support Type", "Feedback Received", "Duration", "Sessions", "Registered", "Registered Sessions", "Attended", "Sessions Attended", "Attendance Rate", "Attendance Track Rate"]];
  var dbnData = [["Event ID", "Event Title", "Sessions", "DBN", "Registered", "Attended Session 1", "Attended Session 2", "Attended Session 3", "Attended Session 4", "Attended Session 5", "Attended Session 6", "Attended Session 7", "Attended Session 8", "Attended Session 9", "Attended Session 10", "Attended Session 11"]];
  var newSs = SpreadsheetApp.openById(DriveApp.getFileById("11DH-IOs0mU0fVanEInBqQlnceJZDegcxGFEzQkr-QD8").makeCopy("Registrant info Report on " + new Date()).setSharing(DriveApp.Access.DOMAIN_WITH_LINK, DriveApp.Permission.EDIT).getId());

  for (var x = 0; x < instances.length; x++) {
    var prefix = boMap[instances[x]].prefix;
    events.forEach(function (event, index) {
      var eventRow = [];
      eventRow.push(instances[x], event.id, event.title, event.description, event["public"], event.max_regs, event.facilitators, event.audience, event.grade, event.division, event.content, event.times, event.location, event.ctle_eligible, event.funding, event.resource_folder, event.districts, event.support_type, event.feedback, event.duration, event.countDates, event.attendanceInfo.registered, event.attendanceInfo.regRate, event.attendanceInfo.attended1day, event.attendanceInfo.sessions_attended, event.attendanceInfo.attendanceRate || "NULL", event.attendanceInfo.attendanceTrackRate || "NULL");
      eventsData.push(eventRow);
      if (!event.attendanceInfo.dbns) return;
      event.attendanceInfo.dbns.forEach(function (dbn) {
        var dbnRow = [];
        dbnRow.push(event.id);
        dbnRow.push(event.title);
        dbnRow.push(event.countDates);
        dbnRow.push(dbn.dbn);
        dbnRow.push(dbn.registered);

        for (var i = 0; i < 11; i++) {
          if (dbn.attendance[i] || dbn.attendance[i] === 0) {
            dbnRow.push(dbn.attendance[i]);
          } else {
            dbnRow.push("N/A");
          }
        }

        dbnData.push(dbnRow);
      });
    });
  }

  newSs.getSheets()[0].setName("Registrants").getRange(1, 1, dbnData.length, dbnData[0].length).setValues(dbnData);
  newSs.insertSheet("Events", 1).getRange(1, 1, eventsData.length, eventsData[0].length).setValues(eventsData);
  newSs.insertSheet("Filters Applied", 2).getRange(1, 1, filters.length, 2).setValues(filters);
  return newSs.getUrl();
}

function createRegSsEmail(events, instances, email, filters) {
  var templateFile = DriveApp.getFileById("1uJjVjHfK7h-l-xY_x6UrRpp3Zm_BCujaj_JaJAoL6Io");
  var newSs = SpreadsheetApp.openById(templateFile.makeCopy("Registrant info Report on " + new Date()).setSharing(DriveApp.Access.DOMAIN_WITH_LINK, DriveApp.Permission.EDIT).getId());
  var eventHeaders = newSs.getSheetByName("Event Headers").getDataRange().getValues()[0];
  var regHeaders = newSs.getSheetByName("Reg Headers").getDataRange().getValues()[0];
  var fbHeaders = newSs.getSheetByName("FB Headers").getDataRange().getValues()[0];
  var dbnData = [["Event ID", "Event Title", "Sessions", "DBN", "Registered", "Attended Session 1", "Attended Session 2", "Attended Session 3", "Attended Session 4", "Attended Session 5", "Attended Session 6", "Attended Session 7", "Attended Session 8", "Attended Session 9", "Attended Session 10", "Attended Session 11"]];
  var eventsData = [];
  var regData = [];
  var fbData = [];
  var eventIds = events.map(function (event) {
    return event.id;
  });

  for (var x = 0; x < instances.length; x++) {
    var prefix = boMap[instances[x]].prefix;
    var mainDb = SpreadsheetApp.openById(props[prefix + "_database_id"]);
    var mainEvents = mainDb.getSheetByName("event creation form responses").getDataRange().getValues();
    var mainRegs = mainDb.getSheetByName("form registrations").getDataRange().getValues();
    var fb = mainDb.getSheetByName("Feedback Form Responses").getDataRange().getValues();
    var archiveDb = SpreadsheetApp.openById(props[prefix + "_archive_id"]);
    var archiveEvents = archiveDb.getSheetByName("Events").getDataRange().getValues();
    var archiveRegs = archiveDb.getSheetByName("Registrants").getDataRange().getValues(); //fill the event data

    mainEvents.forEach(function (row, index) {
      if (index === 0) return;
      if (eventIds.indexOf(row[50]) === -1) return;
      var formatRow = [];
      eventHeaders.forEach(function (header) {
        formatRow.push(row[mainEvents[0].indexOf(header)]);
      });
      formatRow.unshift(instances[x]);
      formatRow.push("active");
      eventsData.push(formatRow);
    });
    archiveEvents.forEach(function (row, index) {
      if (index === 0) return;
      if (eventIds.indexOf(row[50]) === -1) return;
      var formatRow = [];
      eventHeaders.forEach(function (header) {
        formatRow.push(row[archiveEvents[0].indexOf(header)]);
      });
      formatRow.unshift(instances[x]);
      formatRow.push("archived");
      eventsData.push(formatRow);
    }); //fill the reg data

    mainRegs.forEach(function (row, index) {
      if (index === 0) return;
      if (eventIds.indexOf(row[18]) === -1) return;
      var formatRow = [];
      regHeaders.forEach(function (header) {
        formatRow.push(row[mainRegs[0].indexOf(header)]);
      });
      formatRow.unshift(instances[x]);
      regData.push(formatRow);
    });
    archiveRegs.forEach(function (row, index) {
      if (index === 0) return;
      if (eventIds.indexOf(row[18]) === -1) return;
      var formatRow = [];
      regHeaders.forEach(function (header) {
        formatRow.push(row[archiveRegs[0].indexOf(header)]);
      });
      formatRow.unshift(instances[x]);
      regData.push(formatRow);
    }); //fill the feedback data

    fb.forEach(function (row, index) {
      if (index === 0) return;
      if (eventIds.indexOf(row[1].toString().slice(0, 7)) === -1) return;
      var formatRow = [];
      fbHeaders.forEach(function (header) {
        formatRow.push(row[fb[0].indexOf(header)]);
      });
      formatRow.unshift(instances[x]);
      fbData.push(formatRow);
    }); //fill the dbn data

    events.forEach(function (event, index) {
      if (!event.attendanceInfo.dbns) return;
      event.attendanceInfo.dbns.forEach(function (dbn) {
        var dbnRow = [];
        dbnRow.push(event.id);
        dbnRow.push(event.title);
        dbnRow.push(event.countDates);
        dbnRow.push(dbn.dbn);
        dbnRow.push(dbn.registered);

        for (var i = 0; i < 11; i++) {
          if (dbn.attendance[i] || dbn.attendance[i] === 0) {
            dbnRow.push(dbn.attendance[i]);
          } else {
            dbnRow.push("N/A");
          }
        }

        dbnData.push(dbnRow);
      });
    });
  }

  newSs.getSheetByName("Events").getRange(2, 1, eventsData.length, eventsData[0].length).setValues(eventsData);
  newSs.getSheetByName("Registrants").getRange(2, 1, regData.length, regData[0].length).setValues(regData);
  newSs.getSheetByName("DBNs").getRange(1, 1, dbnData.length, dbnData[0].length).setValues(dbnData);
  newSs.getSheetByName("Feedback").getRange(2, 1, fbData.length, fbData[0].length).setValues(fbData);
  newSs.getSheetByName("Filters Applied").getRange(2, 1, filters.length, 2).setValues(filters);
  MailApp.sendEmail(email, "Event Details Report " + new Date(), "Here is the event details report that you requested: " + newSs.getUrl());
}