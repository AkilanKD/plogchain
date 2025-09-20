// server.js
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

// Example dirtiness data (this would normally come from your DB)
let trashSpots = [
  { lat: 37.782, lng: -122.447, score: 1 },
  { lat: 37.782, lng: -122.445, score: 3 },
  { lat: 37.782, lng: -122.443, score: 5 },
];

// API endpoint to get dirtiness data
app.get("/api/trash", (req, res) => {
  res.json(trashSpots);
});

// Example: endpoint to update dirtiness
app.post("/api/trash/report", express.json(), (req, res) => {
  const { lat, lng, score } = req.body;
  trashSpots.push({ lat, lng, score });
  res.json({ message: "Report added", data: trashSpots });
});

const PORT = process.env.PORT || 5000; // Use Render’s port, fallback to 5000 locally

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
