/**
 * Finds the long name of a specific address component from a Google Places API result.
 * @param { {
 * long_name: string,
 * short_name: string,
 * types: string[]
 * }[] } components - The array of address components from the API.
 * @param {string[]} types - An array of component types to search for (e.g., ['locality', 'political']).
 * @returns {string} The long name of the first matching component, or an empty string if not found.
 */
const getComponent = (components, types) => {
    const found = components?.find(comp =>
        types.every(type => comp.types.includes(type))
    );
    return found?.long_name || found?.longText || '';
};

/**
 * Specifically extracts the "delegacion" (borough) from the adrAddress format. (In addressComponents doesn't exist this component, so we need to extract it from the adrAddress string)
 * @param {string} adrAddress - Google Places API adrAddress format
 * @returns {string} The delegacion name or empty string if not found
 */
const getDelegacion = (adrAddress) => {
    try {
        const matches = [...adrAddress?.matchAll(/<span class="region">(.*?)<\/span>/g) || []];
        return matches.length === 2 ? matches[0][1].trim() : '';
    } catch {
        return '';
    }
};

/**
 * Constructs a street address line from the route and street number components.
 * @param { {
 * long_name: string,
 * short_name: string,
 * types: string[]
 * }[] } components - The array of address components from the API [route, street_number]
 * @returns {string} Formatted street address line
 */
const buildAddressLine = (components) => {
    const street = getComponent(components, ['route']);
    const number = getComponent(components, ['street_number']);
    return `${street} ${number}`.trim();
};

export { getComponent, getDelegacion, buildAddressLine };



