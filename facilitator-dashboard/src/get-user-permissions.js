const getUserPermissions = () => {
    const email = Session.getActiveUser().getEmail();
    const permissionData = SpreadsheetApp
                                         .openById('1gnL2-wUXBJuGdh8wv1QhQyKsU8Jit4cO7_4m-FYlFDo')
                                         .getSheets()[0]
                                         .getDataRange()
                                         .getValues();
    for (let i = 0; i < permissionData.length; i++) {
        if (permissionData[i][0] === email) {
            return permissionData[i][1];
        }
    }
}
