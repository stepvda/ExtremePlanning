function myFunction() {
  
  
  // event load returns null
  var calendar1 = CalendarApp.getCalendarById('stepvda.net_qfrvg5ehirv97ps04o16fjiokk@group.calendar.google.com');
  var event1 = calendar1.getEventById('4F29BF57-4264-44E9-9162-9E6B9B97AF53'); 
  
  // event code returns event object correctly
  var calendar2 = CalendarApp.getCalendarById('stepvda.net_duntt2cuqlirkucfamgj0vec18@group.calendar.google.com');
  var event2 = calendar2.getEventById('2nn755esk1bqj18bf4efabq5i0@google.com');
  
  var i1;
  var items=Calendar.CalendarList.list().items;
  var event10;
  for(i1=0;i1<items.length;i1++) {
    Logger.log(items[i1].summary+ "-//////-"+items[i1].id); 
    if(items[i1].summary=='ontspanning') {
      //event10=Calendar.Events.get(items[i1].id, '2nn755esk1bqj18bf4efabq5i0@google.com');
     //event10=Calendar.Events.
    }
  }
  
  
  //
  
   // even code 
  var event4 = Calendar.Events.get('stepvda.net_duntt2cuqlirkucfamgj0vec18@group.calendar.google.com','2nn755esk1bqj18bf4efabq5i0'); //needed to remove @google.com for this to work
  
  // event load returns null
  var event3 =  Calendar.Events.get('stepvda.net_pefgjkult8fgf2a7oqp1se29ac@group.calendar.google.com', '_6orj0d248kq36c9o8orj8c1n8p0j0d9p8kr3gc246opjcghm70p30');
  
 
  
  return 0;
}
