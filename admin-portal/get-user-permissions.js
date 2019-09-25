const getUserPermissions = () => SpreadSheetApp
                                                .openById('1gnL2-wUXBJuGdh8wv1QhQyKsU8Jit4cO7_4m-FYlFDo')
                                                .getSheetByName('admin_portal')
                                                .getDataRange()
                                                .getValues();
