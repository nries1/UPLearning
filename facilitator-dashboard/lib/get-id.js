function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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
    if (idData[x][1] == division) {
      count = idData[x][0].toString().slice(idData[x][0].toString().length - 3, idData[x][0].toString().length);
      idSheet.getRange(Number(x) + 1, 1).setValue(idData[x][0] + 1);
      break;
    }
  }

  var boroCode;
  Object.keys(fscCodes).forEach(function (key) {
    Logger.log("key = " + key);

    if (props[prefix + "_borough_office"].toLowerCase().indexOf(key.toLowerCase()) !== -1) {
      boroCode = fscCodes[key];
    }
  });
  newId = count + divMap[division] + boroCode + syCode;
  return newId;
}

function copyArray(arr, newarr) {
  if (!newarr) {
    newarr = [];
  }

  if (!arr[0]) {
    return newarr;
  }

  if (Array.isArray(arr[0])) {
    newarr.push(copyArray(arr[0], []));
  } else if (_typeof(arr[0]) === "object") {
    newarr.push(copyObject(arr[0], Object.keys(arr[0]), {}));
  } else {
    newarr.push(arr[0]);
  }

  return copyArray(arr.slice(1, arr.length), newarr);
}

function copyObject(obj, keys, newobj) {
  if (!keys) {
    keys = Object.keys(obj);
  }

  if (keys.length === 0) {
    return newobj;
  }

  if (Array.isArray(obj[keys[0]])) {
    newobj[keys[0]] = copyArray(obj[keys[0]], []);
  } else if (_typeof(obj[keys[0]]) === "object") {
    newobj[keys[0]] = copyObject(obj[keys[0]], Object.keys(obj[keys[0]]), newobj);
  } else {
    newobj[keys[0]] = obj[keys[0]];
  }

  return copyObject(obj, keys.slice(1, keys.length), newobj);
}

function testCopy() {
  var array = [[1, "a", "b"], {
    "foo": "bar",
    "zoo": "tar"
  }, {
    "array1": ["big", "bad", "bear"],
    "obj2": {
      "greet": "hello"
    }
  }];
  var array2 = copyArray(array);
  var array3 = array[0];
  Logger.log("before");
  Logger.log("array 1: ");
  Logger.log(array);
  Logger.log("array 2: ");
  Logger.log(array2);
  array2[1].foo = "not bar";
  Logger.log("after");
  Logger.log("array 1: ");
  Logger.log(array);
  Logger.log("array 2: ");
  Logger.log(array2);
}