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

// Function to render an image on the canvas
function drawImage(img, x, y, radiusInput) {
  const upscaleFactors = [1.5, 1.4, 1.3, 1.2, 1.1, 1.0]; // Adjust as needed
  const originalRadius = radiusInput;

  // Draw upscaled versions
  upscaleFactors.forEach((factor) => {
    const upscaledRadius = originalRadius * factor;

    // Create a circular clipping path
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, upscaledRadius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    // Draw the upscaled image
    ctx.drawImage(img, x - upscaledRadius, y - upscaledRadius, upscaledRadius * 2, upscaledRadius * 2);

    // Restore the previous context state to remove the clipping path
    ctx.restore();
  });

  // Draw the original image with defined radius
  // ctx.drawImage(img, x - originalRadius, y - originalRadius, originalRadius * 2, originalRadius * 2);

  // Draw a border around the original circle
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y, originalRadius, 0, Math.PI * 2);
  ctx.closePath();
  ctx.stroke();
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
}

// Call initialize function when the DOM is loaded
document.addEventListener("DOMContentLoaded", initialize);
