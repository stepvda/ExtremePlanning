function onOpen() {
  var menu = SpreadsheetApp.getUi().createMenu('Extreme Planning');
  var item = menu.addItem('Run Template', 'showTemplateSidebar');
  item.addItem('Feedback', 'showFeedbackSidebar');
  item.addItem('Sync', 'showSyncSidebar');
  item.addItem('Analyze', 'showAnalyzeSidebar');
  item.addItem('Configure', 'showConfigSidebar');
  
  item.addToUi();
  
 
}

function showTemplateSidebar() {
  var html = HtmlService.createHtmlOutputFromFile('sidebarUI').setTitle('Run Template').setWidth(300);
  SpreadsheetApp.getUi().showSidebar(html);
}

function showFeedbackSidebar() {
}

function showSyncSidebar() {
}

function showAnalyzeSidebar() {
}

function showConfigSidebar() {
}
