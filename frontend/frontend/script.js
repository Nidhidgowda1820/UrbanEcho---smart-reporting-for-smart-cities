console.log("Script loaded");

let selectedCoords = null;
let marker = null;

// Initialize Leaflet map
const map = L.map('map').setView([20.5937, 78.9629], 5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Try to get user's location and add draggable marker there
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      // Set map view to user location with zoom
      map.setView([lat, lng], 15);

      // Add draggable marker at user location
      marker = L.marker([lat, lng], { draggable: true }).addTo(map);
      selectedCoords = marker.getLatLng();

      marker.bindPopup("Drag to mark issue location").openPopup();

      // Update selectedCoords when marker is dragged
      marker.on('dragend', function(e) {
        selectedCoords = e.target.getLatLng();
        console.log("Marker moved to:", selectedCoords);
      });
    },
    (err) => {
      console.warn("Geolocation failed or denied:", err.message);
      alert("Could not get your location. Please click on the map to select location.");
    }
  );
} else {
  alert("Geolocation not supported by your browser. Please click on the map to select location.");
}

// Click map to set or move marker manually
map.on('click', function (e) {
  selectedCoords = e.latlng;

  if (marker) {
    marker.setLatLng(selectedCoords);
  } else {
    marker = L.marker(selectedCoords, { draggable: true }).addTo(map);
    // Update selectedCoords on drag
    marker.on('dragend', function(e) {
      selectedCoords = e.target.getLatLng();
      console.log("Marker moved to:", selectedCoords);
    });
  }
});

// Submit form handler (your existing code)
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
    } else {
      alert("Failed to submit report: " + result.error);
    }
  } catch (err) {
    console.error("Error sending report:", err);
    alert("Something went wrong. Check the console.");
  }
});
