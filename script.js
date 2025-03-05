// Inicializar el mapa var imgWidth = 2380; var imgHeight = 2160;
// Inicializar el mapa
var map = L.map('map', {
    crs: L.CRS.Simple,
    minZoom: 0,
    maxZoom: 5,
});

// Dimensiones de la imagen del mapa (reemplaza con las tuyas)
var imgWidth = 4984;
var imgHeight = 4352;

// Coordenadas de la imagen del mapa
var southWest = map.unproject([0, imgHeight], map.getMaxZoom());
var northEast = map.unproject([imgWidth, 0], map.getMaxZoom());
var bounds = new L.LatLngBounds(southWest, northEast);

// Añadir la imagen del mapa
var imageOverlay = L.imageOverlay('images/dia.png', bounds).addTo(map);

// Establecer los límites y el zoom inicial
map.setMaxBounds(bounds);
map.fitBounds(bounds);

// Capas para marcadores y regiones
var markerLayer = L.layerGroup().addTo(map);
var regionLayer = L.layerGroup().addTo(map);

// Marcadores y regiones predefinidos
var markers = [
    { name: "Ciudad Principal", latlng: map.unproject([500, 1000], map.getMaxZoom()) },
    { name: "Montaña Alta", latlng: map.unproject([1500, 500], map.getMaxZoom()) },
    // Agrega más marcadores aquí
];

var regions = [
    // Agrega regiones aquí (por ejemplo, polígonos)
];

var popup = L.popup();

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(map);
}

map.on('click', onMapClick);

// Agregar marcadores al mapa y a la lista
markers.forEach(function(markerObj) {
    var marker = L.marker(markerObj.latlng).addTo(markerLayer);
    marker.bindPopup(markerObj.name);
    markerObj.marker = marker;

    var listItem = document.createElement('li');
    listItem.textContent = markerObj.name;
    listItem.addEventListener('click', function() {
        map.flyTo(markerObj.latlng, map.getMaxZoom() - -1);
        marker.openPopup();
    });
    document.getElementById('marker-list-items').appendChild(listItem);
});

// Funcionalidad para cambiar el mapa
document.getElementById('map-select').addEventListener('change', function(e) {
    map.removeLayer(imageOverlay);
    imageOverlay = L.imageOverlay(e.target.value, bounds).addTo(map);
});

// Funcionalidad de búsqueda y centrado
document.getElementById('search-button').addEventListener('click', function() {
    var searchTerm = document.getElementById('search-input').value.toLowerCase();
    var foundMarker = null;

    markers.forEach(function(markerObj) {
        if (markerObj.name.toLowerCase().includes(searchTerm)) {
            markerObj.marker.openPopup();
            foundMarker = markerObj;
        } else {
            markerObj.marker.closePopup();
        }
    });

    if (foundMarker) {
        map.flyTo(foundMarker.latlng, map.getMaxZoom() - -2);
    }
});
