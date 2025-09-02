
let coordinates = " & $placeCoordenadas & ";
let datos = {
        placeDisplayName: '" & $placeDisplayName &"' || '',
        direccion1: '" & $direccion1 &"'  || '',
        colonia: '" & $colonia &"'  || '',
        delegacion: '" & $delegacion &"'  || '',
        cp: '" & $cp &"'  || '',
        ciudad: '" & $ciudad &"'  || '',
        estado: '" & $estado &"'  || '',
        pais: '" & $pais &"' || '',
};

/**
 * Formats a line of information for display in the info window.
 * @param {string} text - Text with information to display
 * @param {number} fontSize - Font size in px (default 14px)
 * @param {string} fontWeight - Font weight (normal, bold, lighter, semibold) (default normal)
 * @returns {string} - HTML string for the info line
 */
const createInfoLine = (text, fontSize, fontWeight) => {
    if (!text) return '';
    return (
        `<div style="display: flex; align-items: start; margin-bottom: 1px; font-size: ${fontSize || '14px'}; font-weight: ${fontWeight || 'normal'};">
            <span style="line-height: 1.4;">${text}</span>
        </div>`
    );
};

async function loadGoogleMaps() {
    const { Map, Places } = await Promise.all([
        google.maps.importLibrary('maps'),
        google.maps.importLibrary('places')
    ]);
    return { Map, Places };
}

async function init() {
    await loadGoogleMaps();
    await customElements.whenDefined('gmp-map');
    const map = document.querySelector('gmp-map');
    const marker = document.querySelector('gmp-advanced-marker');
    const infowindow = new google.maps.InfoWindow();
    if(coordinates && coordinates.lat && coordinates.lng){
    marker.position = coordinates;
    map.center = coordinates;
    map.zoom = 17; 

    let content = `
                    <div style="font-size: 14px; max-width: 320px; min-width: 250px;">
                        <div style="font-size: 17px; font-weight: bold; margin-bottom: 6px;">${formatTitleWithWrap(datos.placeDisplayName, 12)}</div>
                        <hr style="margin: 6px 0; border: 0; border-top: 1px solid #777777ff;">
                        ${createInfoLine(datos.direccion1, '13px', 'bold')}
                        ${createInfoLine([datos.colonia, datos.delegacion].filter(Boolean).join(', '), '12px')}
                        ${createInfoLine([datos.ciudad, datos.estado, datos.cp].filter(Boolean).join(', '), '12px', 'semibold')}
                        ${createInfoLine(datos.pais, '12px', 'lighter')}
                    </div>
                    <style>
                       .gm-ui-hover-effect {
                        position: absolute !important;
                        width: 30px !important; height: 31px !important; top: 6px !important; right: 20px !important;
                         }
                     </style>
                `;

        infowindow.setContent(content);
        infowindow.open(map.innerMap, marker);
    }
}
document.addEventListener('DOMContentLoaded', init);
