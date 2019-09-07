function getDbnSupport(dbn, bcos) {
  var supports = [];

  for (var x = 0; x < bcos.length; x++) {
    var prefix = boMap[bcos[x]].prefix;
    var database = SpreadsheetApp.openById(props[prefix + "_database_id"]);
    var regData = database.getSheetByName("form registrations").getDataRange().getValues();
    var eventCreationData = database.getSheetByName("event creation form responses").getDataRange().getValues();
    var archiveSheet = SpreadsheetApp.openById(props[prefix + "_archive_id"]);
    var archiveEventData = archiveSheet.getSheetByName("Events").getDataRange().getValues();
    var archiveRegData = archiveSheet.getSheetByName("Registrants").getDataRange().getValues();
    var dbs = [archiveRegData, regData];
    var support;

    for (var i = 0; i < dbs.length; i++) {
      for (var j = 1; j < dbs[i].length; j++) {
        if (dbs[i][j][0] === "") {
          continue;
        }

        if (dbs[i][j][5] === dbn) {
          if (supports.reduce(function (count, sup) {
            if (sup.id === dbs[i][j][18]) {
              sup["count"]++;
              count++;
            }

            return count;
          }, 0) === 0) {
            support = new Support(dbs[i][j], bcos[x]);
            support.push(support);
          }
        }
      }
    }
  }

  return JSON.stringify(supports);
}

var Support = function Support(data, bco) {
  this.id = data[18];
  this.count = 1;
  this.instance = bco;

  if (this.id.length === 7) {
    this.support_type = "Professional Learning Event";
  } else {
    this.support_type = "Ad-hoc Support";
  }
};