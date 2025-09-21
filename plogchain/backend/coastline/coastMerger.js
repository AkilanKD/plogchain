import fs from "fs";
import path from "path";

const folder = "./geojson_files";
const files = fs.readdirSync(folder).filter(f => f.endsWith(".json") || f.endsWith(".geojson"));

let allKeys = new Set();

// Step 1: Collect all property keys across all files
for (const file of files) {
  const data = JSON.parse(fs.readFileSync(path.join(folder, file)));
  data.features.forEach(f => Object.keys(f.properties).forEach(k => allKeys.add(k)));
}

// Step 2: Ensure all features have all keys
let mergedFeatures = [];

for (const file of files) {
  const data = JSON.parse(fs.readFileSync(path.join(folder, file)));
  data.features.forEach(f => {
    for (const key of allKeys) {
      if (!(key in f.properties)) f.properties[key] = null; // fill missing with null
    }
    mergedFeatures.push(f);
  });
}

// Step 3: Save merged GeoJSON
const mergedGeoJSON = { type: "FeatureCollection", features: mergedFeatures };
fs.writeFileSync("water.geojson", JSON.stringify(mergedGeoJSON));