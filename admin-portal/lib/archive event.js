function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function postToArchive(eventid, instance, sy) {
  var prefix = boMap[instance].prefix;
  var mainDb = new Spreadsheet(props["".concat(prefix, "_database_id")], ['event creation form responses', 'form registrations']);
  var archiveSs;

  if (sy === "current") {
    archiveSs = new Spreadsheet(props[prefix + '_archive_id'], ['Events', 'Registrants']);
  } else {
    archiveSs = new Spreadsheet(props[prefix + '_' + sy], ['Events', 'Registrants']);
  } // find and delete the event and its registrants


  var thisEvent = mainDb.matchRow('event creation form responses', eventid, 50, function (row) {
    mainDb.sheets['event creation form responses'].deleteRow(row);
  });
  thisEvent.row_data.push("=COUNTIF(Registrants!S:S,AY".concat(Number(archiveSs.sheets.Events.getLastRow() + 1), ")"));
  thisEvent.row_data.push(0);
  var registrants = mainDb.matchRows('form registrations', eventid, 18, function (row) {
    mainDb.sheets['form registrations'].deleteRow(row);
  }); //append the event and its registrants to the archive

  try {
    archiveSs.sheets.Events.appendRow(thisEvent.row_data);
    registrants.forEach(function (registrant) {
      archiveSs.sheets.Registrants.appendRow(registrant.row_data);
    });
    return {
      success: true,
      msg: "Event ID ".concat(eventid, " was archived along with ").concat(registrants.length, " registrants.")
    };
  } //roll back the deletions if you're unable to append the data to the archive.
  catch (err) {
    event.pop();
    event.pop();
    mainDb.sheets['event creation form responses'].appendRow(thisEvent.row_data);
    registrants.forEach(function (registrant) {
      mainDb.sheets['form registrations'].appendRow(registrant.row_data);
    });
    return {
      success: false,
      msg: err
    };
  }
}

var Spreadsheet =
/*#__PURE__*/
function () {
  "use strict";

  function Spreadsheet(id, sheetNamesArray) {
    var _this = this;

    _classCallCheck(this, Spreadsheet);

    this.ss = SpreadsheetApp.openById(id);
    this.sheets = {};
    this.data = {};

    if (sheetNamesArray) {
      sheetNamesArray.forEach(function (sheetName) {
        _this.sheets[sheetName] = _this.ss.getSheetByName(sheetName);
        _this.data[sheetName] = _this.sheets[sheetName].getDataRange().getValues();
      });
    } else {
      this.ss.getSheets().forEach(function (sheet) {
        _this.sheets[sheet.getName()] = sheet;
        _this.data[sheet.getName()] = sheet.getDataRange().getValues();
      });
    }
  }

  _createClass(Spreadsheet, [{
    key: "matchRow",
    value: function matchRow(sheetName, criterion, columnIndex, callback) {
      for (var i = 0; i < this.data[sheetName].length; i++) {
        if (this.data[sheetName][i][columnIndex] === criterion) {
          if (callback) callback(Number(i) + 1);
          return {
            row_number: Number(i) + 1,
            row_data: this.data[sheetName][i]
          };
        }
      }
    }
  }, {
    key: "matchRows",
    value: function matchRows(sheetName, criterion, columnIndex, callback) {
      var rows = [];

      for (var i = this.data[sheetName].length - 1; i >= 1; i--) {
        if (this.data[sheetName][i][columnIndex] === criterion) {
          if (callback) callback(Number(i) + 1);
          rows.push({
            row_number: Number(i) + 1,
            row_data: this.data[sheetName][i]
          });
        }
      }

      return rows;
    }
  }]);

  return Spreadsheet;
}();

function debug() {
  postToArchive("999MS19", "Brooklyn South PL System", "current");
}