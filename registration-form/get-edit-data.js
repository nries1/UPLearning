/*
Take an event id parameter. Iterate over the registrant database to find matching event IDs.
Return the number of registrants to the client
*/
function getEditData(participantId,instance) {
  Logger.log("hello "+participantId+instance);
  var prefix = boMap[instance].prefix;
  var rss = SpreadsheetApp.openById(props[prefix+"_database_id"]);
  var rs = rss.getSheetByName("form registrations");
  var rd = rs.getDataRange().getValues();
  Logger.log("searching for participant id "+participantId);
  for (var i=1; i<rd.length; i++) {
    if (rd[i][r_idIndex]===participantId) {
      Logger.log("found");
      var out = new Registrant(rd[i]);
      return out;
    }
  };
}
  
function Registrant(row) {
  this.pid = row[r_idIndex];
  this.fn = row[firstNameIndex];
  this.ln = row[lastNameIndex];
  this.email = row[emailIndex];
  this.dbnin = row[dbnIndex];
  this.sub = row[subjectIndex];
  this.role = row[roleIndex];
  this.exp = row[expIndex];
  this.day = row[dayIndex];
  this.month = row[monthIndex];
  this.year = row[yearIndex];
  this.ss = row[ssIndex];
  row[r_statusIndex] === "Waitlist" ? this.rwl = true : this.rwl = false;
  this.goal = row[goalIndex];
  this.title = row[eventIndex].slice(8,row[eventIndex].length);
  this.id = row[r_eventIdIndex];
  this.comfort = row[comfortIndex];
  this["comf"+row[comfortIndex]] = row[comfortIndex];
  row[ctleIndex].indexOf("Yes")!== -1 ? this.ctley="yes" : this.ctlen = "no";
}


function testrtsadfdsad() {
  Logger.log(getEditData("nrinyjd","Brooklyn South PL System"))
}