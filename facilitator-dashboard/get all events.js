function getAllEvents(instance) {
  var prefix = boMap[instance].prefix;
  var database = SpreadsheetApp.openById(props[prefix+"_database_id"]);
  var regData = database.getSheetByName("form registrations").getDataRange().getValues();
  var eventCreationData = database.getSheetByName("event creation form responses").getDataRange().getValues();
  var archiveSheet = SpreadsheetApp.openById(props[prefix+"_archive_id"]);
  var archiveEventData = archiveSheet.getSheetByName("Events").getDataRange().getValues();
  var archiveRegData = archiveSheet.getSheetByName("Registrants").getDataRange().getValues();  
  var fbData = database.getSheetByName("Feedback Form Responses").getDataRange().getValues();
  var dbs = [archiveEventData, eventCreationData];
  var event;
  var out = {"events": [], "districts": props[prefix+"_all_districts"].split(",")};
  for (var i=0; i<dbs.length; i++) {
    for (var j=1; j<dbs[i].length; j++) {
      if (dbs[i][j][eventCreatorIndex].toUpperCase() === userMail.toUpperCase() ||
          dbs[i][j][firstFacEmailIndex].toUpperCase() === userMail.toUpperCase() ||
          dbs[i][j][secondFacEmailIndex].toUpperCase() === userMail.toUpperCase() ||
          dbs[i][j][thirdFacEmailIndex].toUpperCase() === userMail.toUpperCase()   ||
          userMail.toLowerCase() === props[prefix+"_dm_email"].toLowerCase() ||
          userMail.toLowerCase() === "professionallearning@strongschools.nyc" ||
          dbs[i][j][directorEmailIndex].toUpperCase() === userMail.toUpperCase())
         {
           if (dbs[i][j][0]==="") {continue;}
            if (i===0) {
              event = new Event(dbs[i][j],archiveRegData,true,instance);
            } else {
              event = new Event(dbs[i][j],false,false,instance);
            }
           out.events.push(event);
          }
    }
  }
  return JSON.stringify(out);
}

function Event(data,database,archive,instance) {
  this.countDates = data[84];
  if (archive) {
    this.currentRegs = data[93];
  } else {
    this.currentRegs = data[85];
  }
  this.max_regs = data[maxRegistrantsIndex]
  this.feedback = data[86];
  if (archive) {
    this.status = "archived";
  } else {
    this.status = "active";
  }
  if (data[87]=="") {
      this.attendanceInfo={}
    } else {
      var attnInfo = JSON.parse(data[87])
      this.attendanceInfo = attnInfo;
      this.districts_attending = attnInfo.dbns.reduce(function(acum,dbn) {
        if (acum.indexOf(dbn.district)===-1) {acum.push(dbn.district)}
        return acum;
      },[]).join(",");
  }
  this.division = data[divisionIndex];
  this.title = data[2];
  this.description = data[descriptionIndex];
  this.location = data[locationIndex];
  this.content = data[contentIndex];
  this.audience = data[audienceIndex];
  this.firstDate = data[dateIndex].toString().slice(0,15);
  this.last_date = data[firstDateIndex+Number(data[84]-1)].toString().slice(0,15);
  if (data[84] === 1) {
          this.dates = data[dateIndex].toString().slice(0,15);
          this.allDates = data[dateIndex].toString().slice(0,15);
  } else {
          this.dates = data[dateIndex].toString().slice(0,15);+" <span style='color: #f05537;'>through</span> "+data[firstDateIndex+Number(data[84])-1].toString().slice(0,15);
          this.allDates = data[dateIndex].toString();
  }
  if (data[84]===1) {
    this.numDates = "<span style='color: #f05537;'>single date</span> on "
  } else {
    this.numDates = "<span style='color: #f05537;'>"+data[84]+" dates</span> from "
  }
  this.grade = data[gradeIndex];
  if (data[districtsIndex].toString().indexOf("[")===0) {
    this.districts = JSON.parse(data[districtsIndex]).join(", ");
  } else {
    this.districts = data[districtsIndex];
  }
  this.id = data[eventIdIndex];
  this.funding = data[33];
  this.content = data[16];
  this.times = data[timesIndex];
  this.facilitators = data[facilitatorsIndex];
  this.otherInfo = data[otherInfoIndex];
  this.fullTitle = data[eventTitleIndex];
  this.ctle_eligible = data[32];
  if (data[43]==="No" || data[43]==="") {
    this.waitlist = "N/A"
  } else {
    this.waitlist = data[83]+"/"+data[44];
  }
  this.facilitatorContact = "Contact "+data[firstFacIndex]+" at "+data[firstFacEmailIndex];
  this.event_page = data[55];
  this.reg_link = data[52];
  if (data[32]!=="This offering is NOT CTLE eligible" && data[32]!=="CTLE eligible, but certificate issued by NON-FSC office") {
    this.ctle=true;
    var urlctle = data[32];
  } else {
    var urlctle = "ineligible";
    this.ctle=false;
  }
  this.duration = data[53];
  
  
  var particiapntLinkDates = [];
  this.urlDates = this.allDates.split(",").map(function(date) {var formatDate = new Date(date);
                                                               particiapntLinkDates.push(Number(formatDate.getMonth()+1)+"-"+formatDate.getDate()+"-"+formatDate.getFullYear());
                                                               return formatDate.getMonth()+"-"+formatDate.getDate()}).join("/");
  this.qr_codes = "https://script.google.com/macros/s/AKfycbwzsTGlucmFKkEtSg3zuMVtBLSvmwqbOqMbheo_sWLOp3hzVDGa/exec?instance="+encodeURIComponent(instance)+"&id="+this.id+"&title="+encodeURIComponent(this.title)+"&ctle="+this.ctle+"&dates="+this.urlDates+"&duration="+this.duration+"&regLink="+encodeURIComponent(this.reg_link);
  this.attendance_link = "https://script.google.com/macros/s/AKfycbyf4W3SZl5P3xvIXIJ-RJ8o3UfNAjd0L2yebRfhgtih2yIISfM/exec?instance="+instance.replace(/ /g,"+")+"&id="+this.id+"&title="+encodeURIComponent(this.title)+"&ctle="+this.ctle+"&duration="+this.duration+"&reg="+encodeURIComponent(this.reg_link);
  this.edit_link = data[73];
  if (this.status==="active") {
    Logger.log(this.id);
    var session1 = JSON.parse(data[58]);
    var starthour = session1.start_time.toString().slice(0,2);
    var startminute = session1.start_time.toString().slice(3,5);
  }
  this.signin_link = "https://script.google.com/macros/s/AKfycbzxslr3lnJlzLFoQqjEGHru9GlOaV32EOHs6gSE1CEdgzYlrxk/exec?id="+this.id+"&title="+encodeURIComponent(this.title)+"&ctle="+this.ctle+"&duration="+this.duration+"&dates="+this.urlDates+"&funding="+this.funding+"&instance="+instance.replace(/ /g,"+")+"&starthour="+starthour+"&startminute="+startminute;
  this.participant_details_link="https://script.google.com/macros/s/AKfycbw-Svb9_fWqYXlW153ST_htOeGLytyjB-tSq8aV66vahu5ETIc7/exec?instance="+encodeURIComponent(instance)+"&eventid="+this.id+"&status="+this.status+"&sessions="+data[84]+"&duration="+this.duration+"&dates="+particiapntLinkDates.join("/")+"&title="+encodeURIComponent(this.title)+"&ctle="+encodeURIComponent(urlctle)+"&division="+this.division+"&gradeband="+data[14]+"&eventstart="+encodeURIComponent(new Date(data[21]).toString().slice(0,15))+"&location="+this.location;
  this.feedback_link="https://script.google.com/macros/s/AKfycbx3TCsDsYscGa83l4n5nNVDyYTIIXJCuI4z6B1v8jbpIG6ZMxc/exec?instance="+encodeURIComponent(instance)+"&eventid="+this.id;
  this.session_notes_link="https://script.google.com/macros/s/AKfycbxgfnlryy7ViDEmNqeYyU3EKOsRnSI6qIJ3EIfoghETw8-NnXHn/exec?instance="+encodeURIComponent(instance)+"&eventid="+this.id+"&status="+this.status+"&pdetails="+encodeURIComponent(this.participant_details_link);
  this.feedback_form="https://script.google.com/macros/s/AKfycbwXs13RmZjPTZMeTDLSNY6r5xVwmFc-HRGNW3lHFLRudH1iBG0/exec?title="+encodeURIComponent(this.title)+"&id="+this.id+"&num=TBD&instance="+encodeURIComponent(instance);
}