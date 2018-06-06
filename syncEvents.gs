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
  var eventLastUpdated;
  var numberOfEventsUpdated = 0;
  var numberOfNewEvents = 0;
  var numberOfDeletedEvents = 0;
  var rowToUpdate;

  var i1;
  var i2;
  var i3;
  var i4;
  
  var numberOfRows = 0;
  
  var sheet = SpreadsheetApp.getActiveSheet();
  var data = sheet.getDataRange().getValues();
  var sheetName = sheet.getName();
  var eventExists;
  var range;
  var formattingRange;
  
  var calendarFilter = "stepvda.net";
  
  if(sheetName == "event list") {
  
    //remove title row
    sheet.deleteRow(1);
    
    
    //going through all calendars
    for(i1=0;i1<numberOfCalendars;i1++) {
      calendar = calendars[i1];
      calId = calendar.getId();
      calName = calendar.getName();
      calColor = calendar.getColor();
      
      Logger.log("cal name: "+calName);
      Logger.log("cal color: "+calendar.getColor());
      Logger.log("cal Id: "+calId);
      
      //filter out external calendars based on calendarFilter variable
      if(calId.search(calendarFilter)>=0) {
        
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
          eventLastUpdated = event.getLastUpdated();
          
          Logger.log("event title: "+eventTitle);
          //Logger.log("event start: "+eventStart);
          //Logger.log("event end: "+eventEnd);
          
          eventExists = false;
          //check if event already exists in sheet by searching for the current eventId in sheet
          for(i3=0;i3 < data.length ; i3++) {
            if(eventId == data[i3][12]) {
              eventExists = true;
              rowToUpdate = i3;
            }
          }
          
          
          //if event does not exist in sheet add it
          if(eventExists == true) {
            Logger.log("event exists already in sheet");
            
            //check if event needs to be updated
            if(eventLastUpdated.toString() != data[rowToUpdate][17].toString()) {
              //event needs to be updated as the modified date has changed
              Logger.log("event needs to be updated");
              numberOfEventsUpdated++;
              
              //update values
              sheet.getRange(rowToUpdate,1).setValue(eventStart.getUTCFullYear()); //Year
              sheet.getRange(rowToUpdate,2).setValue(eventStart.getWeek()); //Week
              sheet.getRange(rowToUpdate,3).setValue(dateToString(eventStart)); //Date
              sheet.getRange(rowToUpdate,4).setValue(getTimeFromDate(eventStart)); //Start
              sheet.getRange(rowToUpdate,5).setValue(getTimeFromDate(eventEnd)); //End
              sheet.getRange(rowToUpdate,6).setValue(eventTitle); //Title
              sheet.getRange(rowToUpdate,7).setValue(getDuration(eventStart,eventEnd)); //Duration
              sheet.getRange(rowToUpdate,8).setValue(calName); //Calendar Name
              sheet.getRange(rowToUpdate,11).setValue(event.getDescription()); //Comment
              sheet.getRange(rowToUpdate,12).setValue(calId); //Calendar ID
              sheet.getRange(rowToUpdate,13).setValue(eventId); //Event ID
              sheet.getRange(rowToUpdate,14).setValue(eventStart); //start
              sheet.getRange(rowToUpdate,15).setValue(eventEnd); //end
              sheet.getRange(rowToUpdate,16).setValue(eventStart.getTime()); //Millisenconds
              sheet.getRange(rowToUpdate,17).setValue(calColor); //Calendar Color in Hex
              sheet.getRange(rowToUpdate,18).setValue(eventLastUpdated); //Last Updated
              
              //update background color
              range =  sheet.getRange(rowToUpdate,1,1,18);
              range.setBackground(calColor);
              
            }
          }
          else {
            Logger.log("event does not exist yet in sheet");
            
            if(debug == false) {
              sheet.appendRow([
                eventStart.getUTCFullYear(),
                eventStart.getWeek(),
                dateToString(eventStart),
                getTimeFromDate(eventStart),
                getTimeFromDate(eventEnd),
                eventTitle,
                getDuration(eventStart,eventEnd),
                calName,
                "", //feedback
                "", //energy
                event.getDescription(),
                calId,
                eventId,
                eventStart,
                eventEnd,
                eventStart.getTime(),
                calColor,
                eventLastUpdated
              ]);
              numberOfNewEvents++;
          
              //set the background color of the row matching the calendar color
              numberOfRows = sheet.getLastRow();
              Logger.log("number of rows: "+numberOfRows);
              range =  sheet.getRange(numberOfRows,1,1,18);
              range.setBackground(calColor);
            }
            
          
          }  
          
          
          
          
          
      
          
          /////*****//// column R
          
          
          //if event fields (title, start, end, description) are different update event in sheet
          
          //if event fields are not different skip this event and move on to next one
          }
          
        }
        
      }
    //sort sheet by eventStart
    sheet.sort(15);
      
    //add back title row from notes sheet
    var titleValues = SpreadsheetApp.getActive().getRange("notes!A17:Q17").getValues();
    sheet.insertRows(1);
    var titleRange = sheet.getRange("A1:Q1");
    titleRange.setValues(titleValues);
    SpreadsheetApp.getActive().getRange("notes!A17:R17").copyFormatToRange(sheet, 1, 17, 1, 1);
    
    //add day seperators                       
      
    numberOfRows = sheet.getLastRow();                                                   
      
    result=result+"<br>Synchronized "+numberOfRows+" rows";  
    result=result+"<br>of which new: "+numberOfNewEvents+" rows";
    result=result+"<br>of which updated: "+numberOfEventsUpdated+" rows";  
    result=result+"<br>of which deleted: "+numberOfDeletedEvents+" rows";
    
  }
  else {
    result=result+"<br>ERROR: Wrong sheet. Please select the event list sheet before running.";
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
   
  }
  Logger.log("date type: "+ typeof date);
  Logger.log("date: " + date);
  
  return date;
}

function dateToString(date) {
  var dateString = "";
  
  if(typeof date == "object") {
    if(date.getDate()<10) {
      dateString = "0";
    }
    dateString = dateString+date.getDate().toString();
    
    if(date.getMonth()<9) {
      dateString = dateString+"/0";
    }
    else {
      dateString = dateString+"/";
    }
    dateString = dateString+(date.getMonth()+1).toString();
    dateString = dateString+"/"+date.getYear();
  }
  return dateString;
}


function getTimeFromDate(date) {
  var timeString = "";
  
  if(typeof date == "object") {
    if(date.getHours()<10) {
      timeString="0";
    }
    timeString = timeString+date.getHours().toString();
    if(date.getMinutes()<10) {
      timeString=timeString+":0";
    }
    else {
      timeString=timeString+":";
    }
    timeString = timeString+date.getMinutes();
  }
  return timeString;
}

function getUTCTimeFromDate(date) {
  var timeString = "";
  
  if(typeof date == "object") {
    if(date.getHours()<10) {
      timeString="0";
    }
    timeString = timeString+date.getUTCHours().toString();
    if(date.getMinutes()<10) {
      timeString=timeString+":0";
    }
    else {
      timeString=timeString+":";
    }
    timeString = timeString+date.getMinutes();
  }
  return timeString;
}

function getDuration(startDate,endDate) {
  var duration;
  var durationNumber;
  var durationHours;
  var durationMinutes;
  
  durationNumber = endDate.getTime()-startDate.getTime();
  duration = new Date();
  duration.setTime(durationNumber);
  Logger.log(duration);
  
  durationNumber = durationNumber/1000/60; //convert to minutes
  Logger.log(durationNumber);
  
  duration = getUTCTimeFromDate(duration);
  
  return duration;
}


/**
 * Returns the week number for this date.  dowOffset is the day of week the week
 * "starts" on for your locale - it can be from 0 to 6. If dowOffset is 1 (Monday),
 * the week returned is the ISO 8601 week number.
 * @param int dowOffset
 * @return int
 */
Date.prototype.getWeek = function (dowOffset) {
/*getWeek() was developed by Nick Baicoianu at MeanFreePath: http://www.epoch-calendar.com */

	dowOffset = typeof(dowOffset) == 'int' ? dowOffset : 0; //default dowOffset to zero
	var newYear = new Date(this.getFullYear(),0,1);
	var day = newYear.getDay() - dowOffset; //the day of week the year begins on
	day = (day >= 0 ? day : day + 7);
	var daynum = Math.floor((this.getTime() - newYear.getTime() - 
	(this.getTimezoneOffset()-newYear.getTimezoneOffset())*60000)/86400000) + 1;
	var weeknum;
	//if the year starts before the middle of a week
	if(day < 4) {
		weeknum = Math.floor((daynum+day-1)/7) + 1;
		if(weeknum > 52) {
			nYear = new Date(this.getFullYear() + 1,0,1);
			nday = nYear.getDay() - dowOffset;
			nday = nday >= 0 ? nday : nday + 7;
			/*if the next year starts before the middle of
 			  the week, it is week #1 of that year*/
			weeknum = nday < 4 ? 1 : 53;
		}
	}
	else {
		weeknum = Math.floor((daynum+day-1)/7);
	}
	return weeknum;
};

