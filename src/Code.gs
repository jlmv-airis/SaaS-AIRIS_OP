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
