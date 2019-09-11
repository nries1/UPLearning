function getId(division, idSheet, instance) {
  var prefix = boMap[instance].prefix;
  var today = new Date();
  var newId = "";
  var count = "";
  var divCode = "";
  var syCode = today.getFullYear().toString().slice(2, 4);

  if (new Date().getMonth() > 8) {
    syCode++;
  }

  var idData = idSheet.getDataRange().getValues();

  for (var x = 0; x < idData.length; x++) {
    if (idData[x][1] === division) {
      count = idData[x][0].toString().slice(idData[x][0].toString().length - 3, idData[x][0].toString().length);
      idSheet.getRange(Number(x) + 1, 1).setValue(idData[x][0] + 1);
      break;
    }
  }

  var boroCode;
  Object.keys(fscCodes).forEach(function (key) {
    Logger.log("key = " + key);

    if (instance.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
      boroCode = fscCodes[key];
    }
  });
  newId = count + divMap[division] + boroCode + syCode;
  return newId;
}