/*import { execFileMaker } from '../../../utils/execFileMaker.js';*/

document.addEventListener('DOMContentLoaded', () => {
    /* --- DOM Elements ---*/
    const toggleContainer = document.getElementById('toggleContainer');
    const toggleSlider = document.getElementById('toggleSlider');
    const optWeb = document.getElementById('optWeb');
    const optApp = document.getElementById('optApp');
    const dropdown = document.getElementById('actionsDropdown');
    const ddToggle = document.getElementById('ddToggle');
    const ddMenu = document.getElementById('ddMenu');
    const ddLabel = document.getElementById('ddLabel');
    const btnClose = document.getElementById('btnClose');
    const btnBlankFM = document.getElementById('btnBlank');

    /* --- Data --- */
    let isApp = '"& $isWebApp & "' === 'APP' ? true : false;
    const data = {
        whatsNumber: ' "& $whatsNumber & "',
        classRecordIDoU: '"& $classRecordIDoU &"',
        contactoNombre: '" & $contactoNombre & "',
        className: '" & $className &"'
    };
    const options = "& $options &";

    /* --- Data Example Test --- */
    
    /*
    let isApp = 'APP' === 'APP' ? true : false;
    const data = {
        whatsNumber: '5677889900',
        classRecordIDoU: 'Cliente',
        contactoNombre: 'contactoNombre',
        className: 'Cliente'
    }
    const options = [
        { option: 'Texto', key: 'text', action: 'text' },
        { option: 'Imagen', key: 'image', action: 'image' },
        { option: 'Video', key: 'video', action: 'video' },
        ];
    */

    /* --- Functions --- */
    /*--- execFileMaker.js ---*/

    /**
     * Renders the list of type of message to generate
     */
    function createOptions() {
        options.forEach((options) => {
            const listItem = document.createElement('li');
            listItem.textContent = options.option;
            listItem.setAttribute('data-value', options.key);
            ddMenu.appendChild(listItem);
        });
    }

    /**
     * Set value in Toggle whatsApp (Open in web or app)
     */
    function updateToggle() {
        toggleSlider.style.left = isApp ? '50%' : '0';
        optApp.classList.toggle('active', isApp);
        optWeb.classList.toggle('active', !isApp);
    }

    /**
     * Get Message type, key and data to execute to next FileMaker Script
     * @param {string} callType - Type message 
     * @param {string} msgType - Key value
     */
    function sendTypeMessagge(callType, msgType = '') {
        const payload = {
            ...data,
            isWebApp: isApp ? 'APP' : 'WEB',
            callType: callType,
            msgType: msgType,
        };
        setTimeout(() => execFileMaker(payload, 'api.WhatsApp ## msg.selectTypeAndPrep[js]|v0.25.2'), 500);
    }

    /* --- Exec functions --- */

    createOptions();

    btnClose.addEventListener('click', () => sendTypeMessagge('closeDiv'));
    btnBlankFM.addEventListener('click', () =>
        sendTypeMessagge('openWhatsApp', '')
    );

    optWeb.addEventListener('mouseenter', () => toggleContainer.classList.add('peek-left'));
    optApp.addEventListener('mouseenter', () => toggleContainer.classList.add('peek-right'));
    toggleContainer.addEventListener('mouseleave', () => {
        toggleContainer.classList.remove('peek-left', 'peek-right');
    });

    optWeb.addEventListener('click', () => { isApp = false; updateToggle(); });
    optApp.addEventListener('click', () => { isApp = true; updateToggle(); });

    /* --- Get Value and Key from cb --- */
    ddMenu.querySelectorAll('li').forEach((li) => {
        li.addEventListener('click', (e) => {
            e.stopPropagation();
            ddMenu
                .querySelectorAll('li')
                .forEach((n) => n.classList.remove('selected'));
            li.classList.add('selected');
            const value = li.getAttribute('data-value');
            ddLabel.textContent = li.textContent.trim();
            dropdown.classList.remove('open');
            ddToggle.setAttribute('aria-expanded', 'false');

            const selectedOption = options.find(option => option.key === value);

            if (selectedOption && selectedOption.action) {
                sendTypeMessagge('selectMsgType', selectedOption.action);
            }
        });
    });

    updateToggle();
});