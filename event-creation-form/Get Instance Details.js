function getInstanceDetails(instance) {
  var prefix = boMap[instance].prefix;
  var locSheet = SpreadsheetApp.openById("1QupCcz_N4jprUSHFHDE54yKyD0I5ZbyA_VbK9F8nN8g").getSheetByName(instance).getDataRange().getValues();
  var locations =
  locSheet.reduce(function(arr,loc){
    arr.push(loc[0]);
    return arr;
  },[]);
  return JSON.stringify({"locations": locations, "districts": props[prefix+"_all_districts"].split(",")});
}