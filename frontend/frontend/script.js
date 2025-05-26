console.log("Script loaded!");

// Default map location
let selectedLat = null;
let selectedLng = null;

const map = L.map('map').setView([17.385044, 78.486671], 6);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data © OpenStreetMap contributors',
}).addTo(map);

let marker = null;

map.on('click', function (e) {
  selectedLat = e.latlng.lat;
  selectedLng = e.latlng.lng;

  if (marker) {
    marker.setLatLng(e.latlng);
  } else {
    marker = L.marker(e.latlng).addTo(map);
  }
});

document.getElementById("reportForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  console.log("Submitting form...");

  const issueType = document.getElementById("issueType").value;
  const description = document.getElementById("description").value;
  // const imageFile = document.getElementById("image").files[0];

  // if (!selectedLat || !selectedLng) {
  //   alert("Please mark a location on the map.");
  //   return;
  // }

  const formData = new FormData();
  formData.append("issueType", issueType);
  formData.append("description", description);
  // formData.append("image", imageFile);
  formData.append("latitude", selectedLat);
  formData.append("longitude", selectedLng);

  try {
    const response = await fetch("http://127.0.0.1:3000/complaints", {
      method: "POST",
      body: formData
    });

    const result = await response.json();

    if (response.ok) {
      alert("Report submitted successfully!");
      this.reset();
      marker?.remove();
      marker = null;
    } else {
      console.error("Submission failed:", result);
      alert("Failed to submit report.");
    }
  } catch (err) {
    console.error("Error submitting report:", err.message,err);
    alert("Something went wrong. Check the console.");
  }
});