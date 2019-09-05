function Event(row) {
  this.currentRegs = row[85];
  this.countDates = row[84];
  this.gradeband = row[gradeBandIndex];   
  this.eventObjdivision = row[divisionIndex];
  this.title = row[titleIndex];
  this.division = row[15];
  this.description = row[descriptionIndex];
  this.location = row[locationIndex];
  this.content = row[contentIndex];
  this.audience = row[36];
  this.firstDate = row[21].toString().slice(0,15);
  this.last_date = row[21+Number(row[84])-1].toString().slice(0,15);
  if (row[84]===1) {
          this.dates =  this.firstDate.slice(0,3)+"<span style='color: #f05537;'>"+ this.firstDate.slice(3,10)+"</span>"+this.firstDate.slice(10,15)
          this.numDates = "<span style='color: #f05537;'>single date</span> on "
          this.allDates =  this.firstDate;
        } else {
          this.dates =this.firstDate.slice(0,3)+"<span style='color: #f05537;'>"+this.firstDate.toString().slice(3,10)+"</span>"+this.firstDate.toString().slice(10,15)+" <span style='color: #f05537;'>through</span> "+this.last_date.slice(0,3)+"<span style='color: #f05537;'>"+this.last_date.slice(3,10)+"</span>"+this.last_date.slice(10,15);
          this.numDates = "<span style='color: #f05537;'>"+this.countDates+" dates</span> from ";
          this.allDates = row[69];
   }
   this.grade = row[gradeIndex];
   this.regForm = row[regFormIndex];
   this.regFlyer = row[regFlyerIndex];
   row[districtsIndex].toString().indexOf("[")===0 ? this.districts = JSON.parse(row[districtsIndex]) : this.districts = row[districtsIndex];
   this.id = row[idIndex];
   this.times = row[timesIndex];
   row[maxRegistrantsIndex] - Number(this.currentRegs) <= 5 ? this.registrants = "<span style='color: red;'>"+this.currentRegs+"/"+row[maxRegistrantsIndex]+"</span>" : this.registrants = "<span style='color: green;'>"+this.currentRegs+"/"+row[maxRegistrantsIndex]+"</span>"
}


// send the data to the client
function getEventsData(instance) {
  if (instance === "Queens South PL System Beta") {
    var regSheet = SpreadsheetApp.openById("1h8E-o7olAoOkZfkIDWJCxvbqMjTm-n9JrCea1oTjLaI").getSheetByName("form registrations")
    var regData = regSheet.getRange(2,19,regSheet.getLastRow(),1).getValues();
    var data = SpreadsheetApp.openById("10KWd7W-dAByqZww7p7ZMispuNMaFNjqm-r4fDmIJ7mU").getSheetByName("event creation form responses").getDataRange().getValues();
  } else {
    var prefix = boMap[instance].prefix;
    var database = SpreadsheetApp.openById(props[prefix+"_database_id"])
    var regSheet = database.getSheetByName("form registrations")
    var regData = regSheet.getRange(2,19,regSheet.getLastRow(),1).getValues();
    var data = database.getSheetByName("event creation form responses").getDataRange().getValues();    
  }
  var event;
  var formatData = [];
  data.forEach(function(row) {
    if (new Date(row[lastDateIndex]).getTime() - new Date().getTime() > 3*60*60*1000  //event must be more than 3 hrs away
        &&
        row[publishIndex] === "Yes, publish for registration") {
      if (instance!=="Queens South PL System Beta") {
        var currentRegs = row[85];
      } else {
        var currentRegs = getRegs(row[idIndex],regData);
      }
      if ((row[maxRegistrantsIndex] - currentRegs > 0) || 
          ((row[maxRegistrantsIndex] - currentRegs <= 0) &&
           (row[43]==="Yes" && (row[44]-row[83] > 0)))
          ) {
      event = new Event(row);
      formatData.push(event);
      }
    }
  });
  //sort by event division, then by title, then by date
  formatData.sort(function(event1,event2) {
    if (event1.division.toUpperCase() < event2.division.toUpperCase()) {
      return -1;
    }
    if (event1.division.toUpperCase() > event2.division.toUpperCase()) {
      return 1;
    }
    return 0;    
  }).sort(function(event1,event2) {
    if (event1.title.toUpperCase() < event2.title.toUpperCase()) {
      return -1;
    }
    if (event1.title.toUpperCase() > event2.title.toUpperCase()) {
      return 1;
    }
    return 0;
  }).sort(function(event1,event2) {
    if (new Date(event1.firstDate).getTime() < new Date(event2.firstDate).getTime()) {
      return -1;
    }
    if (new Date(event1.firstDate).getTime() > new Date(event2.firstDate).getTime()) {
      return 1;
    }
    return 0;    
  });
  return JSON.stringify(formatData);
}