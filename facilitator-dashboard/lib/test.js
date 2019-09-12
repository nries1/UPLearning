// nothing to see here.
function doIt() {
  Logger.log(getRegDetails("104PVFU"));
}

function xxx() {
  var today = new Date(new Date().getTime() - 15 * 60 * 60 * 1000);
  Logger.log(today);
  var foundDate = "";
  eventCreationData.forEach(function (row, index) {
    if (index === 0) {
      return;
    }

    if (row[dateIndex].toString().indexOf(",") === -1) {
      var eventDate = new Date(row[dateIndex]);

      if (eventDate.getMonth() === today.getMonth() && eventDate.getDate() === today.getDate()) {
        foundDate = row[1];
      }
    } else {
      eventCreationData[152][dateIndex].split(/,/).forEach(function (date) {
        if (new Date(date).getMonth() === today.getMonth() && new Date(date).getDate() === today.getDate()) {
          foundDate = row[2];
        }
      });
    }
  });
  Logger.log(foundDate);
}

;