function exportRegData(regList,instance) {
  Logger.log(instance);
  var prefix = boMap[instance].prefix;
  Logger.log(regList);
  var newSs = SpreadsheetApp.openById(DriveApp.getFileById(props[prefix+"_reg_template_id"]).makeCopy(regList.participants[0].eventName+" Registrant info Report on "+new Date(),DriveApp.getFolderById("1_uTklyEzbYPng9iKu4310i6DSy7j8FUr")).getId());
  var data = [["first name", "last name", "email", "dbn", "role", "years in role", "learning goals", "comfort level with the material", "hours attended", "wants ctle?","ctle sent?","waitlist?"]];
  var regRow;
  regList.participants.forEach(function(registrant,index) {
    regRow = [];
    regRow.push(registrant.fName);
    regRow.push(registrant.lName);
    regRow.push(registrant.email);
    regRow.push(registrant.dbn);
    regRow.push(registrant.role);
    regRow.push(registrant.experience);
    regRow.push(registrant.goals);
    regRow.push(registrant.comfortLevel);
    regRow.push(registrant.attendance);
    regRow.push(registrant.ctle);
    var ctleEligible = registrant.more_info.filter(function(info) {return info.label==="Received CTLE"})[0]
    if (ctleEligible) {
      regRow.push(ctleEligible.value);
    } else {
      regRow.push("N/A")
    }
    regRow.push(registrant.waitlist);
    data.push(regRow);
  });
  newSs.getSheets()[0].getRange(1,1,data.length,data[0].length).setValues(data);
  DriveApp.getFileById(newSs.getId()).setSharing(DriveApp.Access.DOMAIN_WITH_LINK, DriveApp.Permission.EDIT);
  return newSs.getUrl();
}

function testpers() {
  var orig = DriveApp.getFileById(props["c_reg_template_id"])
  Logger.log(orig.getAccess("bksouthpd@strongschools.nyc"));
  var copy = orig.makeCopy(DriveApp.getFolderById("1rIEdQ5ZsDsux3fiACQcX6dEuzH8uVht0"));
  Logger.log(copy.getAccess("bksouthpd@strongschools.nyc"))
}