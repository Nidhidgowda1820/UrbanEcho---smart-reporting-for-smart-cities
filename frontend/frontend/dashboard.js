console.log("Dashboard loaded!");

// Initialize map
const map = L.map('map').setView([17.385044, 78.486671], 6);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data © OpenStreetMap contributors',
}).addTo(map);

let allMarkers = [];

// Fetch complaints from backend
async function loadComplaints() {
  try {
    const res = await fetch("http://localhost:3000/dashboard");
    const complaints = await res.json();

    console.log("Complaints:", complaints);
    displayMarkers(complaints);
    updateStats(complaints);
  } catch (err) {
    console.error("Error fetching complaints:", err);
    alert("Failed to load dashboard data.");
  }
}

// Display markers on the map
function displayMarkers(complaints) {
  // Remove old markers
  allMarkers.forEach(marker => map.removeLayer(marker));
  allMarkers = [];

  const selectedType = document.getElementById("filterType").value;

  complaints.forEach(complaint => {
    if (selectedType !== "all" && complaint.issueType !== selectedType) return;
    if (!complaint.latitude || !complaint.longitude) return;

    const marker = L.marker([complaint.latitude, complaint.longitude]).addTo(map);
    marker.bindPopup(`
      <strong>${complaint.issueType}</strong><br/>
      ${complaint.description}<br/>
      <em>Status: ${complaint.status}</em><br/>
      ${complaint.imageUrl ? <img src="${complaint.imageUrl}" width="200" style="margin-top:8px; border-radius:8px;" /> : ""}
    `);
    allMarkers.push(marker);
  });
}

// Update summary stats
function updateStats(complaints) {
  document.getElementById("totalCount").textContent = complaints.length;
  document.getElementById("pendingCount").textContent = complaints.filter(c => c.status === "pending").length;
  document.getElementById("resolvedCount").textContent = complaints.filter(c => c.status === "resolved").length;
}

// Handle filter change
document.getElementById("filterType").addEventListener("change", loadComplaints);

// Initial load
loadComplaints();