# Tripwires Detect Collision With Different Group
If you start the index.html using a live server, you can see several places with different radii and colors. You can drag and drop the places to see how the tripwires change. Places with the same color are in the same group and will connect to each other, if they are close enough. If you drag a place of another color into the tripwire of a different group, the tripwire will change its color to red.

## Result
![Places colliding with tripwires](./imgs/places-colliding-with-tripwires.png)

## Description
To check if a place is colliding with a tripwire, we use the `circleLineCollision` function. This function checks if a circle is colliding with a line segment.

```javascript
// ./function-repo/circleLineCollision.js

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

  return distance <= radius;
}
```

Then, we basically just iterate over all the tripwires and check if any of the places are colliding with them.
