const map = L.map('map').setView([20.5937, 78.9629], 5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

const markersGroup = L.layerGroup().addTo(map);

async function loadComplaints(filterType = 'all') {
  try {
    const res = await fetch('http://localhost:3000/complaints');
    const complaints = await res.json();

    markersGroup.clearLayers();

    const filtered = complaints.filter(c => filterType === 'all' || c.issueType === filterType);

    filtered.forEach(complaint => {
      if (complaint.latitude && complaint.longitude) {
        const marker = L.marker([complaint.latitude, complaint.longitude]).addTo(markersGroup);
        let popupContent = `
          <strong>Issue:</strong> ${complaint.issueType}<br/>
          <strong>Description:</strong> ${complaint.description}<br/>
          <strong>Status:</strong> ${complaint.status}<br/>
        `;
        if (complaint.imageUrl) {
          popupContent += <img src="${complaint.imageUrl}" alt="Image" style="max-width:200px; margin-top:10px;"/>;
        }
        marker.bindPopup(popupContent);
      }
    });

  } catch (error) {
    console.error('Failed to load complaints:', error);
  }
}

// Load all complaints initially
loadComplaints();

document.getElementById('filterType').addEventListener('change', (e) => {
  loadComplaints(e.target.value);
});