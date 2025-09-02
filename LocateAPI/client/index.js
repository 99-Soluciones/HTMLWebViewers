let map;
let centerCoordinates = { lat: 37.4161493, lng: -122.0812166 };
async function initMap() {
    const { Map } = await google.maps.importLibrary("maps");
    map = new Map(document.getElementById('map'), {
        center: centerCoordinates,
        zoom: 14,
        // ...
    });
    getPlaceDetails();
}
async function getPlaceDetails() {
    const { Place } = await google.maps.importLibrary("places");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
    // Use place ID to create a new Place instance.
    const place = new Place({
        id: 'ChIJN5Nz71W3j4ARhx5bwpTQEGg',
    });
    // Call fetchFields, passing the desired data fields.
    await place.toJSON();
    // Log the result
    console.log(place);
    console.log(place);
    // Add an Advanced Marker
    const marker = new AdvancedMarkerElement({
        map,
        position: place.location,
        title: place.displayName,
    });
}
initMap();