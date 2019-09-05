function edit(formData,dbnList,instance) {
  return editRow(formData,dbnList,instance) ? {"message": "Your registration has been edited successfully.", "success": true} : {"message": "Oops. Something went wrong.", "success": false}
}
