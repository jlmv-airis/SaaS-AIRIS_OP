function doGet() {
  ensureSheets();

  var logoBase64 = '';
  if (typeof LOGO_BASE64 !== 'undefined') {
    logoBase64 = LOGO_BASE64;
  }

  var tpl = HtmlService.createTemplateFromFile('Index');
  tpl.logoBase64 = logoBase64;

  var output = tpl.evaluate()
    .setTitle('SaaS AIRIS - Operaciones')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0');

  return output.setFaviconUrl('https://ssl.gstatic.com/docs/script/images/favicon.ico');
}

function inspectSheetStructure() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var result = [];
  var sheets = ss.getSheets();
  for (var i = 0; i < sheets.length; i++) {
    var s = sheets[i];
    var name = s.getName();
    var data = s.getDataRange().getValues();
    var headers = [];
    if (data.length > 0) {
      for (var j = 0; j < data[0].length; j++) {
        headers.push(String(data[0][j]));
      }
    }
    result.push({
      sheet: name,
      rows: data.length,
      cols: headers.length,
      headers: headers
    });
  }
  Logger.log(JSON.stringify(result, null, 2));
  return result;
}

function createNewSaaSheet() {
  // Create new spreadsheet
  var newSpreadsheet = SpreadsheetApp.create('SaaS AIRIS - Operaciones Financieras');
  var fileId = newSpreadsheet.getId();
  var sheetUrl = 'https://docs.google.com/spreadsheets/d/' + fileId;
  
  Logger.log('✓ Nuevo sheet creado: ' + sheetUrl);
  Logger.log('Script ID: ' + ScriptApp.getScriptId());
  Logger.log('File ID: ' + fileId);
  
  return {
    url: sheetUrl,
    fileId: fileId,
    scriptId: ScriptApp.getScriptId()
  };
}
