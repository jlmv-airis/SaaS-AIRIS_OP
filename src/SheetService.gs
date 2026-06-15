// Sheet Names
var SHEET_CONFIG = 'Config';
var SHEET_LOGS = 'Logs';
var SHEET_USUARIOS = 'Usuarios';
var SHEET_EMPRESAS = 'Empresas';
var SHEET_MOVIMIENTOS = 'Movimientos';
var SHEET_FACTURAS = 'Facturas';
var SHEET_CATEGORIAS = 'Categorias';
var SHEET_REPORTES = 'Reportes';

function ensureSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ss.getSheets().map(function(s) { return s.getName(); });

  var required = [
    { name: SHEET_CONFIG, headers: ['key', 'value'] },
    { name: SHEET_LOGS, headers: ['timestamp', 'user', 'action', 'detail'] },
    { name: SHEET_USUARIOS, headers: ['id', 'nombre', 'email', 'rol', 'estado', 'fecha_creacion'] },
    { name: SHEET_EMPRESAS, headers: ['id', 'nombre', 'rfc', 'direccion', 'telefono', 'email_contacto', 'estado', 'fecha_creacion'] },
    { name: SHEET_MOVIMIENTOS, headers: ['id', 'empresa_id', 'fecha', 'tipo', 'categoria', 'concepto', 'monto', 'usuario', 'comprobante', 'notas', 'estado'] },
    { name: SHEET_FACTURAS, headers: ['id', 'empresa_id', 'numero_factura', 'fecha_emision', 'fecha_vencimiento', 'proveedor', 'monto', 'impuestos', 'total', 'estado', 'archivo'] },
    { name: SHEET_CATEGORIAS, headers: ['id', 'nombre', 'tipo', 'descripcion'] },
    { name: SHEET_REPORTES, headers: ['id', 'nombre', 'tipo', 'periodo', 'fecha_generacion', 'archivo_url'] }
  ];

  required.forEach(function(sheet) {
    if (sheets.indexOf(sheet.name) === -1) {
      var newSheet = ss.insertSheet(sheet.name);
      newSheet.appendRow(sheet.headers);
      newSheet.setFrozenRows(1);
      // Format header row
      var headerRange = newSheet.getRange(1, 1, 1, sheet.headers.length);
      headerRange.setBackground('#4285F4').setFontColor('#ffffff').setFontWeight('bold');
    }
  });

  initConfig();
}

function initConfig() {
  var data = getSheetData(SHEET_CONFIG);
  var keys = {};
  data.forEach(function(row) { keys[row[0]] = true; });

  if (!keys['admin_pass']) {
    appendRow(SHEET_CONFIG, ['admin_pass', hashPassword('admin123')]);
  }
  if (!keys['app_initialized']) {
    appendRow(SHEET_CONFIG, ['app_initialized', 'true']);
  }
}

function hashPassword(password) {
  var digest = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_512,
    password,
    Utilities.Charset.UTF_8
  );
  var hex = '';
  for (var i = 0; i < digest.length; i++) {
    var byte = digest[i];
    if (byte < 0) byte += 256;
    hex += byte.toString(16).padStart(2, '0');
  }
  return hex;
}

function getSheetData(sheetName) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) return [];
    var rows = sheet.getDataRange().getValues();
    return rows.slice(1);
  } catch (e) {
    console.error('getSheetData(' + sheetName + ') error: ' + e.toString());
    return [];
  }
}

function appendRow(sheetName, values) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  sheet.appendRow(values);
}

function updateRow(sheetName, rowIndex, values) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  var range = sheet.getRange(rowIndex + 2, 1, 1, values.length);
  range.setValues([values]);
}

function deleteRow(sheetName, dataIndex) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  sheet.deleteRow(dataIndex + 2);
}

function findRowIndex(sheetName, columnIndex, value) {
  var data = getSheetData(sheetName);
  for (var i = 0; i < data.length; i++) {
    if (String(data[i][columnIndex]) === String(value)) return i;
  }
  return -1;
}

function getConfig(key) {
  var data = getSheetData(SHEET_CONFIG);
  for (var i = 0; i < data.length; i++) {
    if (data[i][0] === key) return data[i][1];
  }
  return null;
}

function updateConfig(key, value) {
  var data = getSheetData(SHEET_CONFIG);
  for (var i = 0; i < data.length; i++) {
    if (data[i][0] === key) {
      updateRow(SHEET_CONFIG, i, [key, value]);
      return;
    }
  }
  appendRow(SHEET_CONFIG, [key, value]);
}

function logAction(user, action, detail) {
  appendRow(SHEET_LOGS, [new Date().toISOString(), user, action, detail]);
}
