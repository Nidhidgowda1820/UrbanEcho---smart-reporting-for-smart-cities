console.log("Script loaded");

let selectedCoords = null;
let marker = null;

// Initialize Leaflet map
const map = L.map('map').setView([20.5937, 78.9629], 5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Click on map to drop a marker
map.on('click', function (e) {
  selectedCoords = e.latlng;

  if (marker) {
    map.removeLayer(marker);
  }

  marker = L.marker(selectedCoords).addTo(map);
});

// Submit form
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
      }
    } else {
      alert("Failed to submit report: " + (result.error || "Unknown error"));
    }
  } catch (err) {
    console.error("Error sending report:", err);
    alert("Something went wrong. Check the console.");
  }
});