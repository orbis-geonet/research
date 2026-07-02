document.getElementById("fileInput").addEventListener("change", handleFile);

function handleFile(event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function (event) {
    const img = new Image();
    img.src = event.target.result;
    img.onload = function () {
      // Draw the image on the canvas
      const canvas = document.getElementById("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, img.width, img.height);

      // Get dominant border color
      const dominantBorderColor = getDominantColor(img, {
        excludeColors: [],
        threshold: 20,
      });

      // Display the dominant border color
      console.log(dominantBorderColor);
    };
  };
  reader.readAsDataURL(file);
}

function getDominantColor(img, options = { excludeColors: [], threshold: 0 }) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = img.width;
    canvas.height = img.height;
  
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    // Create a clipping path for the outer circle
    const circleRadius = Math.min(canvas.width, canvas.height) / 2;
    const borderWidth = 10; // Adjust border width as needed
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, circleRadius - borderWidth, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
  
    // Draw the image onto the canvas
    ctx.drawImage(img, 0, 0, img.width, img.height);
  
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixelData = imageData.data;
    const colorCounts = {};
  
    for (let i = 0; i < pixelData.length; i += 4) {
      const r = pixelData[i];
      const g = pixelData[i + 1];
      const b = pixelData[i + 2];
      const a = pixelData[i + 3];
  
      // Get pixel position
      const x = i / 4 % canvas.width;
      const y = Math.floor(i / 4 / canvas.width);
  
      // Check if the pixel is on the border of the circle
      const distanceToCenter = Math.sqrt((x - canvas.width / 2) ** 2 + (y - canvas.height / 2) ** 2);
      if (distanceToCenter < circleRadius - borderWidth || distanceToCenter > circleRadius) {
        continue; // Skip if outside the border
      }
  
      // Fill pixel with red
    //   if (i % 1000 === 0) {
    //       ctx.fillStyle = "red";
    //   }
      ctx.fillRect(x, y, 1, 1);
  
      // Skip transparent pixels
      if (a === 0) {
        continue;
      }
  
      const color = `${r},${g},${b}`;
  
      // Check if the color should be excluded
      if (options.excludeColors.some((excludeColor) => color === excludeColor)) {
        continue;
      }
  
      // Round RGB values to the nearest multiple of the threshold
      const roundedColor = [
        Math.round(r / options.threshold) * options.threshold,
        Math.round(g / options.threshold) * options.threshold,
        Math.round(b / options.threshold) * options.threshold,
      ].join(",");
  
      if (!colorCounts[roundedColor]) {
        colorCounts[roundedColor] = 0;
      }
      colorCounts[roundedColor]++;
    }

    if (!Object.keys(colorCounts).length) {
        return 'white';
    }

    // Sort colors by count
    const sortedColors = Object.keys(colorCounts).sort(
      (a, b) => colorCounts[b] - colorCounts[a]
    );
  
    // Extract the most common color
    const mostCommonColor = sortedColors[0].split(",").map(Number);
  
    console.log(mostCommonColor);
    return mostCommonColor;
  }
  
  
  
function getDominantBorderColor(img,
  options = { excludeColors: [], threshold: 0, strokeWidth: 1 }
) {
  const ctx = canvas.getContext("2d");
  canvas.width = img.width;
  canvas.height = img.height;
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = Math.min(centerX, centerY) - options.strokeWidth / 2;
  const numPoints = Math.ceil(2 * Math.PI * radius);

  // Clear the canvas and draw the image
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  // Save the current canvas state
  ctx.save();

  // Clip the canvas to the circular region
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.clip();

  // Clear the interior of the circular region
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Restore the canvas state
  ctx.restore();

  // Draw points along the circular border
  ctx.fillStyle = "red"; // Adjust color as needed
  for (let i = 0; i < numPoints; i++) {
    const angle = (i / numPoints) * Math.PI * 2;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    ctx.fillRect(x, y, 1, 1);
  }

  // Get image data only from the circular border points
  const imageData = ctx.getImageData(
    centerX - radius,
    centerY - radius,
    2 * radius,
    2 * radius
  );
  const pixelData = imageData.data;
  const colorCounts = {};

  for (let i = 0; i < pixelData.length; i += 4) {
    const r = pixelData[i];
    const g = pixelData[i + 1];
    const b = pixelData[i + 2];
    const a = pixelData[i + 3];

    // Skip transparent pixels
    if (a === 0) {
      continue;
    }

    const color = `${r},${g},${b}`;

    // Check if the color should be excluded
    if (options.excludeColors) {
      if (
        options.excludeColors.some((excludeColor) => color === excludeColor)
      ) {
        continue;
      }
    }

    // Round RGB values to the nearest multiple of the threshold
    const roundedColor = [
      Math.round(r / options.threshold) * options.threshold,
      Math.round(g / options.threshold) * options.threshold,
      Math.round(b / options.threshold) * options.threshold,
    ].join(",");

    if (!colorCounts[roundedColor]) {
      colorCounts[roundedColor] = 0;
    }
    colorCounts[roundedColor]++;
  }

  // Find the color with the highest count
  let maxCount = 0;
  let dominantColor = "";
  for (const color in colorCounts) {
    if (colorCounts[color] > maxCount) {
      maxCount = colorCounts[color];
      dominantColor = color;
    }
  }

  return dominantColor.split(",").map(Number);
}

function getDominantColors(img, numColors, similarityThreshold) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0, img.width, img.height);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixelData = imageData.data;
  const colorCounts = {};

  for (let i = 0; i < pixelData.length; i += 4) {
    const r = pixelData[i];
    const g = pixelData[i + 1];
    const b = pixelData[i + 2];
    const a = pixelData[i + 3];

    // Skip transparent pixels
    if (a === 0) {
      continue;
    }

    const color = `${r},${g},${b}`;

    if (!colorCounts[color]) {
      colorCounts[color] = 0;
    }
    colorCounts[color]++;
  }

  // Group similar colors
  const groupedColors = {};
  Object.keys(colorCounts).forEach((color) => {
    let foundSimilar = false;
    Object.keys(groupedColors).forEach((groupedColor) => {
      const [r1, g1, b1] = color.split(",").map(Number);
      const [r2, g2, b2] = groupedColor.split(",").map(Number);
      const distance = Math.sqrt(
        (r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2
      );
      if (distance <= similarityThreshold) {
        groupedColors[groupedColor] += colorCounts[color];
        foundSimilar = true;
      }
    });
    if (!foundSimilar) {
      groupedColors[color] = colorCounts[color];
    }
  });

  // Sort colors by count
  const sortedColors = Object.keys(groupedColors).sort(
    (a, b) => groupedColors[b] - groupedColors[a]
  );

  // Extract top N colors
  const topColors = sortedColors
    .slice(0, numColors)
    .map((color) => color.split(",").map(Number));

  // Log the most common colors
  for (let i = 0; i < numColors; i++) {
    console.log(
      `Color ${i + 1}: rgb(${topColors[i][0]}, ${topColors[i][1]}, ${
        topColors[i][2]
      }) - ${groupedColors[sortedColors[i]]} pixels`
    );
  }

  return topColors;
}

function displayDominantColors(colors) {
  const colorContainer = document.getElementById("colorContainer");
  colorContainer.innerHTML = ""; // Clear previous colors

  colors.forEach((color, index) => {
    const [r, g, b] = color;
    const colorBox = document.createElement("div");
    colorBox.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
    colorBox.style.width = "50px";
    colorBox.style.height = "50px";
    colorBox.style.marginRight = "10px";
    colorBox.style.display = "inline-block";
    colorBox.title = `rgb(${r}, ${g}, ${b})`;
    colorContainer.appendChild(colorBox);
  });
}
