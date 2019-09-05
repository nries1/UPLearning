function getEventData(id,instance) {
  var prefix = boMap[instance].prefix;
    var database = SpreadsheetApp.openById(props[prefix+"_database_id"]);
    var regSheet = database.getSheetByName("form registrations");
    var regData = regSheet.getRange(2,19,regSheet.getLastRow(),1).getValues();
    var data = database.getSheetByName("event creation form responses").getDataRange().getValues();
  var eventObj = {};
  var found=false;
  for (var i=0; i<data.length; i++) {
    if (data[i][idIndex]===id) {
      found=true;
      var currentRegs = data[i][85];
      eventObj["title"] = data[i][titleIndex];
      eventObj["division"]=data[i][divisionIndex];
      eventObj["regs"] = currentRegs+" / "+data[i][maxRegistrantsIndex];
      eventObj["max_regs"]=data[i][maxRegistrantsIndex];
      data[i][waitlistIndex]==="Yes" ? eventObj["waitlist"]=true : eventObj["waitlist"]=false;
      eventObj["waitlist_size"]=data[i][wlSizeIndex];
      eventObj["reg_status"]="Register Now";
      if (currentRegs>=data[i][maxRegistrantsIndex]) {
        if (data[i][waitlistIndex]!=="Yes" || (currentRegs >= (data[i][wlSizeIndex]+data[i][maxRegistrantsIndex]))) {
          eventObj["reg_status"]="Registraton Closed";
        } else if (currentRegs < (data[i][wlSizeIndex]+data[i][maxRegistrantsIndex])) {
          eventObj["reg_status"]="Join Waitlist";
        }
      }
      eventObj["reg_link"]=data[i][regFormIndex];
      eventObj["ctle"]=data[i][ctleIndex];
      eventObj["audience"]=data[i][audienceIndex];
      data[i][districtsIndex].toString().indexOf("[")===0 ? eventObj["districts"]="Districts: "+JSON.parse(data[i][districtsIndex]).join(", ") : eventObj["districts"]="Districts: "+data[i][districtsIndex];
      eventObj["display_audience"]=data[i][36];
      eventObj["facilitators"]=data[i][facsIndex];
      eventObj["fac1"]=data[i][fac1Index];
      eventObj["fac1email"]=data[i][fac1EmailIndex];
      eventObj["display-times"] = data[i][timesIndex];
      eventObj["display-description"]=encodeURIComponent(data[i][descriptionIndex]).replace(/%23/g,"#").replace(/%20/g," ").replace(/%0A/g,"<br>").replace(/%22/g,'""').replace(/%2F/g,"/").replace(/%2C/g,",").replace(/%E2%80%99/g,"'").replace(/%3A/g,":").replace(/%3Cbr%3E/g,"<br>").replace(/%09/g," ")
      .replace(/%3B/g,";").replace(/%E2%80%A2/g," - ").replace(/%E2%80%9C/g,'"').replace(/%E2%80%9D/g,'"').replace(/%EF%82%A0/g, " - ").replace(/%25/g,"%").replace(/%3F/g,"?").replace(/%40/g,"@");  
      if (data[i][otherInfoIndex]!=="") {
        eventObj["display-description"]+="<br><br><strong>Additional Info:</strong><br>"+encodeURIComponent(data[i][otherInfoIndex]).replace(/%23/g,"#").replace(/%20/g," ").replace(/%0A/g,"<br>").replace(/%22/g,'""').replace(/%2F/g,"/").replace(/%2C/g,",").replace(/%E2%80%99/g,"'").replace(/%3A/g,":").replace(/%3Cbr%3E/g,"<br>").replace(/%09/g," ")
        .replace(/%3B/g,";").replace(/%E2%80%A2/g," - ").replace(/%E2%80%9C/g,'"').replace(/%E2%80%9D/g,'"').replace(/%EF%82%A0/g, " - ").replace(/%25/g,"%").replace(/%3F/g,"?").replace(/%40/g,"@");
      }
      eventObj["id"]=id;
      eventObj["display-location"]=data[i][locationIndex];
      eventObj["num_sessions"]=data[i][84];
      eventObj["reg_flyer"]=data[i][75];
      eventObj["all_sessions"]=[];
      for (var j=58;j<69;j++) {
        Logger.log(data[i][j])
        if (data[i][j]!=="") {
          var sesh=JSON.parse(data[i][j]);
          sesh.date=Utilities.formatDate(new Date(sesh.date), "GMT+4:00", "MM/dd/yyyy");
          eventObj.all_sessions.push(sesh)
        }
      }
      Logger.log(eventObj);
      return found ? eventObj : false;
    }
  }
}