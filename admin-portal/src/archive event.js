/* eslint-disable max-statements */
/* eslint-disable no-confusing-arrow */
function postToArchive(eventid, instance, sy) {
  var prefix = boMap[instance].prefix;
  var mainDb = SpreadsheetApp.openById(props[prefix+"_database_id"]);
  let archiveSs;
   if (sy==="current") {
    archiveSs = new Spreadsheet(props[prefix + '_archive_id'], ['Events', 'Registrants']);
   } else {
    archiveSs = new Spreadsheet(props[prefix + '_' + sy], ['Events', 'Registrants']);
   }
  let event = [];
  let registrants = [];
  // find and delete the event and its registrants
  let thisEvent = archiveSs.matchRow('Events', eventid, 50)
  thisEvent.row_data.push(`=COUNTIF(Registrants!S:S,AY${Number(archiveSs.sheets.Events.getLastRow() + 1)})`)
  thisEvent.row_data.push(0);
  event.push(thisEvent.row_data);
  archiveSs.sheets.Events.deleteRow(thisEvent.row_number)
  
  for (var j=regData.length-1; j>0; j--) {
    if (regData[j][18] === eventid) {
      registrants.push(regData[j]);
      regSheet.deleteRow(Number(j)+1);
    }
  }
  //append the event and its registrants to the archive
  try {
    archiveEventSheet.appendRow(event[0]);
    registrants.forEach(function(registrant) {
      archiveRegSheet.appendRow(registrant);
    });
    return {success: true, msg: "Event ID "+eventid+" was archived along with "+registrants.length+" registrants."}
  }
  //roll back the deletions if you're unable to append the data to the archive.
  catch(err) {
    event.pop();
    event.pop();
    eventSheet.appendRow(event[0])
    registrants.forEach(function(registrant) {
      regSheet.appendRow(registrant);
    });
    return {success: false, msg: err}
  }
}

class Spreadsheet {
  constructor(id, sheetNamesArray) {
    this.ss = SpreadsheetApp.openById(id);
    this.sheets = {};
    this.data = {};
    if (sheetNamesArray) {
      sheetNamesArray.forEach(sheetName => {
        this.sheets[sheetName] = this.ss.getSheetByName(sheetName);
        this.data[sheetName] = this.sheets[sheetName].getDataRange().getValues();
      })
    } else {
      this.ss.getSheets().forEach(sheet => {
        this.sheets[sheet.getName()] = sheet;
        this.data[sheet.getName()] = sheet.getDataRange().getValues();
      });
    }
  }
  matchRow(sheetName, criterion, columnIndex) {
    for (let i = 0; i < this.data[sheetName].length; i++) {
      if (this.data[sheetName][i][columnIndex] === criterion) {
        return {row_number: Number(i) + 1, row_data: this.data[sheetName][i]}
      }
    }
  }
  matchRows(sheetName, criterion, columnIndex, callback) {
    let rows = [];
    for (let i = this.data[sheetName].length; i >= 1; i--) {
      if (this.data[sheetName][i][columnIndex] === criterion) {
        callback(Number(i) + 1);
        rows.push({row_number: Number(i) + 1, row_data: this.data[sheetName][i]});
      }
    }
    return rows;
  }
}

function debug() {
  postToArchive("999MS19", "Brooklyn South PL System", "current");
}