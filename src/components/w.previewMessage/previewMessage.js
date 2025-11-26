
// import { execFileMaker } from '../../../utils/execFileMaker.js';

import { execFileMaker } from "../../../utils/js/execFileMaker";

document.addEventListener('DOMContentLoaded', () => {

    /* --- DOM Elements ---*/
    const textEditor = document.getElementById('textEditor');
    const sendButton = document.getElementById('sendButton');
    const aiButton = document.getElementById('aiButton');
    const btnClose = document.getElementById('btnClose');

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
            contactoIDU: ' " & $contactoIDU & "',
            whatsNumber: ' " & $whatsNumber &"',
            classRecordIDoU: '"& $classRecordIDoU &"',
            isWebApp: ' " & $isWebApp &"',
            callType: callType,
            className: '" & $className &"',
            message: message
        };
        if (callType === 'ImproveWithAI') execFileMaker(data, 'api.WhatsApp ## msg.IACallAPI[js]|v0.25.3');
        else  execFileMaker(data, 'api.WhatsApp ## msg.selectTypeAndPrep[js]|v0.25.2');
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
        createJSONData('ImproveWithAI', textEditor.value);
    });

});