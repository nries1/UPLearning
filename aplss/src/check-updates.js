function getUsers() {
  return SpreadsheetApp
                      .openById("1gnL2-wUXBJuGdh8wv1QhQyKsU8Jit4cO7_4m-FYlFDo")
                      .getSheetByName("Sheet1")
                      .getDataRange()
                      .getValues()
}