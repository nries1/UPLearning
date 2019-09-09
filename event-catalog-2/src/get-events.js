const getEvents = instances => JSON.stringify(instances.reduce((allEvents, instance) => {
    let ss = new Spreadsheet(props[`${boMap[instance].prefix}_database_id`], ['event creation form responses']);
    allEvents.concat(ss.data['event creation form responses']);
    return allEvents;
}, []));

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
      for (let i = this.data[sheetName].length-1; i >= 1; i--) {
        if (this.data[sheetName][i][columnIndex] === criterion) {
          if (callback) callback(Number(i) + 1);
          rows.push({row_number: Number(i) + 1, row_data: this.data[sheetName][i]});
        }
      }
      return rows;
    }
  }