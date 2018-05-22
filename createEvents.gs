function createEventsFromList() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var data = sheet.getDataRange().getValues();
  var affectedDate = new Date(data[0][5]); //retrieve calenderId from sheet
  
  //Logger.log("date: "+affectedDate);
  
  createEventsFromListForDate(affectedDate);
  
  
}


function createEventsFromListForDate(affectedDate) {
  
  var calendar
  
  var sheet = SpreadsheetApp.getActiveSheet();
  var data = sheet.getDataRange().getValues();

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
    start = data[i][1];   
    end = data[i][2];
    
    
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
       event = calendar.createEvent(title,new Date(start),new Date(end));
       Logger.log('Event created with ID: ' + event.getId());    
    }
  }
  
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
