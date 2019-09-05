// These refer to sign-in sheet creation variables
var headerImgId = props.header_img_id;
var signInSheetFont = 'Calibri';
var signInSheetFontSize = 18;
var signInSheetPgHeight = 595.276;
var signInSheetPgWidth = 841.89;
var qRshort = "https://chart.googleapis.com/chart?chs=150x150&cht=qr&chl=";

function createAttendanceList(regList, regLink ,instance, date) {
  Logger.log("creating the attendance list");
  if (instance==="Queens South PL System Beta") {
    var prefix = "qs";
  } else {
    var prefix = boMap[instance].prefix;
  }
  Logger.log(regList);
  var date = new Date();
  var newDoc = DocumentApp.create("registration list created for "+regList.participants[0].eventName.replace(/&amp;/g,"&")+" on "+date.toString().slice(0,15));
  DriveApp.getFileById(newDoc.getId()).setSharing(DriveApp.Access.DOMAIN_WITH_LINK,DriveApp.Permission.EDIT);
  var body = newDoc.getBody();
  body.setPageHeight(signInSheetPgHeight);
  body.setPageWidth(signInSheetPgWidth);
  body.setMarginLeft(30);
  body.setMarginRight(30);
  body.setMarginTop(0);
  body.setMarginBottom(30);
  var header = newDoc.addHeader();
  var headerImg = DriveApp.getFileById(props[prefix+"_header_img_id"]).getAs('image/png');
  var imageParagraph = header.appendParagraph("").setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  imageParagraph.appendInlineImage(headerImg).setHeight(120).setWidth(850);
  /*imageParagraph.appendInlineImage(getQR(regLink)).setHeight(150).setWidth(150);*/
  var style = {};
  style[DocumentApp.Attribute.FONT_FAMILY] = signInSheetFont;
  style[DocumentApp.Attribute.FONT_SIZE] = 10;
  style[DocumentApp.Attribute.BOLD] = true;
  body.appendParagraph("Date: ").setAlignment(DocumentApp.HorizontalAlignment.CENTER).setAttributes(style)
  //body.appendParagraph(regList.fullDate).setAlignment(DocumentApp.HorizontalAlignment.CENTER).setAttributes(style);
  var table = [["Name","E-mail", "DBN", "Role","Time In", "Time Out", "Signature"]];
  regList.participants.forEach(function(participant) {
    table.push([participant.lName+", "+participant.fName, participant.email, participant.dbn, participant.role, "", "", ""]);
  });
  var title = body.appendParagraph(regList.participants[0].eventName.replace(/&amp;/g,"&")).setHeading(DocumentApp.ParagraphHeading.NORMAL).setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  body.appendTable(table).setColumnWidth(2, 100);
  for (var i=0; i<table[0].length; i++) {
    body.getTables()[0].getCell(0, i).setAttributes(style);
  }
  return newDoc.getUrl();
}