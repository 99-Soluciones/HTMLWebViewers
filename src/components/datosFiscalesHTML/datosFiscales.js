/* import  { execFileMaker } from '../../../utils/js/execFileMaker.js'; */

/* --- Data ---*/
const clientInfo = " & $json &";

/* --- Data Example ---*/
/** *
const clientInfo = [
  {
    nombreCliente: 'Juan Pérez De La Rosa Nombre Largo Haber',
    clienteID: 'C001',
    rfc: 'PEPJ850101H00',
    razonSocial: 'Juan Pérez SA de CV',
    cp: '06700',
    idRegFiscal: '601',
  },
  {
    nombreCliente: 'Ana García',
    clienteID: 'C002',
    rfc: 'GAAA900202H01',
    razonSocial: 'Servicios Integrales Ana García De La Rosa Maria Guadalupe',
    cp: '55120',
    idRegFiscal: '601',
  },
  {
    nombreCliente: 'Carlos Sánchez',
    clienteID: 'C003',
    rfc: 'SACJ780303H02',
    razonSocial: 'Comercializadora Sánchez',
    cp: '11520',
    idRegFiscal: '601',
  },
  {
    nombreCliente: 'Laura Martínez',
    clienteID: 'C004',
    rfc: 'MALJ880404H03',
    razonSocial: 'Laura Martínez y Asociados',
    cp: '44100',
    idRegFiscal: '601',
  },
];
** */
/* --- Functions ---*/

    /*--- execFileMaker.js ---*/

function deployClients() {
    const container = document.getElementById('client-list-container');
    if (clientInfo.length === 0) {
        container.innerHTML = `<li>
         <span class='noResults'>No hay resultados disponibles.</span>                      
         </li>`;
        return;
    }
    clientInfo.forEach((cliente) => {
        const listItem = document.createElement('li');
        listItem.className = 'client-card';

    
        const nombreClienteClass = cliente.nombreCliente.length > 30 ? 'small-text' : '';
        const razonSocialClass = cliente.razonSocial.length > 30 ? 'small-text' : '';

        listItem.innerHTML = `
            <div class='client-action'>
                <button class='select-button' data-id='${cliente.clienteID}' aria-label='Seleccionar datos'></button>
            </div>
            <div class='client-info'>
                <span class='client-name ${nombreClienteClass}'>${cliente.nombreCliente}</span>
                <span class='client-details ${razonSocialClass}'><strong>Razón Social:</strong> ${cliente.razonSocial}</span>
                <span class='client-details'>
                    <strong>RFC:</strong> ${cliente.rfc} | 
                    <strong>CP:</strong> ${cliente.cp}
                </span>
            </div>
        `;
        container.appendChild(listItem);
    });
}

/* --- Event Listeners ---*/
document.getElementById('client-list-container').addEventListener('click', function (event) {
    if (event.target && event.target.matches('button.select-button')) {
        const clienteIDSeleccionado = event.target.getAttribute('data-id');

        const clienteSeleccionado = clientInfo.find(
            (cliente) => cliente.clienteID === clienteIDSeleccionado
        );

       execFileMaker(clienteSeleccionado, 'cliente ## fiscalEdit.SetCLFromHTML[js]|v0.25.2');

        console.log('Cliente seleccionado:', clienteSeleccionado);
    }
});

document.addEventListener('DOMContentLoaded', deployClients);
