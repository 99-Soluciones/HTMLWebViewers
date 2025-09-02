async function consultaDireccion(req, res) {
    try {

        const { nombre } = req.query;
        const query = encodeURIComponent(nombre);
        if (!nombre) {
            return res.status(400).json({ error: 'El campo nombre es obligatorio' });
        }
        const urlDetalles = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${query}&inputtype=textquery&key=${process.env.API_KEY}`;

        const response = await fetch(urlDetalles);
        const dataID = await response.json();

        if (!dataID.candidates || dataID.candidates.length === 0) {
            res.status(404).json({ error: 'No se encontraron resultados para la consulta' });
        }

        const { place_id } = dataID.candidates[0];
        const url = `https://maps.googleapis.com/maps/api/place/details/json?&place_id=${place_id}&key=${process.env.API_KEY}`

        const responseDetails = await fetch(url);
        const detailsData = await responseDetails.json();

        res.status(200).json(detailsData.result);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al consultar la API de Google' });
    }
}

export default consultaDireccion;   