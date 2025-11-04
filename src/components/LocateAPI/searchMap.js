/** */
import { execFileMaker } from "../../../utils/js/execFileMaker.js";
import { formatComments } from "../../../utils/js/formatComments.js";
import {
  getComponent,
  getDelegacion,
  buildAddressLine,
} from "../../../utils/js/formatAddress.js";
import { formatTitleWithWrap } from "../../../utils/js/formatTittle.js";
/**/

/* --- Data --- */

// let coordinates = " & $placeCoordenadas & ";

// let datos = {
//         placeDisplayName: '" & $placeDisplayName &"' || '',
//         direccion1: '" & $direccion1 &"'  || '',
//         colonia: '" & $colonia &"'  || '',
//         delegacion: '" & $delegacion &"'  || '',
//         cp: '" & $cp &"'  || '',
//         ciudad: '" & $ciudad &"'  || '',
//         estado: '" & $estado &"'  || '',
//         pais: '" & $pais &"' || '',
// };

/* --- Data example tests--- */

let coordinates = { lat: 19.4326, lng: -99.1332 }; // Default to Mexico City if not provided
let datos = {
  placeDisplayName: "Nombre del lugar" || "",
  direccion1: "Nombre de la calle 123",
  colonia: "Colonia Centro",
  delegacion: "Cuauhtémoc",
  cp: "06000",
  ciudad: "Ciudad de México",
  estado: "CDMX",
  pais: "México",
};

/*--- Functions ---  */

/*--- execFileMaker.js---*/

/*--- addressUtils.js---*/

/* --- formatComments.js---*/

/* --- formatTittle.js---*/

/**
 * Formats a line of information for display in the info window.
 * @param {string} text - Text with information to display
 * @param {number} fontSize - Font size in px (default 14px)
 * @param {string} fontWeight - Font weight (normal, bold, lighter, semibold) (default normal)
 * @returns {string} - HTML string for the info line
 */
const createInfoLine = (text, fontSize, fontWeight) => {
  if (!text) return "";
  return `<div style='display: flex; align-items: start; margin-bottom: 1px; font-size: ${
    fontSize || "14px"
  }; font-weight: ${fontWeight || "normal"};'>
            <span style='line-height: 1.4;'>${text}</span>
        </div>`;
};

/**
 * Loads the Google Maps and Places libraries. (in this version only places are used, but maps will be used in future versions to draw routes and update API)
 * @returns {Promise<{Map: typeof google.maps.Map, Place: typeof google.maps.places.Place}>}
 */
async function loadGoogleMaps() {
  const [{ Map }, { Place }] = await Promise.all([
    google.maps.importLibrary("maps"),
    google.maps.importLibrary("places"),
  ]);

  return { Map, Place };
}

/**
 * Initializes the map, marker, and place picker, and sets up event listeners.
 * @returns {Promise<void>}
 */
async function init() {
  try {
    const { Place } = await loadGoogleMaps();

    await customElements.whenDefined("gmp-map");
    const map = document.querySelector("gmp-map");
    const marker = document.querySelector("gmp-advanced-marker");
    const placePicker = document.querySelector("gmpx-place-picker");
    const infowindow = new google.maps.InfoWindow();

    if (
      (coordinates && coordinates.lat && coordinates.lng) ||
      (datos.placeDisplayName && datos.placeDisplayName !== "")
    ) {
      coordinates =
        coordinates && coordinates.lat && coordinates.lng
          ? coordinates
          : { lat: 19.4326, lng: -99.1332 }; // Default to Mexico City if not provided
      marker.position = coordinates;
      map.center = coordinates;
      map.zoom = 17;

      let content = `
                    <div style='font-size: 14px; max-width: 320px; min-width: 250px;'>
                        <div style='font-size: 17px; font-weight: bold; margin-bottom: 6px;'>${formatTitleWithWrap(
                          datos.placeDisplayName,
                          12
                        )}</div>
                        <hr style='margin: 6px 0; border: 0; border-top: 1px solid #777777ff;'>
                        ${createInfoLine(datos.direccion1, "13px", "bold")}
                        ${createInfoLine(
                          [datos.colonia, datos.delegacion]
                            .filter(Boolean)
                            .join(", "),
                          "12px"
                        )}
                        ${createInfoLine(
                          [datos.ciudad, datos.estado, datos.cp]
                            .filter(Boolean)
                            .join(", "),
                          "12px",
                          "semibold"
                        )}
                        ${createInfoLine(datos.pais, "12px", "lighter")}
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

    placePicker.addEventListener("gmpx-placechange", async () => {
      try {
        const place = placePicker.value;
        if (!place) return;

        if (place.viewport) {
          map.innerMap.fitBounds(place.viewport);
        } else {
          map.center = place.location;
          map.zoom = 17;
        }

        marker.position = place.location;

        const placeData = new Place({ id: place.id });

        await placeData.fetchFields({
          fields: [
            "addressComponents",
            "adrFormatAddress",
            "formattedAddress",
            "internationalPhoneNumber",
            "nationalPhoneNumber",
            "websiteURI",
          ],
        });

        const details = {
          internationalPhoneNumber: placeData.internationalPhoneNumber || "",
          nationalPhoneNumber: placeData.nationalPhoneNumber || "",
          websiteURI: placeData.websiteURI || "",
        };

        datos = {
          id: place.id,
          placeDisplayName: place.displayName || "",
          direccion1: buildAddressLine(placeData.addressComponents),
          colonia:
            getComponent(placeData.addressComponents, [
              "neighborhood",
              "political",
            ]) ||
            getComponent(placeData.addressComponents, [
              "sublocality",
              "political",
            ]),
          delegacion: getDelegacion(placeData.adrFormatAddress),
          cp: getComponent(placeData.addressComponents, ["postal_code"]),
          ciudad: getComponent(placeData.addressComponents, [
            "locality",
            "political",
          ]),
          estado: getComponent(placeData.addressComponents, [
            "administrative_area_level_1",
            "political",
          ]),
          pais: getComponent(placeData.addressComponents, [
            "country",
            "political",
          ]),
          coordenadas: place.location,
          direccionCompleta: placeData.formattedAddress,
          comments: formatComments(details),
          // userIDU: " & $userIDU & ",
          // tenentIDU: " & $tenentIDU & ",
        };

        /* Test in local browser, in FileMaker this part is not necessary */
        infowindow.close();

        const content = `
                    <div style='font-size: 14px; max-width: 320px; min-width: 250px;'>
                        <div style='font-size: 17px; font-weight: bold; margin-bottom: 6px;'>${formatTitleWithWrap(
                          datos.placeDisplayName,
                          15
                        )}</div>
                        <hr style='margin: 6px 0; border: 0; border-top: 1px solid #777777ff;'>
                        ${createInfoLine(datos.direccion1, "13px", "bold")}
                        ${createInfoLine(
                          [datos.colonia, datos.delegacion]
                            .filter(Boolean)
                            .join(", "),
                          "12px"
                        )}
                        ${createInfoLine(
                          [datos.ciudad, datos.estado, datos.cp]
                            .filter(Boolean)
                            .join(", "),
                          "12px",
                          "semibold"
                        )}
                        ${createInfoLine(datos.pais, "12px", "lighter")}
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
        /* */

        /*--- execFileMaker.js ---*/

        execFileMaker(datos, "{api.googleMaps} = drawMap[js]|v0.25.2");
      } catch (error) {
        console.error("Error en placechange:", error);
      }
    });
  } catch (error) {
    console.error("Error en inicialización:", error);
  }
}

document.addEventListener("DOMContentLoaded", init);
