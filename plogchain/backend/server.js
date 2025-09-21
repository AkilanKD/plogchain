import express, { json } from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(json());

// GET all trash spots
app.get("/api/trash", async (req, res) => {
  const result = await pool.query("SELECT * FROM trash_spots");
  res.json(result.rows);
});

// POST new trash report
app.post("/api/trash/report", async (req, res) => {
  const { lat, lng, score } = req.body;
  await pool.query(
    "INSERT INTO trash_spots (lat, lng, score) VALUES ($1, $2, $3)",
    [lat, lng, score]
  );
  res.json({ message: "Report added" });
});

app.post("/signup", async (req, res) => {
  console.log(req.body)
  res.json({ message: "Hello World" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
