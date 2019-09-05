function getEventData(id,instance) {
  var prefix = boMap[instance].prefix;
  var ess = SpreadsheetApp.openById(props[prefix+"_database_id"]);
  var es = ess.getSheetByName("event creation form responses");
  var ed = es.getDataRange().getValues();
  var out = {};
  var today = new Date().getTime()
  var found = false;
  for (var i=0; i<ed.length; i++) {
    if (id===ed[i][50]) {
      if (ed[i][e_datesIndex].toString().indexOf(",")===-1) {
        out["dates"] = new Date(ed[i][e_datesIndex]).toString().slice(0,15);
      } else {
        out["dates"] = ed[i][e_datesIndex];
      }
      out["event_creator"] = ed[i][1];
      out["title"] = ed[i][e_titleIndex];
      out["ec"] = ed[i][e_ecIndx];
      out["facs"] = ed[i][e_facsIndx];
      out["id"] = ed[i][e_idIndex];
      out["info"] = ed[i][e_infoIndex];
      out["loc"] = ed[i][e_locIndex];
      out["max"] = ed[i][e_maxIndex];
      out["times"] = ed[i][e_timesIndex];
      out["wl"] = ed[i][e_wlIndex];
      out["wl_size"] = ed[i][e_wlSizeIndex ];
      out["regs"] = ed[i][85];
      out["waitlist"] = ed[i][83];
      out["event_page"]=ed[i][55];
      ed[i][34] === "" ? out["resource_folder"] = "N/A" : out["resource_folder"] = ed[i][34];
      ed[i][20] === "yes" ? out["allow_non_doe"] = true : out["allow_non_doe"] = false;
      out["completed_sessions"]=ed[i].slice(21,32).reduce(function(completed,date) {
        if (date != "") {if ((today - date.getTime())>(24*60*60*1000)) {completed++}}
          return completed;
        },0);
      if (ed[i][32] === "This offering is NOT CTLE eligible" || ed[i][32]==="CTLE eligible, but certificate issued by NON-FSC office" || ed[i][32]==="CTLE eligible, but certificate NOT issued by borough office") {
        out["ctle"]=false;
      } else {out["ctle"]=true;}
      found = true;
      break;
    }
  }
  return found ? out : false;
}