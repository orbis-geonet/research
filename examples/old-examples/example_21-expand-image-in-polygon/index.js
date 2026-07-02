import { polygon } from "./polygon.js";

// Canvas related variables
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const scalingFactor = 0.04;
const scaledPolygon = polygon[0].map((point) => [point[0] * scalingFactor, point[1] * scalingFactor]);

// Draw a polygon
function drawPolygon(points) {
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i][0], points[i][1]);
  }
  ctx.closePath();
  ctx.stroke();
}

// Draw a polygon and fill it with an image
function drawPolygonWithImage(points, img) {
  // Calculate the bounding box of the polygon
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (let i = 0; i < points.length; i++) {
    minX = Math.min(minX, points[i][0]);
    minY = Math.min(minY, points[i][1]);
    maxX = Math.max(maxX, points[i][0]);
    maxY = Math.max(maxY, points[i][1]);
  }
  const width = maxX - minX;
  const height = maxY - minY;

  // Create a clipping path for the polygon
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i][0], points[i][1]);
  }
  ctx.closePath();
  ctx.clip();

  // Draw the image within the clipping path, using the polygon's dimensions
  ctx.drawImage(img, minX, minY, width, height);

  // Reset clipping to avoid affecting future drawings
  ctx.restore();
}

// Upload and display the selected image
function uploadImage(event) {
  const fileInput = event.target;
  if (fileInput.files.length > 0) {
    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = function (event) {
      const img = new Image();
      img.onload = function () {
        // drawImage(img, 6882.52 * scalingFactor, 3069.83 * scalingFactor, 1138.87 * scalingFactor);
        drawPolygonWithImage(scaledPolygon, img);
        fileInput.value = null;
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  } else {
    console.error("Please select a file and enter a radius.");
  }
}

// Initialize event listeners
function initialize() {
  document.getElementById("imageUploadButton").addEventListener("click", function () {  document.getElementById("imageUpload").click();});
  document.getElementById("imageUpload").addEventListener("change", uploadImage);

  drawPolygon(scaledPolygon);
}

// Call initialize function when the DOM is loaded
document.addEventListener("DOMContentLoaded", initialize);
