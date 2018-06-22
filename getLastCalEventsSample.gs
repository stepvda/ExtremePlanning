////SAMPLE CODE////
/**
 * Lists 10 upcoming events in the user's calendar.
 */
function listUpcomingEvents() {
  //var calendarId = 'primary';
  var calendarId = 'stepvda.net_a9b0hqm7b4h9rq0pn2nkc9iu2g@group.calendar.google.com'; //thuis calendar
  var optionalArgs = {
    timeMin: (new Date()).toISOString(),
    showDeleted: false,
    singleEvents: true,
    maxResults: 10,
    orderBy: 'startTime'
  };
  var response = Calendar.Events.list(calendarId, optionalArgs);
  var events = response.items;
  if (events.length > 0) {
    for (i = 0; i < events.length; i++) {
      var event = events[i];
      var when = event.start.dateTime;
      if (!when) {
        when = event.start.date;
      }
      Logger.log('%s (%s)', event.summary, when);
      //Logger.log('%s (%s)', event.summary, Calendar.CalendarList[i].g , when);
    }
  } else {
    Logger.log('No upcoming events found.');
  }
}

