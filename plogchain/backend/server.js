// server.js
import express from "express";          // if Node <20 or no "type":"module", use: const express = require("express")
import cors from "cors";
import multer from "multer";
import * as exifr from "exifr";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// --- middleware ---
app.use(cors({ origin: true }));
app.use(express.json());
// serve your static site from /public
app.use(express.static(path.join(__dirname, "public")));

// --- demo data for heatmap ---
/** level: 0 clean, 1 attention, 2 dirty */
const spots = [
  { id: 1, lat: 37.7749, lng: -122.4194, level: 2, updatedAt: new Date().toISOString() },
  { id: 2, lat: 37.7694, lng: -122.4862, level: 1, updatedAt: new Date().toISOString() },
  { id: 3, lat: 37.8079, lng: -122.4177, level: 0, updatedAt: new Date().toISOString() },
];

// --- GET /api/trash  (map consumes this) ---
app.get("/api/trash", (req, res) => {
  res.json(spots);
});

// --- POST /api/trash  (optional: add/update a spot) ---
app.post("/api/trash", (req, res) => {
  const { id, lat, lng, level } = req.body || {};
  if (typeof lat !== "number" || typeof lng !== "number" || ![0,1,2].includes(level)) {
    return res.status(400).json({ ok:false, error:"lat,lng (number) and level (0|1|2) required" });
  }
  const existing = spots.find(s => s.id === id);
  if (existing) {
    Object.assign(existing, { lat, lng, level, updatedAt: new Date().toISOString() });
    return res.json({ ok:true, data: existing });
  }
  const newSpot = { id: id ?? Date.now(), lat, lng, level, updatedAt: new Date().toISOString() };
  spots.push(newSpot);
  res.status(201).json({ ok:true, data: newSpot });
});

// --- photo upload endpoint (extract timestamp/GPS from EXIF) ---
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 8 * 1024 * 1024 } });

app.post("/api/events", upload.array("photos"), async (req, res) => {
  try {
    if (!req.files?.length) return res.status(400).json({ ok:false, error:"photos[] required" });

    // Parse EXIF from first photo
    const meta = await exifr.parse(req.files[0].buffer, { gps: true });
    let takenAt = null;
    if (meta?.DateTimeOriginal instanceof Date) takenAt = meta.DateTimeOriginal.toISOString();
    else if (meta?.CreateDate instanceof Date) takenAt = meta.CreateDate.toISOString();

    const lat = meta?.latitude ?? null;
    const lng = meta?.longitude ?? null;

    // For demo, push an updated spot if GPS is present
    if (typeof lat === "number" && typeof lng === "number") {
      spots.push({ id: Date.now(), lat, lng, level: 2, updatedAt: new Date().toISOString() });
    }

    res.json({
      ok: true,
      data: {
        taken_at: takenAt || new Date().toISOString(),
        gps: typeof lat === "number" && typeof lng === "number" ? { lat, lng } : null,
        exif_present: Boolean(takenAt || (lat && lng))
      }
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok:false, error:"EXIF parse failed" });
  }
});

// (Optional) health check
app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Server running → http://localhost:${PORT}`);
  console.log(`Site → http://localhost:${PORT}/  (serving ./public)`);
});