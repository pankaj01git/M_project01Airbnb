// Initialize the map
// Replace [51.5, -0.09] with your desired Latitude and Longitude
var map = L.map('map').setView([coordinates[1], coordinates[0]], 13);
// Load the map images (Tiles)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Add a marker
L.marker([coordinates[1], coordinates[0]]).addTo(map)
.bindPopup('We are here!')
.openPopup();