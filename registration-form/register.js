function register(data,dbnList,instance) {
  Logger.log(instance);
  Logger.log(data);
  var prefix = boMap[instance].prefix;
  if (data.edit) {return edit(data,dbnList,instance)}
  var regMsg;
  data.waitlist ? regMsg = "You have been added to the waitlist" : regMsg = "You have been registered successfully"
  var emailSendStatus = emailConfirmation(data,instance);
  //Try to append this registrant's data to the database
  if (appendRegistrant(data,dbnList,instance,emailSendStatus)) {
   //if the data is appended successfully, compose a calllback msg
     return {"message": regMsg+". Your confirmation code is <strong>"+data.id+"</strong>. "+emailSendStatus.msg, "success": true, "error": ""}
   } else {
   //if a registrant's data could not be appended, return an error to the client regardless of email status 
    return {"message": "Oops. Something went wrong. Please contact "+props[prefix+"_dm_email"]+" for assistance.", "success": false,}
  }
}

function wdfsdfa() {
  Logger.log(PropertiesService.getScriptProperties().getProperty("bks_dm_email"))
}