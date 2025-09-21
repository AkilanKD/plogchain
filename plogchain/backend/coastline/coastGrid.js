import fs from "fs";
import {bbox, squareGrid} from "@turf/turf";

const water = JSON.parse(fs.readFileSync("merged.geojson"));
const newbbox = bbox(water);
const cellSize = 5; // kilometers
const grid = squareGrid(newbbox, cellSize, { units: "kilometers", mask: water });

fs.writeFileSync("coastal_grid.geojson", JSON.stringify(grid));
console.log(`Generated ${grid.features.length} cleanup squares`);
