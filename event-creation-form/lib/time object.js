function createTimeObj() {
  var timeObj = {};

  for (var i = 0; i < 24; i++) {
    if (i === 0) {
      for (var x = 0; x < 60; x++) {
        if (x < 10) {
          timeObj["00" + ":0" + x] = 12 + ":0" + x + ":00 AM";
        } else {
          timeObj["00" + ":" + x] = 12 + ":" + x + ":00 AM";
        }
      }
    }

    if (i > 0 && i < 10) {
      for (var n = 0; n < 60; n++) {
        if (n < 10) {
          timeObj["0" + i + ":0" + n] = i + ":0" + n + ":00 AM";
        } else {
          timeObj["0" + i + ":" + n] = i + ":" + n + ":00 AM";
        }
      }
    }

    if (i >= 10 && i < 12) {
      for (var k = 0; k < 60; k++) {
        if (k < 10) {
          timeObj[i + ":0" + k] = i + ":0" + k + ":00 AM";
        } else {
          timeObj[i + ":" + k] = i + ":" + k + ":00 AM";
        }
      }
    }

    if (i === 12) {
      for (var j = 0; j < 60; j++) {
        if (j < 10) {
          timeObj[i + ":0" + j] = i + ":0" + j + ":00 PM";
        } else {
          timeObj[i + ":" + j] = i + ":" + j + ":00 PM";
        }
      }
    }

    if (i > 12 && i <= 24) {
      for (var j = 0; j < 60; j++) {
        if (j < 10) {
          timeObj[i + ":0" + j] = Number(i) - 12 + ":0" + j + ":00 PM";
        } else {
          timeObj[i + ":" + j] = Number(i) - 12 + ":" + j + ":00 PM";
        }
      }
    }
  }

  return timeObj;
}

function test() {
  Logger.log(createTimeObj()["12:01"]);
}