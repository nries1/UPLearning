function getEditData(id, instance) {
  var prefix = boMap[instance].prefix;
  var ss = SpreadsheetApp.openById(props[prefix + "_database_id"]);
  var s = ss.getSheetByName("event creation form responses");
  var data = s.getDataRange().getValues();
  var headers = data[0];
  var out = {
    success: true,
    form_values: [{
      bco: instance
    }],
    sessions: [],
    'Event Creator': '',
    'TimeStamp': ''
  };

  for (var i = 1; i < data.length; i++) {
    if (data[i][50] === id) {
      out['TimeStamp'] = data[i][0];
      out['Event Creator'] = data[i][1];

      for (var j = 0; j < 52; j++) {
        if (data[i][j] !== "") {
          var formValue = {};
          formValue[headers[j]] = data[i][j].toString();
          out.form_values.push(formValue);
        }
      }

      for (var k = 58; k < 69; k++) {
        if (data[i][k] !== "") {
          out.sessions.push(JSON.parse(data[i][k]));
        }
      }

      break;
    }
  }

  return JSON.stringify(out);
}