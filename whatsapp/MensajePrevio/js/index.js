/*
import { execFileMaker } from '../../../utils/filemaker.js';
*/
document.addEventListener('DOMContentLoaded', () => {

    /* --- DOM Elements ---*/
    const textEditor = document.getElementById('textEditor');
    const copyButton = document.getElementById('copyButton');
    const btnClose = document.getElementById('btnClose');
    const copyFeedback = document.getElementById('copyFeedback');

    /* --- Data ---*/
    textEditor.value = `" & $msg & "`;
    let data = {};
    /* --- Data Example Test ---*/
    /*
    textEditor.value = `hello, this is a sample text`;
    */

    /* --- Functions ---*/

    /* {{FILEMAKERFUNCTION_PLACEHOLDER}} */

    /**
     * Createe JSON to decide how to prooced (close WebViewer or open WhatsApp Chat)
     * @param {string} callType - Type action 
     */
    function createJSONData(callType) {
        /* --- Data Example Test ---*/
        /*
        data = {
            whatsNumber: '5656998800',
            classRecordIDoU: '9000',
            isWebApp: 'APP',
            callType: callType,
            className: 'Cliente'
        };
        */
        data = {
            whatsNumber: ' " & $whatsNumber &"',
            classRecordIDoU: '"& $classRecordIDoU &"',
            isWebApp: ' " & $isWebApp &"',
            callType: callType,
            className: '" & $className &"'
        };
        if (callType === 'closeDiv') execFileMaker(data, 'api.WhatsApp ## msg.selectTypeAndPrep[js]|v0.25.2');
        else setTimeout(() => { execFileMaker(data, 'api.WhatsApp ## msg.selectTypeAndPrep[js]|v0.25.2') }, 1500);
    }

    btnClose.addEventListener('click', () => {
        createJSONData('closeDiv');
    });

    copyButton.addEventListener('click', () => {
        navigator.clipboard
            .writeText(textEditor.value)
            .then(() => {
                copyFeedback.textContent = '¡Copiado!';
                copyFeedback.style.opacity = 1;
                setTimeout(() => {
                    copyFeedback.style.opacity = 0;
                }, 2000);
            })
            .catch((err) => {
                console.error('Error al copiar: ', err);
                copyFeedback.textContent = 'Error';
                copyFeedback.style.color = 'red';
                copyFeedback.style.opacity = 1;
            });

        createJSONData('OpenWhatsApp');

    });

});