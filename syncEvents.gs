function sync(startDate, endDate, debug) {
  
  var result =" "
  
  Logger.log("start date: "+startDate);
  Logger.log("end date: "+endDate);
  Logger.log("debug: "+debug);
  
  Logger.log("===START===");
  startDate =  stringToDate(startDate);
  //day correction to include last day specified in endDate
  Logger.log("===END===");
  endDate = stringToDate(endDate);
  endDate.setUTCDate(endDate.getUTCDate()+1);
  
 
  var calendars = CalendarApp.getAllCalendars();
  var calendar;
  var numberOfCalendars = calendars.length;
  var calId;
  var calName;
  var calColor;
  
  var events;
  var event;
  var numberOfEvents;
  var eventTitle;
  var eventStart;
  var eventEnd;
  var eventId;

  var i1;
  var i2;
  var i3;
  
  var numberOfRows;
  
  var sheet = SpreadsheetApp.getActiveSheet();
  var data = sheet.getDataRange().getValues();
  var sheetName = sheet.getName();
  var eventExists;
  var range;
  
  if(sheetName == "event list") {
  
    //going through all calendars
    for(i1=0;i1<numberOfCalendars;i1++) {
      calendar = calendars[i1];
      calId = calendar.getId();
      calName = calendar.getName();
      calColor = calendar.getColor();
      
      Logger.log("cal name: "+calName);
      Logger.log("cal color: "+calendar.getColor());
      Logger.log("cal Id: "+calId);
      
      //filter out external calendars
      if(calId.search("stepvda.net")>=0) {
        
        //for current calendar retrieve all events
        events = calendar.getEvents(startDate, endDate);
        numberOfEvents = events.length;
        
        //for each event retrieved from current calendar
        for(i2=0;i2<numberOfEvents;i2++) {
          event = events[i2];
          eventTitle = event.getTitle();
          eventStart =  event.getStartTime();
          eventEnd = event.getEndTime();
          eventId = event.getId();
          
          Logger.log("event title: "+eventTitle);
          Logger.log("event start: "+eventStart);
          Logger.log("event end: "+eventEnd);
          
          eventExists = false;
          //check if event already exists in sheet by searching for the current eventId in sheet
          for(i3=0;i3 < data.length ; i3++) {
            if(eventId == data[i3][11]) {
              eventExists = true;
            }
          }
          
          
          //if event does not exist in sheet add it
          if(eventExists == true) {
            Logger.log("event exists already in sheet");
          }
          else {
            Logger.log("event does not exist yet in sheet");
            
            sheet.appendRow([eventStart.getUTCFullYear(),"1","2","3","4",eventTitle,"6","7","8","9",calId,eventId,eventStart,eventEnd,eventStart.getTime(),calColor,"16"]);
            
            
            //set the background color of the row matching the calendar color
            numberOfRows = sheet.getLastRow();
            Logger.log("number of rows: "+numberOfRows);
            range =  sheet.getRange(numberOfRows,1,1,17);
            range.setBackground(calColor);
          }  
          
          
          
          
          
          
          //if calendar already exists in sheet check if system fields are different
          
          //if event fields (title, start, end, description) are different update event in sheet
          
          //if event fields are not different skip this event and move on to next one
          }
          
        }
        
      }
      //sort sheet by eventStart
      sheet.sort(14);
      
      
      
      
  }

  else {
    result=result+"ERROR: Wrong sheet. Please select the event list sheet before running.";
  }
  
  result=result+"<br>Done.";
 
  return result;
}


function stringToDate(date) {
  Logger.log("date type: "+ typeof date);
  Logger.log("date: " + date);
  
  if(typeof date == "string") {
    var dateDay = new Number(date.substr(0,2));
    var dateMonth = new Number(date.substr(3,2));
    var dateYear = new Number(date.substr(6,4));
  
    Logger.log(dateDay);
    Logger.log(dateMonth);
    Logger.log(dateYear);
    
    
    date = new Date(dateYear,dateMonth-1,dateDay);
   /* date = new Date()
    date.setUTCFullYear(dateYear);
    date.setUTCMonth(dateMonth-1); //bizar
    date.setUTCDate(dateDay);
    date.setUTCSeconds(1);
    date.setHours(0);
    date.setUTCMinutes(0);
 */
  }
  Logger.log("date type: "+ typeof date);
  Logger.log("date: " + date);
  
  return date;
}



