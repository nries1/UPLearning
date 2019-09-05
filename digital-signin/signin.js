function signin(data,instance) {
  Logger.log(data);
  Logger.log(instance);
  var prefix = boMap[instance].prefix;
    var regss = SpreadsheetApp.openById(props[prefix+"_database_id"]);                             
    var regSheet = regss.getSheetByName("form registrations");                                 
    var regData = regSheet.getDataRange().getValues();    
  var out = {"name": data.name, "sign_out": false, "require_sign_out": false, "confirmation": data.confirmation, "completed_sign_out": false};
  var found=false;
  var dateIndex = Number(r_date1AttnIndex)+Number(data.dateIndex);
  Logger.log(dateIndex);
  for (var i=1; i<regData.length; i++) {
    if (regData[i][r_idIndex] === data.confirmation && regData[i][r_eventCodeIndex] === data.eventId) {
       found = true;
       if ((data.ctle === "true" && regData[i][r_wantsCtleIndex].indexOf("Yes")!==-1)
           || (data.funding !== "None" && data.funding!=="" && data.funding!=="undefined" && data.funding!==undefined)) {
             out.require_sign_out=true;
         if (regData[i][dateIndex] === "") {
           var now = new Date();
           if (now.getHours() < Number(data.start_hour) || (now.getHours() === Number(data.start_hour) && now.getMinutes()<Number(data.start_minute))) {
             now.setHours(Number(data.start_hour));
             now.setMinutes(Number(data.start_minute));
             regSheet.getRange(Number(i)+1,dateIndex+1).setValue(0).setNote(now.getTime());
           } else {
             regSheet.getRange(Number(i)+1,dateIndex+1).setValue(0).setNote(now.getTime());
           }
         } else {
           var range = regSheet.getRange(Number(i)+1,dateIndex+1);
           var currentAttn = Number(range.getNote());
           var calcAttn = Number(new Date().getTime() - currentAttn)/(60*60*1000);
           if (calcAttn > data.duration) {
             data.duration;
           } else {
             range.setValue(calcAttn.toFixed(1));
           }
             range.clearNote();
           out.completed_sign_out = true;
           out.sign_out = true;
         }
       } else {
         if (regSheet.getRange(Number(i)+1,dateIndex+1).getValue() === "") {
           regSheet.getRange(Number(i)+1,dateIndex+1).setValue(Number(data.duration).toFixed(1));
         }
         else {
           out.sign_out = true;
         }
       }
       break;
    }
  }
  return found ? out : false;  
}