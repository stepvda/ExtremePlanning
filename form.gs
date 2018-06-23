function testCreateForm() {
  createForm("19f5u24qenvcrohjqrtusiq9d8@google.com", "stepvda.net_duntt2cuqlirkucfamgj0vec18@group.calendar.google.com"); //rusten on 22/6/2018 evening
 
}

function createForm(eventId, calendarId) {
  var formUrl = "";
  var form = FormApp.create('Event Feedback');
  var formResponse = form.createResponse();
  var item;
  var event = getEventFromCalendar(eventId, calendarId);
  var eventFeedback = getEventFeedbackFromSheet(eventId);
  var energy;
  var feedbackAvailable = false;
  
  if(typeof eventFeedback == 'object') {
    feedbackAvailable = true;
  }
  Logger.log('feedback: '+ feedbackAvailable);
  Logger.log('eventId: '+ eventId+ ' type: '+typeof event);
  
  Logger.log('event title: '+event.getTitle());
  
  form.setDescription(event.getTitle());
  

  Logger.log('BEFORE smiley'); 
  
  //Smiley feedback
  item = form.addMultipleChoiceItem()
  item.setTitle('Feedback')
  item.setChoiceValues([':-)',':-|',':-('])
  if(feedbackAvailable) {
    formResponse.withItemResponse(item.createResponse(eventFeedback[0]));
  }
  Logger.log('AFTER smiley');
  
  //Energy
  item = form.addGridItem();
  item.setTitle('Energy');
  item.setColumns(['-3','-2','-1','0','+1','+2','+3']);
  item.setRows(['choose:']);
  if(feedbackAvailable) {
    energy = eventFeedback[1];
    formResponse.withItemResponse(item.createResponse([energy]));
  }
  
  //Comment
  item = form.addParagraphTextItem();
  item.setTitle('Comment');
  if(feedbackAvailable) {
    formResponse.withItemResponse(item.createResponse(eventFeedback[2]));
  }
  
  //Title
  item = form.addParagraphTextItem();
  item.setTitle('Title');
  formResponse.withItemResponse(item.createResponse(event.getTitle()));
  
  //Date
  item = form.addParagraphTextItem();
  item.setTitle('Date');
  formResponse.withItemResponse(item.createResponse(dateToString(event.getStartTime())));
  
  //Start time
  item = form.addParagraphTextItem();
  item.setTitle('Start time');
  formResponse.withItemResponse(item.createResponse(getTimeFromDate(event.getStartTime())));
  
  //End time
  item = form.addParagraphTextItem();
  item.setTitle('End time');
  formResponse.withItemResponse(item.createResponse(getTimeFromDate(event.getEndTime())));
  
  //Event Id  
  item = form.addParagraphTextItem();
  item.setTitle('EventId');
  formResponse.withItemResponse(item.createResponse(eventId));
   
  
  //install submit trigger
  ScriptApp.newTrigger('submitForm')
    .forForm(form)
    .onFormSubmit()
    .create();

  //get pre-filled URL for form
  formUrl=formResponse.toPrefilledUrl();
  
  //store formUrl in event description
  event.setDescription(formUrl); //TODO: need to preserve text content but remove previous form url
  
  Logger.log(formUrl);
  
  return formUrl;
}

function submitForm(e) {
//  Logger.log('***Form submitted***');
//  Logger.log('typeof: '+typeof e);
//  Logger.log("%s", JSON.stringify(e)); //output object information to string
  
  var responses = e.response.getItemResponses();
  var feedback = responses[0].getResponse();
  var energy = responses[1].getResponse();
  var comment = responses[2].getResponse();
  var eventId = responses[7].getResponse();
  
  Logger.log(feedback+energy+comment+eventId);
  
  //TODO: store feedback 
  var sheet = SpreadsheetApp.getActive().getSheetByName('event list');
  var data = sheet.getDataRange().getValues();
  var i2;
  

//  Logger.log("length: "+responses.length);
//  var i1;
//  for(i1=0;i1<responses.length;i1++) {
//    Logger.log(responses[i1].getItem().getTitle()  +": "+ responses[i1].getResponse())
//    //Logger.log(typeof responses[i1].getResponse())
//  }
  
}

function getEventFromCalendar(eventId, calendarId) {
  var calendar;
  var event = 0;

  //load event from calendar
  calendar = CalendarApp.getCalendarById(calendarId);
  //load event from calendar
  event = calendar.getEventById(eventId);

 
  return event;
}

function getEventFeedbackFromSheet(eventId) {
  //var eventFeedback = [':-)','+1','dummy feedback'];
  var eventFeedback = "none";
  
  var calendar;
  var calendarId;
  var sheet;
  var data;
  var event = 0;
  var found = false;
  
  var feedback;
  var energy;
  var feedbackOk = false;
  var energyOk = false;
  
  var i1;
  
  //get event list sheet from sheet
  sheet = SpreadsheetApp.getActive().getSheetByName('event list');
  
  //load sheet into data
  data = sheet.getDataRange().getValues();
  
  //find row with matching eventId in data
  for(i1=0;i1<data.length;i1++) {
    if(data[i1][12]==eventId) {
      found = true;
      
      //check feedback values
      feedback = data[i1][8];
      if(feedback==':-(' || 
         feedback==':-|' || 
         feedback==':-)' ) {
        feedbackOk = true;
      }
            
      //check energy values
      energy = data[i1][9];
      if(energy=='-3' ||
         energy=='-2' ||
         energy=='-1' ||
         energy=='0'  ||
         energy=='+1' ||
         energy=='+2' ||
         energy=='+3' ) {
        energyOk = true;
      }
     
      //create feedback array
      if(feedbackOk && energyOk) {
        eventFeedback = [ feedback , energy , data[i1][10] ];    
      }
    }

  }
   
  return eventFeedback;
}


