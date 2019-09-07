function getDbns() {
  var dbnObj = {};
  var dbnSs = SpreadsheetApp.openById("1eb40-3XjECuXRJGRLLjFPdLXhLsRR8tk_heq0b25x-o").getSheets();

  for (var i = 0; i < dbnSs.length; i++) {
    dbnObj[dbnSs[i].getName()] = dbnSs[i].getDataRange().getValues()[0];
  }

  return dbnObj;
}

function askljdn() {
  var curYear = new Date().getFullYear();
  var curSy = "SY" + Number(curYear - 1).toString().slice(2, 4) + "-" + curYear.toString().slice(2, 4);
  Logger.log(curSy);
}

function workwithdates() {
  var today = new Date();
  Logger.log(today.getUTCHours());
}