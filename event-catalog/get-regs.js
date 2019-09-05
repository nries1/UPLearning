function getRegs(eventId,rd) {
  var numRegs = 0;
  for (var i=0; i<rd.length;i++) {
    if (rd[i][0] == eventId) {
      numRegs++;
    }
  }
  return numRegs;
}