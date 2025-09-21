import express, { json } from "express";
import cors from "cors";
import { CLEANUPS_POOL, REPORTS_POOL, SPOTS_POOL, USERS_POOL } from "api/api.js";

const app = express();
app.use(cors());
app.use(json());

// GET all trash spots
app.get("/api/trash", async (req, res) => {
  const result = await pool.query("SELECT * FROM trash_spots");
  res.json(result.rows);
});

// post New user code
app.post("/users", async (req, res) => {
  const { name, email, password } = req.body; // Get data from form

  try {
    // Insert into Users table
    const result = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, password]
    );
    res.json({ success: true, user: result.rows[0] }); // Send back confirmation
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error creating user" });
  }
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
  res.json({ message: "Sign up processed!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
