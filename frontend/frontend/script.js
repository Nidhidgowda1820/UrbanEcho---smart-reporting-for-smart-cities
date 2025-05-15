console.log("Script loaded");

let selectedCoords = null;
let marker = null;

// Initialize Leaflet map
const map = L.map('map').setView([20.5937, 78.9629], 5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Click to set marker
map.on('click', function (e) {
  selectedCoords = e.latlng;

  if (marker) {
    map.removeLayer(marker);
  }

  marker = L.marker(selectedCoords).addTo(map);
});

// Submit form handler
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
      selectedCoords = null;
    } else {
      alert("Failed to submit report: " + result.error);
    }
  } catch (err) {
    console.error("Error sending report:", err);
    alert("Something went wrong. Check the console.");
  }
});

// Status checker functionality
document.getElementById("checkStatusBtn").addEventListener("click", async () => {
  const reportId = document.getElementById("reportIdInput").value.trim();
  const statusResult = document.getElementById("statusResult");

  if (!reportId) {
    statusResult.textContent = "Please enter a valid report ID.";
    return;
  }

  try {
    // Replace this URL with your real backend endpoint to get report status by ID
    const response = await fetch(`http://localhost:3000/complaints/status/${reportId}`);
    if (!response.ok) throw new Error("Report not found");

    const data = await response.json();
    statusResult.textContent = `Status of report ID ${reportId}: ${data.status}`;
  } catch (error) {
    statusResult.textContent = "Unable to find report status. Please check the ID and try again.";
  }
});

// Simple chatbot toggle
const chatbotHeader = document.getElementById("chatbot-header");
const chatbotBody = document.getElementById("chatbot-body");
const chatbotInput = document.getElementById("chatbot-input");

chatbotHeader.addEventListener("click", () => {
  const isVisible = chatbotBody.style.display === "flex";
  chatbotBody.style.display = isVisible ? "none" : "flex";
  chatbotInput.style.display = isVisible ? "none" : "block";
  if (!isVisible) chatbotInput.focus();
});

// Basic chatbot responses (you can expand this with smarter AI or API calls)
const chatbotResponses = {
  "hello": "Hello! How can I assist you with reporting city issues?",
  "how to report": "You can fill the form above and submit details along with a photo and location.",
  "status": "To check the status of your report, enter your report ID in the 'Check Your Report Status' section.",
  "thanks": "You're welcome! If you need more help, just ask."
};

chatbotInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    const userMessage = chatbotInput.value.trim().toLower
