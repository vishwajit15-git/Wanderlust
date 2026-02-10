console.log("Map script loaded");
console.log("mapToken:", mapToken);
console.log("listing:", listing);

// Verify mapToken exists
if (!mapToken || mapToken.trim() === "") {
  console.error("MAP_TOKEN is not set or empty");
}

// Initialize MapTiler SDK with the API key
if (mapToken) {
  maptilersdk.config.apiKey = mapToken;
}

// Create a map instance
const mapElement = document.getElementById('map');
console.log("Map element found:", mapElement);

if (mapElement) {
  try {
    const map = new maptilersdk.Map({
      container: 'map', // container id
      style: maptilersdk.MapStyle.STREETS,
      center: [78.9459, 20.5937], // Default center (India)
      zoom: 4
    });

    console.log("Map initialized successfully");

    // Add marker if coordinates are available
    if (listing && listing.geometry && listing.geometry.coordinates) {
      // Create popup
      const popup = new maptilersdk.Popup({ offset: 25, closeButton: false })
        .setText("Exact location will be shown after booking");

      // Create marker with popup
      const marker = new maptilersdk.Marker()
        .setLngLat(listing.geometry.coordinates)
        .setPopup(popup)
        .addTo(map);

      // Show popup on hover
      marker.getElement().addEventListener('mouseenter', function () {
        marker.togglePopup();
      });

      marker.getElement().addEventListener('mouseleave', function () {
        marker.togglePopup();
      });

      console.log("Marker added at:", listing.geometry.coordinates);
    } else {
      console.log("No geometry/coordinates found in listing");
    }
  } catch (error) {
    console.error("Error initializing map:", error);
  }
} else {
  console.error("Map element with id 'map' not found");
}
