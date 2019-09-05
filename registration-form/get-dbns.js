function getDbns() {
  var dbnObj = {};
  var dbnSs = SpreadsheetApp.openById("1eb40-3XjECuXRJGRLLjFPdLXhLsRR8tk_heq0b25x-o").getSheets();
  for (var i=0; i<dbnSs.length; i++) {
    dbnObj[dbnSs[i].getName()]=dbnSs[i].getDataRange().getValues()[0];
}
  return dbnObj;
}