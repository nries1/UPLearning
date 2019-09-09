function postToArchive(eventid, instance, sy) {
  const prefix = boMap[instance].prefix;
  const mainDb = new Spreadsheet(props[`${prefix}_database_id`], ['event creation form responses', 'form registrations']);
  let archiveSs;
   if (sy === "current") {
    archiveSs = new Spreadsheet(props[prefix + '_archive_id'], ['Events', 'Registrants']);
   } else {
    archiveSs = new Spreadsheet(props[prefix + '_' + sy], ['Events', 'Registrants']);
   }
  // find and delete the event and its registrants
  let thisEvent = mainDb.matchRow('event creation form responses', eventid, 50, function(row) {
    mainDb.sheets['event creation form responses'].deleteRow(row);
  });
  thisEvent.row_data.push(`=COUNTIF(Registrants!S:S,AY${Number(archiveSs.sheets.Events.getLastRow() + 1)})`)
  thisEvent.row_data.push(0);
  let registrants = mainDb.matchRows('form registrations', eventid, 18, function(row) {
    mainDb.sheets['form registrations'].deleteRow(row);
  });
  //append the event and its registrants to the archive
  try {
    archiveSs.sheets.Events.appendRow(thisEvent.row_data);
    registrants.forEach(function(registrant) {
      archiveSs.sheets.Registrants.appendRow(registrant.row_data);
    });
    return {success: true,
            msg: `Event ID ${eventid} was archived along with ${registrants.length} registrants.`
           }
  }
  //roll back the deletions if you're unable to append the data to the archive.
  catch(err) {
    event.pop();
    event.pop();
    mainDb.sheets['event creation form responses'].appendRow(thisEvent.row_data)
    registrants.forEach(function(registrant) {
      mainDb.sheets['form registrations'].appendRow(registrant.row_data);
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
  matchRow(sheetName, criterion, columnIndex, callback) {
    for (let i = 0; i < this.data[sheetName].length; i++) {
      if (this.data[sheetName][i][columnIndex] === criterion) {
        if (callback) callback(Number(i) + 1);
        return {row_number: Number(i) + 1, row_data: this.data[sheetName][i]}
      }
    }
  }
  matchRows(sheetName, criterion, columnIndex, callback) {
    let rows = [];
    for (let i = this.data[sheetName].length; i >= 1; i--) {
      if (this.data[sheetName][i][columnIndex] === criterion) {
        if (callback) callback(Number(i) + 1);
        rows.push({row_number: Number(i) + 1, row_data: this.data[sheetName][i]});
      }
    }
    return rows;
  }
}

function debug() {
  postToArchive("999MS19", "Brooklyn South PL System", "current");
}