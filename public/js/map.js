

// console.log(mapToken);
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
container: 'map', // container ID
center: listing.geometry.coordinates, // starting position [lng, lat]
zoom: 12 // starting zoom
});

const marker1 = new mapboxgl.Marker({color:'red'})
.setLngLat(listing.geometry.coordinates)
.setPopup( new mapboxgl.Popup({ offset: 25 })
.setHTML(`<h4>${listing.title}</h4><p>exact location will be provided after booking</p>`))
.addTo(map);
console.log(listing.geometry.coordinates);