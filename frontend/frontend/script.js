console.log("Script loaded");

let selectedCoords = null;
let marker = null;

// Initialize Leaflet map with default center over India
const map = L.map('map').setView([20.5937, 78.9629], 5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Auto-detect user location and set map view & marker
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const userLatLng = [position.coords.latitude, position.coords.longitude];
      map.setView(userLatLng, 13); // Zoom in to user location
      
      // Remove existing marker if any
      if (marker) {
        map.removeLayer(marker);
      }
      
      // Add draggable marker at user location
      marker = L.marker(userLatLng, { draggable: true }).addTo(map);
      selectedCoords = marker.getLatLng();
      
      // Update selectedCoords on marker drag
      marker.on('dragend', function (e) {
        selectedCoords = e.target.getLatLng();
      });
    },
    (error) => {
      console.warn(`Geolocation error: ${error.message}`);
      // If error, just keep default map center & no marker
    }
  );
} else {
  console.warn("Geolocation is not supported by this browser.");
}

// Click map to set marker manually (overrides auto-location)
map.on('click', function (e) {
  selectedCoords = e.latlng;

  if (marker) {
    map.removeLayer(marker);
  }

  marker = L.marker(selectedCoords, { draggable: true }).addTo(map);
  
  // Update selectedCoords when dragged
  marker.on('dragend', function (e) {
    selectedCoords = e.target.getLatLng();
  });
});

// Form submit handler
document.getElementById("reportForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  console.log("Form submitted");

  const issueType = document.getElementById("issueType").value;
  const description = document.getElementById("description").value;
  const imageFile = document.getElementById("image").files[0];

  if (!selectedCoords || !imageFile) {
    alert("Please upload an image and select a location.");
    return;
  }

  const formData = new FormData();
  formData.append("issueType", issueType);
  formData.append("description", description);
  formData.append("image", imageFile);
  formData.append("latitude", selectedCoords.lat);
  formData.append("longitude", selectedCoords.lng);

  try {
    const response = await fetch("http://localhost:3000/complaints", {
      method: "POST",
      body: formData
    });

    const result = await response.json();
    console.log("Backend response:", result);

    if (response.ok) {
      alert("Report submitted successfully!");
      document.getElementById("reportForm").reset();
      if (marker) {
        map.removeLayer(marker);
        marker = null;
        selectedCoords = null;
      }
      // Optionally reset map view to default or user location
    } else {
      alert("Failed to submit report: " + result.error);
    }
  } catch (err) {
    console.error("Error sending report:", err);
    alert("Something went wrong. Check the console.");
  }
});
