export function calculateArcPoints(center, radius, startAngle, endAngle, numPoints, isClockwise) {
  var points = [];

  // Normalize angles to be within the range [0, 2π]
  startAngle = (startAngle % (2 * Math.PI) + (2 * Math.PI)) % (2 * Math.PI);
  endAngle = (endAngle % (2 * Math.PI) + (2 * Math.PI)) % (2 * Math.PI);

  // Ensure the angles are in the correct order for the desired direction
  if (isClockwise) {
    if (startAngle < endAngle) {
      startAngle += 2 * Math.PI; // Ensure the start angle is greater for clockwise direction
    }
  } else {
    if (endAngle < startAngle) {
      endAngle += 2 * Math.PI; // Ensure the end angle is greater for counterclockwise direction
    }
  }

  // Calculate angle increment based on direction
  var totalAngle = isClockwise ? startAngle - endAngle : endAngle - startAngle;
  var angleIncrement = totalAngle / numPoints;

  for (let i = 0; i <= numPoints; i++) {
    var angle = isClockwise ? startAngle - (angleIncrement * i) : startAngle + (angleIncrement * i);
    var x = center.x + radius * Math.cos(angle);
    var y = center.y + radius * Math.sin(angle);
    points.push({ x: x, y: y });
  }

  return points;
}

