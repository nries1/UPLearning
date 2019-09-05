function getFilters(instance) {
  Logger.log(instance);
  Logger.log("HELLO");
  var prefix = boMap[instance].prefix;
  Logger.log(props[prefix+"_all_districts"].split(","));
  if (instance==="Queens South PL System Beta") {
    Logger.log("prop"+props["qs_all_districts"]);
    return props["qs_all_districts"].split(",").map(function(d) {return d.toString()}); //? props[prefix+"_all_districts"].toString().slice(0,2) : props[prefix+"_all_districts"].split(",");
  } else {
    return props[prefix+"_all_districts"].split(",").map(function(d) {return d.toString()}); //? props[prefix+"_all_districts"].toString().slice(0,2) : props[prefix+"_all_districts"].split(",");
  }
}