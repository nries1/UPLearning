function saveNewUser(form) {
  var boMap = JSON.parse(PropertiesService.getScriptProperties().getProperty("boMap"));
  boMap[Session.getActiveUser().getEmail()] = new Instance(form);
  PropertiesService.getScriptProperties().setProperty("boMap", JSON.stringify(boMap));
  return true;
}

function Instance(data) {
 this.system=data.system;
 this.dm=data.dm
}