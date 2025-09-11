/**
 * Formats additional place details into a comments string.
 * @param {object} details - Google Places API Place Details result
 * @param {string} details.internationalPhoneNumber - International phone number
 * @param {string} details.nationalPhoneNumber - National phone number
 * @param {string} details.website - Website URL   
 * @returns {string} - Formatted comments string with available details or empty string if none are available
 */
function formatComments(details) {
    const infoLines = [
        details.internationalPhoneNumber && `Teléfono internacional: ${details.internationalPhoneNumber}`,
        details.nationalPhoneNumber && `Teléfono nacional: ${details.nationalPhoneNumber}`,
        details.websiteURI && `Sitio web: ${details.websiteURI}`
    ].filter(Boolean); 
    if (infoLines.length === 0) {
        return '';
    }
    return `Datos adicionales del lugar:\r\n    ${infoLines.join('\r\n    ')}`;
}

export { formatComments };