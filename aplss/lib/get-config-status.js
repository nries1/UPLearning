function getConfigStatus() {
  var props = PropertiesService.getScriptProperties().getProperties();
  var boMap = JSON.parse(props.boMap);
  var out = {"success": true, "message": ""};
  Logger.log("system is ");
  Logger.log(boMap[Session.getActiveUser().getEmail()].system);
  if (DriveApp.getFoldersByName(boMap[Session.getActiveUser().getEmail()].system).hasNext()) {
    var instance = DriveApp.getFoldersByName(boMap[Session.getActiveUser().getEmail()].system).next();
    out.success=false;
    out.msg = "Oops. There is already an existing instance called: "+instance.getName()+" located \
<a href='"+instance.getUrl()+"' target=_blank >here</a>. If you would like to start a new instance, \
first rename or delete your current instance. Once, you've done that, come back here and refresh the page.";
  }
  return out;
}