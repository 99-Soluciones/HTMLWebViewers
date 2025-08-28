/*import { execFileMaker } from '../../../utils/filemaker.js';*/


document.addEventListener('DOMContentLoaded', () => {
  /* --- DOM Elements ---*/
  const btnClose = document.getElementById('btnClose');
  const tableBody = document.getElementById('client-list-body');

  /* --- Data --- */
  const clientData = " & $contactosArray &";
    /* --- Data example tests--- */
  /*const clientData = [
    {
      contactoIDU: 1,
      codigoPais: "52",
      celNumero: "5512345678",
      contactoPuesto: "Developer",
      contactoNombre: "John Doe",
    },
    {
      contactoIDU: 2,
      codigoPais: "52",
      celNumero: "5587654321",
      contactoPuesto: "Designe de ela maafrtatbsdhshgdsdsdgvhjsdghj",
      contactoNombre: "Jane Smith",
    },
  ];*/


  /* --- Functions --- */


  /* {{FILEMAKERFUNCTION_PLACEHOLDER}} */

  /**
   * Renders the list of clients in the table.
   * @param {Array} cliensts - The list of clients to display.
   */
  function displayClients(clients) {
    tableBody.innerHTML = '';
    if (!clients || clients.length === 0) {
      tableBody.innerHTML =
        `<tr><td style='text-align:center;'>No hay clientes para mostrar.</td></tr>`;
      return;
    }

    const fragments = document.createDocumentFragment();

    clients.forEach((client) => {
      const row = document.createElement('tr');
      const cell = document.createElement('td');

      const infoDetails = document.createElement('div');
      infoDetails.className = 'infoDetails';

      const textContainer = document.createElement('div');

      const phoneDiv = document.createElement('div');
      phoneDiv.className = 'phone-country';
      phoneDiv.textContent = `+(${client.codigoPais}) ${client.celNumero} | ${client.contactoPuesto}`;

      const nameDiv = document.createElement('div');
      nameDiv.className = 'client-name';
      nameDiv.textContent = client.contactoNombre;

      textContainer.appendChild(phoneDiv);
      textContainer.appendChild(nameDiv);

      const button = document.createElement('button');
      button.className = 'btn-details';
      button.dataset.id = client.contactoIDU;

      const icon = document.createElement('img');
      icon.src =
        'https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg';
      icon.alt = 'WhatsApp';

      const span = document.createElement('span');
      span.textContent = 'Enviar mensaje';

      button.appendChild(icon);
      button.appendChild(span);

      button.addEventListener('click', function () {
        const fullPhone = `${client.codigoPais}${client.celNumero}`;
        sendMessage(fullPhone, client.contactoNombre, client.contactoPuesto, 1);
      });

      infoDetails.appendChild(textContainer);
      infoDetails.appendChild(button);
      cell.appendChild(infoDetails);
      row.appendChild(cell);
      fragments.appendChild(row);
    });

    tableBody.appendChild(fragments);
  }

  /**
   * Sends a message to a client or closes the window.
   * @param {string} clientPhone - The client's phone number.
   * @param {string} clientName - The client's name.
   * @param {string} clientEmployment - The client's employment.
   * @param {number} isClose - 1 to send a message, 0 to close.
   */
  function sendMessage(
    clientPhone,
    clientName,
    clientEmployment,
    isClose
  ) {
    if (!clientPhone && isClose === 1) return;
    const sanitizedPhone = clientPhone.replace(/\D/g, '');
    const data = {
      /* --- JSON example data --- */
      /* className: 'Cliente',
      classRecordIDoU: '7000',*/
      className: '" & $className &"',
      classRecordIDoU: '" & $classRecordIDoU & "',
      whatsNumber: sanitizedPhone,
      contactoNombre: clientName,
      contactoPuesto: clientEmployment,
      isClose: isClose,
    };
    execFileMaker(data, 'api.WhatsApp ## open.MSG.Opcions[js]|v0.25.2');
  }

  /**
   * Handles the click event on the 'Send Message' buttons.
   * @param {Event} event - The click event.
   */
  function handleSendMessage(event) {
    const button = event.target.closest('.btn-details');
    if (!button) return;

    const { phone, name, employment } = button.dataset;
    sendMessage(phone, name, employment, 1);
  }

  /* --- Initializers --- */
  displayClients(clientData);
  tableBody.addEventListener('click', handleSendMessage);
  btnClose.addEventListener('click', () => sendMessage('', '', '', 0));
});
