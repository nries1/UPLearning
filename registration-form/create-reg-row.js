function createRow(data,dbnList,instance,emailStatus,oldData) {
  var dist = data.dbn.slice(0,2);
  // the dbn ss contains sheets for each district and pl system. we only want the hs dristricts
  var hsSups = Object.keys(dbnList).filter(function(sup) {return sup !== 'all' && sup.indexOf('PL') === -1});
  hsSups.forEach(function(sup) {
    if (dbnList[sup].indexOf(data.dbn) !== -1) dist = sup;
  });
  var arr = [new Date(),
             data.eventName,
             data.fName,
             data.lName,
             data.email,
             data.dbn,"",
             data.role,
             data.experience,
             data.subject.join(","),
             data.goals,
             data.comfort,
             "",
             ctleMap[data.ctle],
             data.ssNum,
             data.month,
             data.day,
             data.year,
             data.eventId,
             data.eventName];
  for (var i=0;i<22;i++) {arr.push("")}
  arr.push(data.id,data.edit_link);
  if (!data.edit) {
    for (var i=0;i<data.completed_sessions;i++) {arr.push(0)}
    for (var i=0;i<11-data.completed_sessions;i++) {arr.push("")}
  } else {
    oldData.slice(44,55).forEach(function(el) {arr.push(el)})
  }
  arr.push('=countif(INDIRECT("R[0]C[-11]",FALSE):INDIRECT("R[0]C[-1]",FALSE),">0")',"","",dist,'=count(INDIRECT("R[0]C[-15]",FALSE):INDIRECT("R[0]C[-5]",FALSE))',"",'=sum(INDIRECT("R[0]C[-17]",FALSE):INDIRECT("R[0]C[-7]",FALSE))');
  if (data.edit) {arr.push(emailStatus)} else { arr.push(emailStatus.status)}
  !data.waitlist ? arr.push("standard") : arr.push("Waitlist");
  return arr;  
}