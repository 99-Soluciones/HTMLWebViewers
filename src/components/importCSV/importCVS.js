function csvToJson(csv, ventaID) {
  /**
   * Configuración de columnas clave
   * colUnique: Columna que identifica de forma única cada ítem
   * colHelper: Columna auxiliar para validar si se maneja el mismo precio
   * colToSum: Columna numérica cuyos valores se deben sumar cuando hay ítems duplicados
   */
  
  let colUnique = 'SKU';
  let colHelper = 'Precio Unitario';
  let colToSum = 'Cantidad';


  /* --- Procesamiento del CSV --- */
  let lines = csv.split(/\r\n|\n|\r/);

  /* --- Validación básica - El minimo tamaño debe ser 2 (1 header + 1 data) --- */
  if (lines.length < 2) {
    let response = {
      ventaID : ventaID,
      validItems: [],
      errorItems: ['El archivo está vacío o no tiene encabezados.'],
    };
    FileMaker.PerformScript(
      'ventaITM -- generarITMsDesdeCSV[js]|v0.25.3',
      JSON.stringify(response)
    );
    return;
  }

  /* --- Procesamiento de encabezados --- */
  /* --- Limpieza de espacios en encabezados --- */
  let headers = lines[0]
    .split(',')
    .filter((header) => header.trim() !== '')
    .map((header) => header.trim());

  /* --- Índices --- */
  let uniqueIndex = -1;
  let sumIndex = -1;
  let helperIndex = -1;

  /* --- Búsqueda de índices de columnas clave --- */
  for (let h = 0; h < headers.length; h++) {
    let headerClean = headers[h].trim();
    if (headerClean === colUnique) uniqueIndex = h;
    if (headerClean === colHelper) helperIndex = h;
    if (headerClean === colToSum) sumIndex = h;
  }

  /* --- Validación de columnas obligatorias --- */
  if (uniqueIndex === -1 || sumIndex === -1 || helperIndex === -1) {
    let response = {
      ventaID : ventaID,
      validItems: [],
      errorItems: [
        'No se encontraron las columnas obligatorias (SKU, Precio, Cantidad).',
      ],
    };
    FileMaker.PerformScript(
      'ventaITM -- generarITMsDesdeCSV[js]|v0.25.3',
      JSON.stringify(response)
    );
    return;
  }

  /* Inicialización de estructuras */
  let dataMap = {};
  let errorList = [];

  /* --- Procesamiento de filas --- */
  for (let i = 1; i < lines.length; i++) {
    /* --- Saltamos líneas vacías --- */
    if (!lines[i] || lines[i].replace(/[\s,]/g, '') === '') continue;

    /* --- Procesamos la línea actual --- */
    let currentline = lines[i].split(',');

    /* 1. Extracción de valores RAW */
    let rawSku = currentline[uniqueIndex]
      ? currentline[uniqueIndex].trim()
      : '';
    let rawPriceStr = currentline[helperIndex]
      ? currentline[helperIndex].trim()
      : '';
    let rawQtyStr = currentline[sumIndex] ? currentline[sumIndex].trim() : '';

    /**
     * Validaciones básicas de los valores clave
     * Si alguna validación falla, registramos el error y continuamos con la siguiente fila
     */
    /* Si el SKU está vacío */
    if (rawSku === '') {
      errorList.push({
        row: i + 1,
        reason: 'El SKU está vacío',
        data: `Descripcion: ${currentline[3]} - Precio: ${rawPriceStr} - Cantidad: ${rawQtyStr}`,
      });
      continue;
    }

    /* Si el precio no es un número válido o está vacío */
    let priceNum = parseFloat(rawPriceStr);
    if (rawPriceStr === '' || isNaN(priceNum) || priceNum < 0.01) {
      errorList.push({
        row: i + 1,
        reason: 'Precio inválido o vacío',
        data: rawSku,
      });
      continue;
    }

    /* Si la cantidad no es un número válido o está vacía */
    let qtyNum = parseFloat(rawQtyStr);
    if (rawQtyStr === '' || isNaN(qtyNum) || qtyNum <= 0) {
      errorList.push({
        row: i + 1,
        reason: 'Cantidad inválida o vacía',
        data: rawSku,
      });
      continue;
    }

    /**
     * Construcción del objeto para la fila actual
     * Usamos los encabezados como claves y los valores de la fila como valores
     */
    let obj = {};
    for (let j = 0; j < headers.length; j++) {
      let key = headers[j].trim();
      let val = currentline[j]
        ? currentline[j].trim().replace(/^"|"$/g, '')
        : '';
      obj[key] = val;
    }

    /* 4. Lógica de Agrupación (Llave Compuesta) */

    /* --- Obtenemos los valores clave para esta fila --- */
    let priceFixed = priceNum.toFixed(2);
    let uniqueKey = rawSku + '_' + priceFixed;

    /**
     * Verificamos si ya existe un ítem con la misma clave única y auxiliar
     * La condicion valida si existe el SKU y si el precio es el mismo
     */
    if (dataMap[uniqueKey]) {
      /* Convertimos los valores a números y sumamos */
      let oldQty = parseFloat(dataMap[uniqueKey][colToSum]) || 0;
      dataMap[uniqueKey][colToSum] = (oldQty + qtyNum).toString();
    } else {
      /* --- Si no existe, agregamos el nuevo ítem al mapa --- */
      dataMap[uniqueKey] = obj;
    }
  }

  let finalResponse = {
    ventaID : ventaID,
    validItems: Object.values(dataMap),
    errorItems: errorList,
  };

  // FileMaker.PerformScript('ventaITM -- generarITMsDesdeCSV[js]|v0.25.3', JSON.stringify(finalResponse));
console.log(finalResponse);
  
}

/* --- Datos CSV de ejemplo --- */

let csvData = `SKU,Cantidad,Precio Unitario,Descripcion,,,,,,
LAP-DELL-X15,1,1200,Laptop Dell XPS 15,,,,,,
MOUSE-LOG-G203,5,25.5,Mouse Gamer Logitech G203,,,,,,
KB-MECH-RGB,2,80,Teclado Mecanico RGB,,,,,,
MON-SAM-24,1,180,Monitor Samsung 24 Curvo,,,,,,
USB-KING-32GB,10,8.5,USB Kingston 32GB Metal,,,,,,
CABLE-HDMI-2M,20,5,Cable HDMI 2 Metros 4K,,,,,,
CABLE-USBC-1M,15,,Cable USB-C Carga Rapida,,,,,,
HDD-TOSH-2TB,3,65,Disco Duro Toshiba 2TB,,,,,,
SSD-WD-500GB,4,45,SSD Western Digital 500GB,,,,,,
RAM-DDR4-8GB,8,35,Memoria RAM 8GB DDR4,,,,,,
LAP-DELL-X15,1,1200,Laptop Dell XPS 15,,,,,,
MOUSE-LOG-G203,3,25.5,Mouse Gamer Logitech G203,,,,,,
KB-MECH-RGB,1,80,Teclado Mecanico RGB,,,,,,
MON-SAM-24,2,180,Monitor Samsung 24 Curvo,,,,,,
,5,8.5,USB Kingston 32GB Metal,,,,,,
CABLE-HDMI-2M,10,5,Cable HDMI 2 Metros 4K,,,,,,
CABLE-USBC-1M,8,7.5,Cable USB-C Carga Rapida,,,,,,
HDD-TOSH-2TB,2,65,Disco Duro Toshiba 2TB,,,,,,
SSD-WD-500GB,2,45,SSD Western Digital 500GB,,,,,,
RAM-DDR4-8GB,4,35,Memoria RAM 8GB DDR4,,,,,,
LAP-HP-PAV,1,950,Laptop HP Pavilion 15,,,,,,
MOUSE-GEN-WL,10,,Mouse Generico Wireless,,,,,,
KB-OFFICE-STD,5,15,Teclado Oficina Estandar,,,,,,
MON-LG-27,1,220,Monitor LG 27 IPS,,,,,,
USB-SAND-64GB,8,12,USB SanDisk 64GB,,,,,,
,30,3,Cable VGA 1.5 Metros,,,,,,
CABLE-LIGHTN,12,15,Cable Lightning Certificado,,,,,,
HDD-SEAG-4TB,1,90,Disco Duro Seagate 4TB,,,,,,
SSD-SAMS-1TB,2,110,SSD Samsung Evo 1TB,,,,,,
RAM-DDR5-16GB,2,85,Memoria RAM 16GB DDR5,,,,,,
LAP-DELL-X15,1,1200,Laptop Dell XPS 15,,,,,,
MOUSE-LOG-G203,4,25.5,Mouse Gamer Logitech G203,,,,,,
KB-MECH-RGB,3,80,Teclado Mecanico RGB,,,,,,
MON-SAM-24,1,180,Monitor Samsung 24 Curvo,,,,,,
USB-KING-32GB,12,8.5,USB Kingston 32GB Metal,,,,,,
CABLE-HDMI-2M,5,5,Cable HDMI 2 Metros 4K,,,,,,
CABLE-USBC-1M,10,7.5,Cable USB-C Carga Rapida,,,,,,
HDD-TOSH-2TB,1,65,Disco Duro Toshiba 2TB,,,,,,
SSD-WD-500GB,6,45,SSD Western Digital 500GB,,,,,,
RAM-DDR4-8GB,4,35,Memoria RAM 8GB DDR4,,,,,,
LAP-HP-PAV,2,950,Laptop HP Pavilion 15,,,,,,
MOUSE-GEN-WL,5,12,Mouse Generico Wireless,,,,,,
KB-OFFICE-STD,10,15,Teclado Oficina Estandar,,,,,,
MON-LG-27,2,,Monitor LG 27 IPS,,,,,,
USB-SAND-64GB,4,12,USB SanDisk 64GB,,,,,,
CABLE-VGA-1M,10,3,Cable VGA 1.5 Metros,,,,,,
CABLE-LIGHTN,5,15,Cable Lightning Certificado,,,,,,
HDD-SEAG-4TB,2,90,Disco Duro Seagate 4TB,,,,,,
SSD-SAMS-1TB,1,110,SSD Samsung Evo 1TB,,,,,,
RAM-DDR5-16GB,4,85,Memoria RAM 16GB DDR5,,,,,,
LAP-LENOVO-TP,1,1400,Laptop Lenovo ThinkPad,,,,,,
MOUSE-VERT-ERG,2,35,Mouse Vertical Ergonomico,,,,,,
KB-LOG-K400,3,40,Teclado Logitech K400 TV,,,,,,
,5,160,Monitor BenQ 24 EyeCare,,,,,,
USB-ADATA-16,20,6,USB Adata 16GB UV,,,,,,
CABLE-DP-1M,8,9,Cable DisplayPort 1.4,,,,,,
HUB-USBC-7IN1,4,45,Hub USB-C 7 en 1,,,,,,
NVME-500GB,5,60,SSD NVMe 500GB Crucial,,,,,,
WEBCAM-1080P,6,30,Webcam 1080p con Microfono,,,,,,
HEADSET-GAMER,3,55,Audifonos Gamer 7.1,,,,,,
LAP-DELL-X15,2,1200,Laptop Dell XPS 15,,,,,,
MOUSE-LOG-G203,2,25.5,Mouse Gamer Logitech G203,,,,,,
KB-MECH-RGB,1,80,Teclado Mecanico RGB,,,,,,
MON-SAM-24,3,180,Monitor Samsung 24 Curvo,,,,,,
USB-KING-32GB,7,8.5,USB Kingston 32GB Metal,,,,,,
CABLE-HDMI-2M,8,5,Cable HDMI 2 Metros 4K,,,,,,
CABLE-USBC-1M,5,7.5,Cable USB-C Carga Rapida,,,,,,
HDD-TOSH-2TB,1,65,Disco Duro Toshiba 2TB,,,,,,
SSD-WD-500GB,3,45,SSD Western Digital 500GB,,,,,,
RAM-DDR4-8GB,2,35,Memoria RAM 8GB DDR4,,,,,,
,1,1400,Laptop Lenovo ThinkPad,,,,,,
MOUSE-VERT-ERG,1,35,Mouse Vertical Ergonomico,,,,,,
KB-LOG-K400,2,40,Teclado Logitech K400 TV,,,,,,
MON-BENQ-24,2,160,Monitor BenQ 24 EyeCare,,,,,,
USB-ADATA-16,10,6,USB Adata 16GB UV,,,,,,
CABLE-DP-1M,4,9,Cable DisplayPort 1.4,,,,,,
HUB-USBC-7IN1,2,45,Hub USB-C 7 en 1,,,,,,
NVME-500GB,2,60,SSD NVMe 500GB Crucial,,,,,,
WEBCAM-1080P,3,30,Webcam 1080p con Microfono,,,,,,
HEADSET-GAMER,1,55,Audifonos Gamer 7.1,,,,,,
LAP-HP-PAV,1,950,Laptop HP Pavilion 15,,,,,,
MOUSE-GEN-WL,8,12,Mouse Generico Wireless,,,,,,
KB-OFFICE-STD,4,15,Teclado Oficina Estandar,,,,,,
MON-LG-27,1,220,Monitor LG 27 IPS,,,,,,
USB-SAND-64GB,3,12,USB SanDisk 64GB,,,,,,
CABLE-VGA-1M,5,3,Cable VGA 1.5 Metros,,,,,,
CABLE-LIGHTN,4,15,Cable Lightning Certificado,,,,,,
HDD-SEAG-4TB,1,90,Disco Duro Seagate 4TB,,,,,,
SSD-SAMS-1TB,3,110,SSD Samsung Evo 1TB,,,,,,
RAM-DDR5-16GB,2,85,Memoria RAM 16GB DDR5,,,,,,
LAP-DELL-X15,1,1200,Laptop Dell XPS 15,,,,,,
MOUSE-LOG-G203,6,25.5,Mouse Gamer Logitech G203,,,,,,
KB-MECH-RGB,2,80,Teclado Mecanico RGB,,,,,,
MON-SAM-24,1,180,Monitor Samsung 24 Curvo,,,,,,
USB-KING-32GB,15,8.5,USB Kingston 32GB Metal,,,,,,
CABLE-HDMI-2M,2,5,Cable HDMI 2 Metros 4K,,,,,,
CABLE-USBC-1M,3,7.5,Cable USB-C Carga Rapida,,,,,,
HDD-TOSH-2TB,5,65,Disco Duro Toshiba 2TB,,,,,,
SSD-WD-500GB,1,45,SSD Western Digital 500GB,,,,,,
RAM-DDR4-8GB,16,35,Memoria RAM 8GB DDR4,,,,,, `;

csvToJson(csvData, 'VENTA12345');
