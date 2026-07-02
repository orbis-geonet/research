# Calculating Inner Tangents
If you start the index.html using a live server, you can see two circles. You can drag and drop the circles to see how the tangents adapt. With the radio buttons at the top, you can switch between the external tangents we calculated in the previous examples and the inner tangents we calculate in this example.

## Result
![External tangents](./imgs/external-tangents.png)
![Internal tangents](./imgs/internal-tangents.png)

## Description
In section 1 (Fundamentals of Tripwires), we saw the tripwires and that they can collide with other places / tripwires. The goal in this section is to get some polygons, so the outer shape that surrounds two places.

If no tripwires are broken, we can use the external tangents to form the polygon. If one of the outer tripwires is broken, we will use the outer tangent that is not broken and the inner tangent to form the polygon (we'll see this in the next examples).

Right now, we only have to worry about the code to calculate these inner tangents. Similar to the function for the external tangents, it calculates the points that form the inner tangents, when connected.

```javascript
export function calculateInternalTangents(x1, y1, r1, x2, y2, r2) {
  // Calculate the distance between the centers of the circles
  let distCenters = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  
  // Calculate the radius of the auxiliary circle around c2
  let r3 = r1 + r2;
  
  // Calculate the angle from the x-axis to the line connecting the centers of the circles
  let angle = Math.atan2(y2 - y1, x2 - x1);
  
  // Calculate the angle of the tangent lines
  let tangentAngle = Math.asin(r3 / distCenters) - Math.PI / 2;
  
  // Calculate the tangent points on circle c1
  let t1x = x1 + r1 * Math.cos(angle + tangentAngle);
  let t1y = y1 + r1 * Math.sin(angle + tangentAngle);
  let t2x = x1 + r1 * Math.cos(angle - tangentAngle);
  let t2y = y1 + r1 * Math.sin(angle - tangentAngle);
  
  // Calculate the tangent points on circle c2
  let s1x = x2 + r2 * Math.cos(angle + tangentAngle + Math.PI);
  let s1y = y2 + r2 * Math.sin(angle + tangentAngle + Math.PI);
  let s2x = x2 + r2 * Math.cos(angle - tangentAngle + Math.PI);
  let s2y = y2 + r2 * Math.sin(angle - tangentAngle + Math.PI);
  
  return {
    p1a: { x: t1x, y: t1y },
    p1b: { x: t2x, y: t2y },
    p2a: { x: s1x, y: s1y },
    p2b: { x: s2x, y: s2y },
  }
}
```
