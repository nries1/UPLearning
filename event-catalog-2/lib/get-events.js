function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var getEvents = function getEvents(instances) {
  return JSON.stringify(instances.reduce(function (allEvents, instance) {
    var ss = new Spreadsheet(props["".concat(boMap[instance].prefix, "_database_id")], ['event creation form responses']);
    allEvents.concat(ss.data['event creation form responses']);
    return allEvents;
  }, []));
};

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