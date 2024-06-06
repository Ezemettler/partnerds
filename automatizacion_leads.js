function actualizarLeads() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sourceSheet = ss.getSheetByName("Leads compradores");
  
  // Define las columnas relevantes
  var fondoComercioColumn = 2; // La columna que contiene el nombre del fondo de comercio (B)
  var columnWidths = [70, 120, 120, 110, 90, 350, 180]; // Ancho de cada columna
  
  // Ajusta el ancho de las columnas y la primera fila en la hoja principal
  sourceSheet.setFrozenRows(1);
  for (var i = 0; i < columnWidths.length; i++) {
    sourceSheet.setColumnWidth(i + 1, columnWidths[i]);
  }
  
  // Obtiene todas las filas de la hoja principal
  var data = sourceSheet.getDataRange().getValues();
  
  // Obtiene una lista única de fondos de comercio
  var fondosDeComercio = [...new Set(data.map(row => row[fondoComercioColumn - 1]))].filter(fondo => fondo);
  
  // Limpia todas las hojas correspondientes a cada fondo de comercio y ajusta el ancho de las columnas y la primera fila
  fondosDeComercio.forEach(fondoComercio => {
    var targetSheet = ss.getSheetByName(fondoComercio);
    if (targetSheet) {
      var lastRow = targetSheet.getLastRow();
      if (lastRow > 1) {
        targetSheet.deleteRows(2, lastRow - 1);
      }
      
      // Ajusta el ancho de las columnas y la primera fila en la hoja del fondo de comercio
      targetSheet.setFrozenRows(1);
      for (var i = 0; i < columnWidths.length; i++) {
        targetSheet.setColumnWidth(i + 1, columnWidths[i]);
      }
    }
  });

  // Recorre todas las filas, empezando desde la fila 2 (índice 1) para saltar la cabecera
  for (var i = 1; i < data.length; i++) {
    var fondoComercio = data[i][fondoComercioColumn - 1]; // Obtener el nombre del fondo de comercio
    var targetSheet = ss.getSheetByName(fondoComercio); // Buscar la hoja correspondiente al fondo de comercio
    
    if (targetSheet) {
      var lastRow = targetSheet.getLastRow();
      
      // Copia la fila completa desde la hoja principal a la hoja de destino
      var sourceRow = sourceSheet.getRange(i + 1, 1, 1, sourceSheet.getLastColumn());
      targetSheet.insertRowAfter(lastRow); // Inserta una nueva fila después de la última fila en la hoja de destino
      sourceRow.copyTo(targetSheet.getRange(lastRow + 1, 1)); // Copia los datos de la fila editada a la nueva fila en la hoja de destino
    }
  }
}
