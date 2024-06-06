function actualizarLeads() {
  // Función principal que coordina la ejecución de todas las funciones anteriores
  var ss = SpreadsheetApp.getActiveSpreadsheet(); // Obtener la hoja de cálculo activa
  var sourceSheet = ss.getSheetByName("Leads compradores"); // Obtener la hoja "Leads compradores"
  
  ajustarAnchoColumnas(sourceSheet); // Ajustar el ancho de las columnas y congelar la primera fila en la hoja principal
  actualizarColumnaMes(sourceSheet); // Actualizar la columna "Mes" en la hoja principal
  
  var data = sourceSheet.getDataRange().getValues(); // Obtener todos los datos de la hoja principal
  var fondoComercioColumn = 2; // Columna B: Fondo de comercio
  var fondosDeComercio = [...new Set(data.map(row => row[fondoComercioColumn - 1]))].filter(fondo => fondo); // Obtener una lista única de fondos de comercio
  
  limpiarHojasFondos(ss, fondosDeComercio); // Limpiar las hojas de cada fondo de comercio
  copiarDatosFondos(ss, sourceSheet, fondosDeComercio); // Copiar los datos a las hojas correspondientes
}

function ajustarAnchoColumnas(sheet) {
  // Función para ajustar el ancho de las columnas y congelar la primera fila en una hoja dada
  var columnWidths = [70, 120, 120, 110, 90, 350, 180, 80]; // Anchos de las columnas
  sheet.setFrozenRows(1); // Congelar la primera fila
  for (var i = 0; i < columnWidths.length; i++) {
    sheet.setColumnWidth(i + 1, columnWidths[i]); // Ajustar el ancho de cada columna
  }
}

function actualizarColumnaMes(sheet) {
  // Función para actualizar la columna "Mes" en la hoja "Leads compradores"
  var data = sheet.getDataRange().getValues(); // Obtener todos los datos de la hoja
  var fechaConsultaColumn = 1; // Columna A: Fecha de consulta
  var mesColumn = 8; // Columna H: Mes
  
  for (var i = 1; i < data.length; i++) { // Iterar sobre cada fila, empezando desde la segunda
    var fechaConsulta = new Date(data[i][fechaConsultaColumn - 1]); // Obtener la fecha de consulta
    var mes = fechaConsulta.getFullYear() + '.' + ('0' + (fechaConsulta.getMonth() + 1)).slice(-2); // Formatear el mes como YYYY.MM
    sheet.getRange(i + 1, mesColumn).setValue(mes); // Establecer el valor en la columna "Mes"
  }
}

function limpiarHojasFondos(ss, fondosDeComercio) {
  // Función para limpiar las hojas de cada fondo de comercio
  fondosDeComercio.forEach(fondoComercio => { // Iterar sobre cada fondo de comercio
    var targetSheet = ss.getSheetByName(fondoComercio); // Obtener la hoja correspondiente al fondo de comercio
    if (targetSheet) {
      var lastRow = targetSheet.getLastRow(); // Obtener la última fila con datos
      if (lastRow > 1) {
        targetSheet.deleteRows(2, lastRow - 1); // Eliminar todas las filas excepto la primera
      }
      ajustarAnchoColumnas(targetSheet); // Ajustar el ancho de las columnas y congelar la primera fila
    }
  });
}

function copiarDatosFondos(ss, sourceSheet, fondosDeComercio) {
  // Función para copiar los datos de la hoja principal a las hojas correspondientes de los fondos de comercio
  var data = sourceSheet.getDataRange().getValues(); // Obtener todos los datos de la hoja principal
  var fondoComercioColumn = 2; // Columna B: Fondo de comercio
  
  for (var i = 1; i < data.length; i++) { // Iterar sobre cada fila, empezando desde la segunda
    var fondoComercio = data[i][fondoComercioColumn - 1]; // Obtener el nombre del fondo de comercio
    var targetSheet = ss.getSheetByName(fondoComercio); // Obtener la hoja correspondiente al fondo de comercio
    
    if (targetSheet) {
      var lastRow = targetSheet.getLastRow(); // Obtener la última fila con datos
      var sourceRow = sourceSheet.getRange(i + 1, 1, 1, sourceSheet.getLastColumn()); // Obtener la fila completa de la hoja principal
      targetSheet.insertRowAfter(lastRow); // Insertar una nueva fila después de la última fila
      sourceRow.copyTo(targetSheet.getRange(lastRow + 1, 1)); // Copiar los datos de la fila editada a la nueva fila
    }
  }
}