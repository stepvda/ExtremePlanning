function testCreateForm() {
  Logger.log(createForm("19f5u24qenvcrohjqrtusiq9d8@google.com")); //rusten on 22/6/2018 evening
}

function createForm(eventId) {
  var formUrl = "";
  var form = FormApp.create('Event Feedback');
  var formResponse = form.createResponse();
  var item;
  
  //Smiley feedback
  item = form.addMultipleChoiceItem()
  item.setTitle('Feedback')
  item.setChoiceValues([':-)',':-|',':-('])
  formResponse.withItemResponse(item.createResponse(':-|'));
  
  //Energy
  item = form.addGridItem();
  item.setTitle('Energy');
  item.setColumns(['-3','-2','-1','0','+1','+2','+3']);
  item.setRows(['choose:']);
  item.set
  formResponse.withItemResponse(item.createResponse(['-1']));
  
  //Comment
  item = form.addParagraphTextItem();
  item.setTitle('Comment');
  formResponse.withItemResponse(item.createResponse('testResponse'));
  
  //Comment2
  item = form.addParagraphTextItem();
  item.setTitle('Comment2');
  formResponse.withItemResponse(item.createResponse('testResponse2'));
  
  
  
  //formUrl=form.getPublishedUrl();
  formUrl=formResponse.toPrefilledUrl();
  
  return formUrl;
}

function getEventFromCalendar(eventId) {
  var calendar;
  var sheet;
  var data;
  var event
  
  //get event list sheet from sheet
  
  //load sheet into data
  
  //find row with matching eventId in data
  
  //read calendarId
  
  //load event from calendar
  
  return event;
}



function sampleForm() {
  
  // Create a new form, then add a checkbox question, a multiple choice question,
  // a page break, then a date question and a grid of questions.
  var form = FormApp.create('New Form');
  var item = form.addCheckboxItem();
  item.setTitle('What condiments would you like on your hot dog?');
  item.setChoices([
    item.createChoice('Ketchup'),
    item.createChoice('Mustard'),
    item.createChoice('Relish')
  ]);
  form.addMultipleChoiceItem()
  .setTitle('Do you prefer cats or dogs?')
  .setChoiceValues(['Cats','Dogs'])
  .showOtherOption(true);
  form.addPageBreakItem()
  .setTitle('Getting to know you');
  form.addDateItem()
  .setTitle('When were you born?');
  form.addGridItem()
  .setTitle('Rate your interests')
  .setRows(['Cars', 'Computers', 'Celebrities'])
  .setColumns(['Boring', 'So-so', 'Interesting']);
  Logger.log('Published URL: ' + form.getPublishedUrl());
  Logger.log('Editor URL: ' + form.getEditUrl());
  
}