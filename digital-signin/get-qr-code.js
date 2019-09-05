function getQR(url) {
  // Retrieve an image from the web.
  Logger.log("getting QR Code");
  Logger.log(url);
  //var resp = UrlFetchApp.fetch(qRshort+url);
  Logger.log(qRshort+url);
  return qRshort+url;
  //return resp.getBlob();
}