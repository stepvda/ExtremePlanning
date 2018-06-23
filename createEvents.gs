function createEventsFromList() {
  var sheet = SpreadsheetApp.getActiveSheet(); //config sheets must be active
  var data = sheet.getDataRange().getValues();
  var affectedDate = new Date(data[0][5]); //retrieve calenderId from sheet 
  
  //Logger.log("date: "+affectedDate);
  
  createEventsFromListForDate(affectedDate, false);
  
  
}


function createEventsFromListForDate(affectedDate, debug) {
  
  Logger.log("starting function...");
  Logger.log("affected date: " + affectedDate);
  Logger.log("affected date type: "+ typeof affectedDate);
  Logger.log("debug: "+debug);
  
  var affectedStart;
  var affectedEnd;

  if(typeof affectedDate == "string") {
    var dateDay = new Number(affectedDate.substr(0,2));
    var dateMonth = new Number(affectedDate.substr(3,2));
    var dateYear = new Number(affectedDate.substr(6,4));
    Logger.log(dateDay);
    Logger.log(dateMonth);
    Logger.log(dateYear);
    
//    affectedDate = new Date()
    affectedDate = new Date(dateYear,dateMonth-1,dateDay);
/*    affectedDate.setUTCFullYear(dateYear);
    affectedDate.setUTCMonth(dateMonth-1); //bizar
    affectedDate.setUTCDate(dateDay);
    affectedDate.setUTCSeconds(1);
    affectedDate.setHours(0);
    affectedDate.setUTCMinutes(0);
*/  }
  Logger.log("affected date type: "+ typeof affectedDate);
  Logger.log("affected date: " + affectedDate);
  
  
  var calendar
  var result = "<br>output on: <br>"+new Date()+" : "
  
  var sheet = SpreadsheetApp.getActiveSheet();
  var data = sheet.getDataRange().getValues();
  var sheetName = "none";
  sheetName = sheet.getName();
  
  Logger.log("sheet name: "+sheetName);
  Logger.log("is template: "+sheetName.indexOf("template"));
  
  if(sheetName.indexOf("template") >= 0) {

  var title
  var start
  var end
  var event
  
  var i;
  var i2;
  var eventExists;
  
  
  //declare variables for information retrieved from calendar
  var calLength;
  var calEvents;
  var calTitle;
  
  
  for (i = 0; i < data.length; i++) {
   
    calendar = CalendarApp.getCalendarById(data[i][3]); //load calendar into var for affectedDate
    title = data[i][0];
    
    //***
    start = data[i][1];   
    affectedStart = new Date(affectedDate);
    affectedStart.setHours(data[i][1].getHours());
    affectedStart.setMinutes(data[i][1].getMinutes());
    
    //***
    end = data[i][2];
    affectedEnd = new Date(affectedDate);
    affectedEnd.setHours(data[i][2].getHours());
    affectedEnd.setMinutes(data[i][2].getMinutes());
    
    
    result=result+"<br>event: "+title
    
    //next funtion will fail if affectedDate is not Date() type
    calEvents = calendar.getEventsForDay(affectedDate); //retrieve date from sheet for which to create events stored in cell F5
   
    
    calLength = calEvents.length;
    
    //check if event title exists in calendar
    eventExists = false;
    for (i2=0; i2 < calLength; i2++) {
      
      calTitle = calEvents[i2].getTitle();
        
      if(calTitle == title) {
        eventExists = true;
      }
    }
    
    
    Logger.log(title + " exists: "+ eventExists);
    
    
     
    // create new event
    if(!eventExists) {
      if(!debug) {
        event = calendar.createEvent(title,new Date(affectedStart),new Date(affectedEnd));
      }
      else {
        result=result+" - debug - creation skipped";
      }
      
      if(typeof event == "object") {
        Logger.log('Event created with ID: ' + event.getId());
        result=result+" - event added."
      }
      
    }
    else  {
      result=result+" - event already exists."
    }
  }
  
  }
  else {
    result=result+"ERROR: Wrong sheet. Please select the event template sheet before running."
  }
    
  result=result+"<br>Done.";  

  return result;
  
}


function createEventsFromListForDate2(affectedDate) {
  
  return affectedDate

}


function createEventsFromListWithoutCheckExists() {
  
  var calendar
  
  var sheet = SpreadsheetApp.getActiveSheet();
  var data = sheet.getDataRange().getValues();

  var title
  var start
  var end
  var event
  
  
  var i;
  var eventExists 
  var calLength;
  var calEvents;
  
  
  for (i = 0; i < data.length; i++) {
   
    calendar = CalendarApp.getCalendarById(data[i][3]); //retrieve calenderId from sheet and load calendar into var
    title = data[i][0];
    start = data[i][1];   
    end = data[i][2];
    
    
    calEvents = calendar.getEventsForDay(new Date(data[0][5])); //retrieve date from sheet for which to create events
    calLength = calEvents.length;
    
  
     // create new event
     event = calendar.createEvent(title,new Date(start),new Date(end));
    
     Logger.log('Event ID: ' + event.getId());    
     
  }
  
}


