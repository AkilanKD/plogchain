import fs from "fs";
import path from "path";
import {bbox, featureCollection, squareGrid} from "@turf/turf";
import simplify from "@turf/simplify";

const folderPath = "./geojson_files";
const files = fs.readdirSync(folderPath).filter(f => f.endsWith(".json") || f.endsWith(".geojson"));

console.log(`Found ${files.length} files.`);

const finalGridFeatures = [];

for (const file of files) {
  const geojson = JSON.parse(fs.readFileSync(path.join(folderPath, file), "utf8"));
  if (!geojson.features || !Array.isArray(geojson.features)) continue;

  // 1️⃣ Filter invalid features
  const validFeatures = geojson.features.filter(f => f && f.geometry);

  // 2️⃣ Simplify individually
  const simplifiedFeatures = validFeatures.map(f => simplify(f, { tolerance: 0.5, highQuality: true }));

  // 3️⃣ Create mask and grid for this file only
  const mask = featureCollection(simplifiedFeatures);
  const new_bbox = bbox(mask);
  const grid = squareGrid(new_bbox, 5, { units: "kilometers", mask });

  // 4️⃣ Merge grid features incrementally
  finalGridFeatures.push(...grid.features);
  console.log(`Processed file: ${file}, grid cells: ${grid.features.length}`);
}

// 5️⃣ Save final grid
const finalGrid = featureCollection(finalGridFeatures);
fs.writeFileSync("coastal_grid.geojson", JSON.stringify(finalGrid));

console.log(`✅ Final cleanup grid has ${finalGrid.features.length} squares`);
