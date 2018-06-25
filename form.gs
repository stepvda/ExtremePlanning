function testCreateForm() {
  createForm("19f5u24qenvcrohjqrtusiq9d8@google.com", "stepvda.net_duntt2cuqlirkucfamgj0vec18@group.calendar.google.com"); //rusten on 22/6/2018 evening
 
}


function createForm(eventId, calendarId) {
  //load formId from project preferences/properties
  var scriptProperties = PropertiesService.getScriptProperties();
  var formId = scriptProperties.getProperty('FORM_ID');
  var form;
  
  //if form does noet exist for user create new form 
  if(formId == null) {
    //create form
    form = createNewForm();
    //store form Id in project properties
    scriptProperties.setProperty('FORM_ID', form.getId());
  }
  else {       
    //if form exists load by Id
    form = FormApp.openById(formId);
  }
  
  var event;
 
  //open event
  event = CalendarApp.getCalendarById(calendarId).getEventById(eventId);
  
  var feedback = '';
  var energy = '';
  var comment = '';
  var link = '';
  var freeText = '';
 
  //read fields from event description
  var eventDescriptionArray = parseEventDescription(event.getDescription());  
  
  //verify if event has structured description so the values can be reused
  if(eventDescriptionArray.length == 4) {
    feedback = eventDescriptionArray[0];
    energy = eventDescriptionArray[1];
    comment = eventDescriptionArray[2];
    freeText = eventDescriptionArray[3];
  }
  //event description is not structure so empty structure is added and existing description is added at the end
  else {
    freeText = event.getDescription();
  }
   
  //create form responses
  var items = form.getItems();
  var item;
  var formResponse = form.createResponse();
  
  //Feedback
  item = items[0].asMultipleChoiceItem();
  formResponse.withItemResponse( item.createResponse([feedback]) );
  //Energy
  item = items[1].asGridItem();
  formResponse.withItemResponse(item.createResponse([energy]));
  //Comment
  item = items[2].asParagraphTextItem();
  formResponse.withItemResponse(item.createResponse(comment));
  //Title
  item = items[3].asTextItem();
  formResponse.withItemResponse(item.createResponse(event.getTitle()));
  //Date
  item = items[4].asTextItem();
  formResponse.withItemResponse(item.createResponse(dateToString(event.getStartTime())));
  //Start time
  item = items[5].asTextItem();
  formResponse.withItemResponse(item.createResponse(getTimeFromDate(event.getStartTime())));
  //End time
  item = items[6].asTextItem();
  formResponse.withItemResponse(item.createResponse(getTimeFromDate(event.getEndTime())));
  //Event Id  
  item = items[7].asTextItem();
  formResponse.withItemResponse(item.createResponse(eventId));
  
   
  //get pre-filled resonse link
  link = form.shortenFormUrl( formResponse.toPrefilledUrl() );
  
  //create new description with updated structure 
  event.setDescription( createEventDescription(feedback,energy,comment,link,freeText) );
    
}

function parseEventDescription(eventDescription) {
  var eventDescriptionArray = [];
  
  var p1 = eventDescription.search('feedback: ');
  var p2 = eventDescription.search('energy: ');
  var p3 = eventDescription.search('comment: ');
  var p4 = eventDescription.search('link: ');
  var p5 = eventDescription.search('------ do not edit the above ------');
  
  if(p1>=0 && p2>=0 && p3>=0 && p4>=0 && p5>=0) {
    var feedback = eventDescription.substring(p1+10,p2-1);
    var energy = eventDescription.substring(p2+8,p3-1);
    var comment = eventDescription.substring(p3+9,p4-1);
    var freeText = eventDescription.substring(p5+36,eventDescription.length);
    eventDescriptionArray = [feedback,energy,comment,freeText];
  }
  
  return eventDescriptionArray;
}

function createEventDescription(feedback,energy,comment,link,freeText) {
  var description='';
  
  description=description+'[[[ Extreme Planning section ]]]\n';
  description=description+'feedback: '+feedback+'\n';
  description=description+'energy: '+energy+'\n';
  description=description+'comment: '+comment+'\n';
  description=description+'link: '+link+'\n';
  description=description+'------ do not edit the above ------\n';
  description=description+freeText;
 
  return description; 
}

//Create new empty form
//normally only used the first time the project is run
function createNewForm() {
  var form = FormApp.create('Event Feedback');
  var item;
 
  //Smiley feedback
  item = form.addMultipleChoiceItem()
  item.setTitle('Feedback')
  item.setChoiceValues([':-)',':-|',':-(']);
   
  //Energy
  item = form.addGridItem();
  item.setTitle('Energy');
  item.setColumns(['-3','-2','-1','0','+1','+2','+3']);
  item.setRows(['choose:']);
  
  //Comment
  item = form.addParagraphTextItem();
  item.setTitle('Comment');
   
  //Title
  item = form.addTextItem();
  item.setTitle('Title');
 
  //Date
  item = form.addTextItem();
  item.setTitle('Date');
  
  //Start time
  item = form.addTextItem();
  item.setTitle('Start time');
  
  //End time
  item = form.addTextItem();
  item.setTitle('End time');
  
  //Event Id  
  item = form.addTextItem();
  item.setTitle('EventId');
  
  //install submit trigger
  ScriptApp.newTrigger('submitForm')
    .forForm(form)
    .onFormSubmit()
    .create();
    
  
  return form;
}

//trigger handler
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
  
  //store feedback in sheet
  var sheet = SpreadsheetApp.getActive().getSheetByName('event list');
  var data = sheet.getDataRange().getValues();
  var i2;
  
  //store feedback in event
  
  
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


//delete form from preferences and remove trigger from project
//WARNING: existing form url's will stop working! You should only use this function for debug purposes.
function deleteForm() {
  var scriptProperties = PropertiesService.getScriptProperties();
  var formId = scriptProperties.getProperty('FORM_ID');
  var form;
  var triggers;
  var trigger;
  var i1;
  
  //if form exists, delete the form, delete the preference property, delete the trigger 
  if(formId != null) {
    //delete preference property
    scriptProperties.deleteProperty('FORM_ID');
    //delete trigger
    triggers = ScriptApp.getProjectTriggers();
    for(i1=0;i1<triggers.length;i1++) {
      trigger = triggers[i1].getHandlerFunction();
      if(trigger=='submitForm') {  
        ScriptApp.deleteTrigger(triggers[i1]);
      }
    }
    //delete form
    DriveApp.getFileById(formId).setTrashed(true);
  }
  else {       
    //if form exists load by Id
    Logger.log('Form to delete not found in preferences.');
  }  
}

