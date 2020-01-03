function createDocMap(docStructure) {
  return docStructure.replace("}","").replace("{","").split(",").reduce(function(obj,el) {
    el=el.split("=");
    obj[el[0].trim()]=el[1];
    return obj;
  },{});
}

function ajfhdbsdfikjhbsadikfc() {
  Logger.log(DriveApp.getFileById("1vJn1G18qsaXqsYx0atHT80e7UG1q6i9Oun6ftcHSyr4").getUrl());
  Logger.log(DriveApp.getFolderById("1WFPyMLxqjdFUKvbZ5LabDVoes8SyndVb").getAccess("affinityfsc@strongschools.nyc"));
}

/*
Flyer Builder Function
*/
function createCustomRegFlyer(flyerObj,docId, instance) {
  Logger.log(flyerObj);
  var prefix = boMap[instance].prefix;
  var style = {}
  style[DocumentApp.Attribute.BOLD] = false;
  //if the doc is being edited. Delete the old doc before creating a new flyer
  if (docId) {
    //DriveApp.getFileById(docId).setTrashed(true);
    var newDoc = DocumentApp.openById(docId);
    var body = newDoc.getBody().getParagraphs();
    var doc_structure = createDocMap(flyerObj.doc_structure);
    var docTags = Object.keys(doc_structure);
    var tags = Object.keys(flyerObj);
    docTags.forEach(function(tag) {
      if (flyerObj[tag]) {
        body[Number(doc_structure[tag])].setText(flyerObj[tag]);
        body[Number(doc_structure[tag])].setAttributes(style);
      }
    });
  } else {
  var doc_structure = {};
  var newDoc = DocumentApp.openById(DriveApp.getFileById(props[prefix+"_reg_flyer_template_id"]).makeCopy("Registration Flyer - "+flyerObj.title,DriveApp.getFolderById(props[prefix+"_reg_flyer_folder_id"])).getId());
  var body = newDoc.getBody().getParagraphs();
  var tags = Object.keys(flyerObj);
  var regLinkStyle = {};
  regLinkStyle[DocumentApp.Attribute.BACKGROUND_COLOR] = "#0000ff";
  regLinkStyle[DocumentApp.Attribute.FOREGROUND_COLOR] = '#ffffff';
  regLinkStyle[DocumentApp.Attribute.FONT_SIZE] = 14;
  for (var i=0; i<body.length; i++) {
    for (var j in tags) {
      if (body[i].getText()==="<<"+tags[j]+">>") {
        doc_structure[tags[j]] = i;
        if (tags[j]==="dates" && flyerObj[tags[j]].indexOf(",") === -1) {
          body[i].setText(flyerObj[tags[j]].toString().slice(0,15));
          body[i].setAttributes(style);
        } else {
          if (flyerObj[tags[j]]==="" || !flyerObj[tags[j]] || flyerObj[tags[j]]=="undefined") {
           body[i].setText("N/A");
          } else {
            body[i].setText(flyerObj[tags[j]]);
          }
            body[i].setAttributes(style);
        }
      }
      if (body[i].getText().indexOf(flyerObj.reg_text) !== -1) {
        body[i].setLinkUrl(flyerObj.regUrl).setAttributes(regLinkStyle)
      }
    }
  }
  var newFile = DriveApp.getFileById(newDoc.getId());
  newFile.setSharing(DriveApp.Access.ANYONE, DriveApp.Permission.VIEW);
    flyerObj.facEmails.forEach(function(e) {Logger.log(e); newFile.addEditor(e)});
  }
  var docId = newDoc.getId();
  var url = "https://docs.google.com/document/d/"+docId+"/edit?usp=sharing";
  return {"url": url, "id": docId, "doc_structure": doc_structure}
}