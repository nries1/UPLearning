function doGet(e) {
  return HtmlService.createTemplateFromFile('index')
      .evaluate().setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL).setFaviconUrl("https://drive.google.com/drive/folders/1v_BkSbezgaMCRDtBDMQgS4zW9mFLtdR8/image.png");
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}

function getUser() {
  Logger.log("getting user");
  var boMap = JSON.parse(PropertiesService.getScriptProperties().getProperty("boMap"));
  Logger.log(boMap);
  Logger.log(boMap["bksouthpd@strongschools.nyc"]);
  //var boMap = JSON.parse(PropertiesService.getScriptProperties().getProperty("boMap"))
  return boMap[Session.getActiveUser().getEmail()];
}