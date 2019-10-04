var getUserPermissions = function getUserPermissions() {
  var email = Session.getActiveUser().getEmail();
  var permissionData = SpreadsheetApp.openById('1gnL2-wUXBJuGdh8wv1QhQyKsU8Jit4cO7_4m-FYlFDo').getSheets()[0].getDataRange().getValues();

  for (var i = 0; i < permissionData.length; i++) {
    if (permissionData[i][0].toLowerCase() === email.toLowerCase()) {
      return permissionData[i][1];
    }
  }
};