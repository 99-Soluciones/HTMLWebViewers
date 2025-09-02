async function consultaDireccion(req, res) {
    try {

        const { direccion } = req.query;
        const query = encodeURIComponent(direccion);
        if (!direccion || direccion.trim() === '' ) {
            return res.status(400).json({ error: 'El campo nombre es obligatorio' });
        }
        const urlDetalles = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${process.env.API_KEY}`;

        const response = await fetch(urlDetalles);
        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            res.status(404).json({ error: 'No se encontraron resultados para la consulta' });
        }

        res.status(200).json(data.results[0].formatted_address);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al consultar la API de Google' });
    }
}

export default consultaDireccion;   