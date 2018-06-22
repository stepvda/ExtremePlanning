function onOpen() {
  var menu = SpreadsheetApp.getUi().createMenu('Extreme Planning');
  var item = menu.addItem('Run Template', 'showTemplateSidebar');
  item.addItem('Feedback', 'showFeedbackSidebar');
  item.addItem('Sync', 'showSyncSidebar');
  item.addItem('Analyze', 'showAnalyzeSidebar');
  item.addSeparator();
  item.addItem('Setup & Configure', 'showConfigSidebar');
  item.addSeparator();
  item.addItem('Help', 'showHelpSidebar');
  
  item.addToUi();
  
 
}

function showTemplateSidebar() {
  var html = HtmlService.createHtmlOutputFromFile('createEventsUI').setTitle('Run Template').setWidth(300);
  SpreadsheetApp.getUi().showSidebar(html);
}

function showFeedbackSidebar() {
}

function showSyncSidebar() {
  var html = HtmlService.createHtmlOutputFromFile('syncUI').setTitle('Sync').setWidth(300);
  SpreadsheetApp.getUi().showSidebar(html);
}

function showAnalyzeSidebar() {
}

function showConfigSidebar() {
}
