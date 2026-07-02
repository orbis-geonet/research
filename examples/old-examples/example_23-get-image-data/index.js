// Canvas related variables
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const points = []; // Array to store points
const images = []; // Array to store images

// Draw a circle at the given coordinates
function drawPoint(x, y) {
  ctx.beginPath();
  ctx.arc(x, y, 5, 0, 2 * Math.PI);
  ctx.fillStyle = "red";
  ctx.fill();
}

// Function to render an image on the canvas
function drawImage(img, x, y, radiusInput) {
  // Create a circular clipping path
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, radiusInput, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();

  // Draw the image as a pattern within the circular clipping path
  ctx.drawImage(img, x - radiusInput, y - radiusInput, radiusInput * 2, radiusInput * 2);

  // Restore the previous context state to remove the clipping path
  ctx.restore();

  const dataPoint = [x, y - radiusInput + 2];

  const data = ctx.getImageData(dataPoint[0], dataPoint[1], 1, 1);
  const color = `rgba(${data.data[0]}, ${data.data[1]}, ${data.data[2]}, ${data.data[3]})`;

  ctx.beginPath();
  ctx.rect(0, 0, 100, 100);
  ctx.fillStyle = color;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(dataPoint[0], dataPoint[1], 5, 0, 2 * Math.PI);
  ctx.fillStyle = "red";
  ctx.fill();
}

// Reposition all points and redraw images
function redrawCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
  points.forEach((point, index) => {
    drawPoint(point.x, point.y);
    if (images[index]) {
      drawImage(images[index].img, point.x, point.y, images[index].radius);
    }
  });
}

// Reposition a single point randomly within the canvas
function repositionPoint() {
  const pointX = Math.floor(Math.random() * canvas.width * 0.9);
  const pointY = Math.floor(Math.random() * canvas.height * 0.9);
  points.push({ x: pointX, y: pointY });
  redrawCanvas();
}

// Upload and display the selected image
function uploadImage(event) {
  const fileInput = event.target;
  const radiusInput = document.getElementById("radiusInput").value;
  if (fileInput.files.length > 0 && radiusInput) {
    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = function (event) {
      const img = new Image();
      img.onload = function () {
        images.push({ img: img, radius: radiusInput });
        redrawCanvas();
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
  document.getElementById("repositionButton").addEventListener("click", repositionPoint);
  document.getElementById("imageUploadButton").addEventListener("click", function () {  document.getElementById("imageUpload").click();});
  document.getElementById("imageUpload").addEventListener("change", uploadImage);
  repositionPoint();
}

// Call initialize function when the DOM is loaded
document.addEventListener("DOMContentLoaded", initialize);
