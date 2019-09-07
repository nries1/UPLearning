"use strict";

function getInstanceDetails(bcos, sy) {
  var out = {
    "events": [],
    "districts": []
  };

  for (var x = 0; x < bcos.length; x++) {
    var prefix = boMap[bcos[x]].prefix;
    props[prefix + "_all_districts"].split(",").forEach(function (d) {
      out.districts.push(d);
    });

    if (sy === "current") {
      var database = SpreadsheetApp.openById(props[prefix + "_database_id"]);
      var regData = database.getSheetByName("form registrations").getDataRange().getValues();
      var eventCreationData = database.getSheetByName("event creation form responses").getDataRange().getValues();
      var archiveSheet = SpreadsheetApp.openById(props[prefix + "_archive_id"]);
      var archiveEventData = archiveSheet.getSheetByName("Events").getDataRange().getValues();
      var archiveRegData = archiveSheet.getSheetByName("Registrants").getDataRange().getValues();
      var fbData = database.getSheetByName("Feedback Form Responses").getDataRange().getValues();
      var dbs = [archiveEventData, eventCreationData];
    } else {
      var dbs = [SpreadsheetApp.openById(props[prefix + "_arhchive_" + sy]).getSheetByName("Events").getDataRange().getValues()];
    }

    var event;

    for (var i = 0; i < dbs.length; i++) {
      for (var j = 1; j < dbs[i].length; j++) {
        if (dbs[i][j][0] === "") {
          continue;
        }

        if (i === 0) {
          event = new Event(dbs[i][j], archiveRegData, true, bcos[x]);
        } else {
          event = new Event(dbs[i][j], false, false, bcos[x]);
        }

        out.events.push(event);
      }
    }
  }

  return JSON.stringify(out);
}

function Event(data, database, archive, instance) {
  this.instance = instance;
  this.countDates = data[84];

  if (archive) {
    this.currentRegs = data[93];
  } else {
    this.currentRegs = data[85];
  }

  this.max_regs = data[maxRegistrantsIndex];
  this.feedback = data[86];

  if (archive) {
    this.status = "archived";
    this.ctle_sent = data[94];
  } else {
    this.status = "active";
    this.ctle_sent = false;
  }

  if (data[87] == "") {
    this.attendanceInfo = {};
  } else {
    var attnInfo = JSON.parse(data[87]);
    this.attendanceInfo = attnInfo;
    var dbns_attending = [];
    this.districts_attending = attnInfo.dbns.reduce(function (acum, dbn) {
      if (acum.indexOf(dbn.district) === -1) {
        acum.push(dbn.district);
      }

      if (dbns_attending.indexOf(dbn.dbn) === -1) {
        dbns_attending.push(dbn.dbn);
      }

      return acum;
    }, []).join(",");
    this.dbns_attending = dbns_attending;
  }

  this.division = data[divisionIndex];
  this.title = data[2];
  this.description = data[descriptionIndex];
  this.location = data[locationIndex];
  this.content = data[contentIndex];
  this.audience = data[audienceIndex];
  this.resource_folder = data[34];
  this["public"] = data[5];

  if (data[33] === "" || data[33] === "undefined" || data[33] === "None" || !data[33]) {
    this.funding = "Not Funded";
  } else {
    this.funding = "Funded";
  }

  this.support_type = data[41];

  if (data[84] === 1) {
    this.allDates = data[dateIndex].toString().slice(0, 15);
  } else {
    this.allDates = data[dateIndex].toString();
  }

  this.grade = data[gradeIndex];

  if (data[districtsIndex].toString().indexOf("[") === 0) {
    this.districts = JSON.parse(data[districtsIndex]).join(", ");
  } else {
    this.districts = data[districtsIndex];
  }

  this.id = data[eventIdIndex];
  this.funding = data[33];
  this.content = data[16];
  this.times = data[timesIndex];
  this.facilitators = data[facilitatorsIndex];
  this.ctle_eligible = data[32];

  if (data[43] === "No" || data[43] === "") {
    this.waitlist = "N/A";
  } else {
    this.waitlist = data[83] + "/" + data[44];
  }

  if (data[32] !== "This offering is NOT CTLE eligible" && data[32] !== "CTLE eligible, but certificate issued by NON-FSC office") {
    this.ctle = true;
    var urlctle = data[32];
  } else {
    var urlctle = "ineligible";
    this.ctle = false;
  }

  this.duration = data[53];

  if (this.status === "active") {
    var session1 = JSON.parse(data[58]);
    var starthour = session1.start_time.toString().slice(0, 2);
    var startminute = session1.start_time.toString().slice(3, 5);
  }

  this.feedback_link = "https://script.google.com/macros/s/AKfycbx3TCsDsYscGa83l4n5nNVDyYTIIXJCuI4z6B1v8jbpIG6ZMxc/exec?instance=" + encodeURIComponent(instance) + "&eventid=" + this.id;
  this.session_notes_link = "https://script.google.com/macros/s/AKfycbxgfnlryy7ViDEmNqeYyU3EKOsRnSI6qIJ3EIfoghETw8-NnXHn/exec?instance=" + encodeURIComponent(instance) + "&eventid=" + this.id + "&status=" + this.status + "&pdetails=" + encodeURIComponent(this.participant_details_link) + "&view=district&sharing=read";
}