import { calculateArcPoints } from "./calculateArcPoints.js";

export function createInsidePolygon(place1, place2) {
  // One circle is completely inside the other, return the arc points of the larger place
  const largerPlace = place1.radius >= place2.radius ? place1 : place2;

  // Return the arc points for the larger circle (full circle if you want)
  const arcPoints = calculateArcPoints(largerPlace, largerPlace.radius, 0, 2 * Math.PI - 0.1, 100);
  const polygon = arcPoints.map(point => ({ x: parseFloat(point.x.toFixed(1)), y: parseFloat(point.y.toFixed(1)) }));

  // Check if x or y is NaN
  if (polygon.some(point => isNaN(point.x) || isNaN(point.y))) {
    console.log("NaN detected in createExternalPolygon1");
  }

  return polygon;
}