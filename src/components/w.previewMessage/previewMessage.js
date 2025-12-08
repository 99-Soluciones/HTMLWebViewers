
// import { execFileMaker } from '../../../utils/execFileMaker.js';

document.addEventListener('DOMContentLoaded', () => {

    /* --- DOM Elements ---*/
    const textEditor = document.getElementById('textEditor');
    const sendButton = document.getElementById('sendButton');
    const aiButton = document.getElementById('aiButton');
    const btnClose = document.getElementById('btnClose');
    const loadingMessage = document.getElementById('loadingMessage');

    /* --- Data ---*/
    textEditor.value = `" & $msg & "`;
    let data = {};
    /* --- Data Example Test ---*/
    /** 
    textEditor.value = `hello, this is a sample text`;
    */

    /* --- Functions ---*/

    /*--- execFileMaker.js ---*/
    
    /**
     * Createe JSON to decide how to prooced (close WebViewer or open WhatsApp Chat)
     * @param {string} callType - Type action 
     */
    function createJSONData(callType, message) {
        /* --- Data Example Test ---*/
        /*
        data = {
            whatsNumber: '5656998800',
            contactoNombre: 'Contacto Nombre',
            contactoIDU: '3BHJ4HJK4HJK43HJ4KJHJKH34',
            classRecordIDoU: '9000',
            isWebApp: 'APP',
            callType: callType,
            className: 'Cliente'
        };
        */
        data = {
            contactoNombre: ' " & $contactoNombre &"',
            contactoIDU: ' " & $clienteIDU & "',
            whatsNumber: ' " & $whatsNumber &"',
            classRecordIDoU: '"& $classRecordIDoU &"',
            isWebApp: ' " & $isWebApp &"',
            callType: callType,
            className: '" & $className &"',
            message: message
        };
         if (callType === 'ImproveWithAI') execFileMaker(data, 'api.WhatsApp ## msg.IACallAPI[js]|v0.25.3');
        else execFileMaker(data, 'api.WhatsApp ## msg.selectTypeAndPrep[js]|v0.25.2');
    }

    btnClose.addEventListener('click', () => {
        createJSONData('closeDiv');
    });

    /* Send Button: Execute FileMaker script to open WhatsApp */
    sendButton.addEventListener('click', () => {
        createJSONData('OpenWhatsApp', textEditor.value);
    });

    /* AI Improve Button: Execute FileMaker script to improve message */
    aiButton.addEventListener('click', () => {
        // Mostrar mensaje de carga
        loadingMessage.style.display = 'flex';
        aiButton.disabled = true;
        aiButton.style.opacity = '0.6';

        sendButton.disabled = true;
        sendButton.style.opacity = '0.6';
        
        createJSONData('ImproveWithAI', textEditor.value);
        
        // Ocultar mensaje de carga (descomentar si se necesita ocultar después de respuesta)
        // loadingMessage.style.display = 'none';
        // aiButton.disabled = false;
        // aiButton.style.opacity = '1';
    });

});