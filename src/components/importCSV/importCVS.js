function csvToJson(csv) {
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
        FileMaker.PerformScript('ventaITM -- generarITMsDesdeCSV[js]|v0.25.3', 'Error al tratar de procesar la informacion');
        return;
    }

    /* --- Procesamiento de encabezados --- */
    let headers = lines[0].split(',');

    let dataMap = {};

    /* --- Inicialización de índices para columnas clave --- */
    let uniqueIndex = -1;
    let sumIndex = -1;
    let helperIndex = -1;

    /* --- Bucle donde obtenemos los índices de las columnas clave --- */
    for (let h = 0; h < headers.length; h++) {
        let headerClean = headers[h].trim();
        if (headerClean === colUnique) uniqueIndex = h;
        if (headerClean === colHelper) helperIndex = h;
        if (headerClean === colToSum) sumIndex = h;
    }

    /* --- Procesamiento de filas de datos --- */
    for (let i = 1; i < lines.length; i++) {
        /* --- Saltamos líneas vacías --- */
        if (!lines[i]) continue;
        /* --- Procesamos la línea actual --- */
        let currentline = lines[i].split(',');

        let obj = {};

        /**
         * Construcción del objeto para la fila actual
         * Usamos los encabezados como claves y los valores de la fila como valores
         */
        for (let j = 0; j < headers.length; j++) {
            let key = headers[j].trim();
            let val = currentline[j] ? currentline[j].trim().replace(/^"|"$/g, '') : '';
            obj[key] = val;
        }

        /* --- Lógica de agrupación y suma --- */
        if (uniqueIndex > -1) {
            /* --- Obtenemos los valores clave para esta fila --- */
            let keyVal = currentline[uniqueIndex].trim(); 

            let rawPrice = parseFloat(currentline[helperIndex]) || 0;
            let priceVal = rawPrice.toFixed(2);

            let uniqueKey = keyVal + "_" + priceVal;

           /**
            * Verificamos si ya existe un ítem con la misma clave única y auxiliar
            * La condicion valida si existe el SKU y si el precio es el mismo
            */  
            if (dataMap[uniqueKey]) {
                if (sumIndex > -1) {
                    /* Convertimos los valores a números y sumamos */
                    let oldQty = parseFloat(dataMap[uniqueKey][colToSum]) || 0;
                    let newQty = parseFloat(obj[colToSum]) || 0;

                    /* Actualizamos la cantidad sumada en el mapa */
                    dataMap[uniqueKey][colToSum] = (oldQty + newQty).toString();
                }
            } else {
               /* --- Si no existe, agregamos el nuevo ítem al mapa --- */
                dataMap[uniqueKey] = obj;
            }
        } else {
            /* --- Si no hay columna única definida, agregamos cada fila con un índice único --- */
            dataMap['row_' + i] = obj;
        }

    }
    let result = Object.values(dataMap);

    // FileMaker.PerformScript('ventaITM -- generarITMsDesdeCSV[js]|v0.25.3', JSON.stringify(result));
    console.log(JSON.stringify(result, null, 2));
}

/* --- Datos CSV de ejemplo --- */

let csvData = `SKU,Cantidad,Precio Unitario,Descripcion
LAP-DELL-X15,1,1200.00,Laptop Dell XPS 15
MOUSE-LOG-G203,5,25.50,Mouse Gamer Logitech G203
KB-MECH-RGB,2,80.00,Teclado Mecanico RGB
MON-SAM-24,1,180.00,Monitor Samsung 24 Curvo
USB-KING-32GB,10,8.50,USB Kingston 32GB Metal
CABLE-HDMI-2M,20,5.00,Cable HDMI 2 Metros 4K
CABLE-USBC-1M,15,7.50,Cable USB-C Carga Rapida
HDD-TOSH-2TB,3,65.00,Disco Duro Toshiba 2TB
SSD-WD-500GB,4,45.00,SSD Western Digital 500GB
RAM-DDR4-8GB,8,35.00,Memoria RAM 8GB DDR4
LAP-DELL-X15,1,1200.00,Laptop Dell XPS 15
MOUSE-LOG-G203,3,25.50,Mouse Gamer Logitech G203
KB-MECH-RGB,1,80.00,Teclado Mecanico RGB
MON-SAM-24,2,180.00,Monitor Samsung 24 Curvo
USB-KING-32GB,5,8.50,USB Kingston 32GB Metal
CABLE-HDMI-2M,10,5.00,Cable HDMI 2 Metros 4K
CABLE-USBC-1M,8,7.50,Cable USB-C Carga Rapida
HDD-TOSH-2TB,2,65.00,Disco Duro Toshiba 2TB
SSD-WD-500GB,2,45.00,SSD Western Digital 500GB
RAM-DDR4-8GB,4,35.00,Memoria RAM 8GB DDR4
LAP-HP-PAV,1,950.00,Laptop HP Pavilion 15
MOUSE-GEN-WL,10,12.00,Mouse Generico Wireless
KB-OFFICE-STD,5,15.00,Teclado Oficina Estandar
MON-LG-27,1,220.00,Monitor LG 27 IPS
USB-SAND-64GB,8,12.00,USB SanDisk 64GB
CABLE-VGA-1M,30,3.00,Cable VGA 1.5 Metros
CABLE-LIGHTN,12,15.00,Cable Lightning Certificado
HDD-SEAG-4TB,1,90.00,Disco Duro Seagate 4TB
SSD-SAMS-1TB,2,110.00,SSD Samsung Evo 1TB
RAM-DDR5-16GB,2,85.00,Memoria RAM 16GB DDR5
LAP-DELL-X15,1,1200.00,Laptop Dell XPS 15
MOUSE-LOG-G203,4,25.50,Mouse Gamer Logitech G203
KB-MECH-RGB,3,80.00,Teclado Mecanico RGB
MON-SAM-24,1,180.00,Monitor Samsung 24 Curvo
USB-KING-32GB,12,8.50,USB Kingston 32GB Metal
CABLE-HDMI-2M,5,5.00,Cable HDMI 2 Metros 4K
CABLE-USBC-1M,10,7.50,Cable USB-C Carga Rapida
HDD-TOSH-2TB,1,65.00,Disco Duro Toshiba 2TB
SSD-WD-500GB,6,45.00,SSD Western Digital 500GB
RAM-DDR4-8GB,4,35.00,Memoria RAM 8GB DDR4
LAP-HP-PAV,2,950.00,Laptop HP Pavilion 15
MOUSE-GEN-WL,5,12.00,Mouse Generico Wireless
KB-OFFICE-STD,10,15.00,Teclado Oficina Estandar
MON-LG-27,2,220.00,Monitor LG 27 IPS
USB-SAND-64GB,4,12.00,USB SanDisk 64GB
CABLE-VGA-1M,10,3.00,Cable VGA 1.5 Metros
CABLE-LIGHTN,5,15.00,Cable Lightning Certificado
HDD-SEAG-4TB,2,90.00,Disco Duro Seagate 4TB
SSD-SAMS-1TB,1,110.00,SSD Samsung Evo 1TB
RAM-DDR5-16GB,4,85.00,Memoria RAM 16GB DDR5
LAP-LENOVO-TP,1,1400.00,Laptop Lenovo ThinkPad
MOUSE-VERT-ERG,2,35.00,Mouse Vertical Ergonomico
KB-LOG-K400,3,40.00,Teclado Logitech K400 TV
MON-BENQ-24,5,160.00,Monitor BenQ 24 EyeCare
USB-ADATA-16,20,6.00,USB Adata 16GB UV
CABLE-DP-1M,8,9.00,Cable DisplayPort 1.4
HUB-USBC-7IN1,4,45.00,Hub USB-C 7 en 1
NVME-500GB,5,60.00,SSD NVMe 500GB Crucial
WEBCAM-1080P,6,30.00,Webcam 1080p con Microfono
HEADSET-GAMER,3,55.00,Audifonos Gamer 7.1
LAP-DELL-X15,2,1200.00,Laptop Dell XPS 15
MOUSE-LOG-G203,2,25.50,Mouse Gamer Logitech G203
KB-MECH-RGB,1,80.00,Teclado Mecanico RGB
MON-SAM-24,3,180.00,Monitor Samsung 24 Curvo
USB-KING-32GB,7,8.50,USB Kingston 32GB Metal
CABLE-HDMI-2M,8,5.00,Cable HDMI 2 Metros 4K
CABLE-USBC-1M,5,7.50,Cable USB-C Carga Rapida
HDD-TOSH-2TB,1,65.00,Disco Duro Toshiba 2TB
SSD-WD-500GB,3,45.00,SSD Western Digital 500GB
RAM-DDR4-8GB,2,35.00,Memoria RAM 8GB DDR4
LAP-LENOVO-TP,1,1400.00,Laptop Lenovo ThinkPad
MOUSE-VERT-ERG,1,35.00,Mouse Vertical Ergonomico
KB-LOG-K400,2,40.00,Teclado Logitech K400 TV
MON-BENQ-24,2,160.00,Monitor BenQ 24 EyeCare
USB-ADATA-16,10,6.00,USB Adata 16GB UV
CABLE-DP-1M,4,9.00,Cable DisplayPort 1.4
HUB-USBC-7IN1,2,45.00,Hub USB-C 7 en 1
NVME-500GB,2,60.00,SSD NVMe 500GB Crucial
WEBCAM-1080P,3,30.00,Webcam 1080p con Microfono
HEADSET-GAMER,1,55.00,Audifonos Gamer 7.1
LAP-HP-PAV,1,950.00,Laptop HP Pavilion 15
MOUSE-GEN-WL,8,12.00,Mouse Generico Wireless
KB-OFFICE-STD,4,15.00,Teclado Oficina Estandar
MON-LG-27,1,220.00,Monitor LG 27 IPS
USB-SAND-64GB,3,12.00,USB SanDisk 64GB
CABLE-VGA-1M,5,3.00,Cable VGA 1.5 Metros
CABLE-LIGHTN,4,15.00,Cable Lightning Certificado
HDD-SEAG-4TB,1,90.00,Disco Duro Seagate 4TB
SSD-SAMS-1TB,3,110.00,SSD Samsung Evo 1TB
RAM-DDR5-16GB,2,85.00,Memoria RAM 16GB DDR5
LAP-DELL-X15,1,1200.00,Laptop Dell XPS 15
MOUSE-LOG-G203,6,25.50,Mouse Gamer Logitech G203
KB-MECH-RGB,2,80.00,Teclado Mecanico RGB
MON-SAM-24,1,180.00,Monitor Samsung 24 Curvo
USB-KING-32GB,15,8.50,USB Kingston 32GB Metal
CABLE-HDMI-2M,2,5.00,Cable HDMI 2 Metros 4K
CABLE-USBC-1M,3,7.50,Cable USB-C Carga Rapida
HDD-TOSH-2TB,5,65.00,Disco Duro Toshiba 2TB
SSD-WD-500GB,1,45.00,SSD Western Digital 500GB
RAM-DDR4-8GB,16,35.00,Memoria RAM 8GB DDR4`;

csvToJson(csvData);