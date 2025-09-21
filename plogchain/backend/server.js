import express, { json } from "express";
import cors from "cors";
// import { functionName } from './api/api.js';   

const app = express();
app.use(cors());
app.use(json());

// GET all cleanup spots
app.get("/api/trash", async (req, res) => {
  
  const result = await pool.query("SELECT * FROM trash_spots");
  res.json(result.rows);
});

// GET nearby spots for cleanup
app.get("/api/nearby", async (req, res) => {
  

});

// POST new users

// POST new cleanup report
app.post("/api/trash/report", async (req, res) => {
  const { lat, lng, score } = req.body;
  await pool.query(
    "INSERT INTO trash_spots (lat, lng, score) VALUES ($1, $2, $3)",
    [lat, lng, score]
  );
  res.json({ message: "Report added" });
});

// PUT new scores for existing cleanup spot?


// 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
