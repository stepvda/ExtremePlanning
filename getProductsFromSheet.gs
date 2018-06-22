////SAMPLE CODE////

function logProductInfo() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var data = sheet.getDataRange().getValues();
  for (var i = 0; i < data.length; i++) {
    Logger.log('Product name: ' + data[i][0]);
    Logger.log('Product number: ' + data[i][1]);
    //data[i][2] = data[i][1] * 2; 
    sheet.getRange(i+1,3).setValue(data[i][1] * 2); //Werkt!!!
   
  }
}
