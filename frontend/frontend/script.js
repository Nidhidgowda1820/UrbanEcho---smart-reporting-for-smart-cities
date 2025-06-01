console.log("Script loaded!");

// Default map location (India centered)
let selectedLat = null;
let selectedLng = null;

// Initialize Leaflet map
const map = L.map('map').setView([17.385044, 78.486671], 6);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data © OpenStreetMap contributors',
}).addTo(map);

let marker = null;

// Map click event to select location
map.on('click', function (e) {
  selectedLat = e.latlng.lat;
  selectedLng = e.latlng.lng;

  if (marker) {
    marker.setLatLng(e.latlng);
  } else {
    marker = L.marker(e.latlng).addTo(map);
  }
});

// Form submission handler
document.getElementById("reportForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  console.log("Submitting form...");

  const issueType = document.getElementById("issueType").value;
  const description = document.getElementById("description").value;
  const imageFile = document.getElementById("image")?.files[0];

  if (!selectedLat || !selectedLng) {
    alert("📍 Please mark a location on the map.");
    return;
  }

  const formData = new FormData();
  formData.append("issueType", issueType);
  formData.append("description", description);
  if (imageFile) {
    formData.append("image", imageFile);
  }
  formData.append("latitude", selectedLat);
  formData.append("longitude", selectedLng);

  try {
    const response = await fetch("http://127.0.0.1:3000/complaints", {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      let errorText = "Unknown error";
      try {
        const errorData = await response.json();
        errorText = errorData.error || errorText;
      } catch (_) {
        // ignore
      }

      console.error("❌ Submission failed:", errorText);
      alert("❌ Failed to submit report: " + errorText);
      return;
    }

    const result = await response.json();
    console.log("✅ Report submitted:", result);

    alert("✅ Report submitted successfully!");
    this.reset();

    if (marker) {
      map.removeLayer(marker);
      marker = null;
    }

    selectedLat = null;
    selectedLng = null;

  } catch (err) {
    console.error("❌ Error submitting report:", err);
    alert("⚠ Something went wrong. Please check the console.");
  }
});