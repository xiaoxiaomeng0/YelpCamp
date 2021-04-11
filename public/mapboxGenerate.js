mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/streets-v11", // style URL
  center: campground.geometry.coordinates, // starting position [lng, lat]
  zoom: 9, // starting zoom
});

const marker = new mapboxgl.Marker()
  .setLngLat(campground.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 })
      .setLngLat(campground.geometry.coordinates)
      .setHTML(`<h5>${campground.name}</h5><p>${campground.location}</p>`)
      .setMaxWidth("300px")
      .addTo(map)
  )
  .addTo(map);
