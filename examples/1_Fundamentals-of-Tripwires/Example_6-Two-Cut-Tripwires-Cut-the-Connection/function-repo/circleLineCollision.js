export function circleLineCollision(circleX, circleY, radius, lineX1, lineY1, lineX2, lineY2) {
  // Check if a circle collides with a line segment
  let closestX = lineX1;
  let closestY = lineY1;

  const lineLength = Math.sqrt((lineX2 - lineX1) ** 2 + (lineY2 - lineY1) ** 2);

  if (lineLength !== 0) {
      const u = ((circleX - lineX1) * (lineX2 - lineX1) + (circleY - lineY1) * (lineY2 - lineY1)) / (lineLength ** 2);
      closestX = lineX1 + u * (lineX2 - lineX1);
      closestY = lineY1 + u * (lineY2 - lineY1);
  }

  const distance = Math.sqrt((circleX - closestX) ** 2 + (circleY - closestY) ** 2);
  console.log(distance, radius);

  return distance <= radius;
}
