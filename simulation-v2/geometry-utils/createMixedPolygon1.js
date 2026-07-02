import { calculateExternalTangents } from './calculateExternalTangents.js';
import { calculateInternalTangents } from './calculateInternalTangents.js'
import { findIntersection } from './findIntersection.js';
import { calculateArcPoints } from './calculateArcPoints.js';
import { circlesOverlap } from './circlesOverlap.js';

export function createMixedPolygon1(place1, place2) {
  const { isOverlapping, intersectionPoints } = circlesOverlap(place1, place2);

  const { p1a, p1b, p2a, p2b } = calculateExternalTangents(place1.x, place1.y, place1.radius, place2.x, place2.y, place2.radius);
  const { p1a: p1a2, p1b: p1b2, p2a: p2a2, p2b: p2b2 } = calculateInternalTangents(place2.x, place2.y, place2.radius, place1.x, place1.y, place1.radius);
  const intersectionPoint = findIntersection(p1b2, p2b2, p1a2, p2a2);

  let polygon = [];
  if (isOverlapping) {
    // Angle from center of place1 to intersection point
    const angle1 = Math.atan2(intersectionPoints[0].y - place1.y, intersectionPoints[0].x - place1.x);

    // Angle from center of place2 to intersection point
    const angle3 = Math.atan2(intersectionPoints[0].y - place2.y, intersectionPoints[0].x - place2.x);

    const arcPoints2 = calculateArcPoints({ x: place2.x, y: place2.y }, place2.radius, angle3, Math.atan2(p2a.y - place2.y, p2a.x - place2.x), 20);
    const arcPoints1 = calculateArcPoints({ x: place1.x, y: place1.y }, place1.radius, Math.atan2(p1a.y - place1.y, p1a.x - place1.x), angle1, 20);

    polygon.push(...arcPoints2);
    polygon.push(...arcPoints1);
  } else {
    const arcPoints1 = calculateArcPoints({ x: place1.x, y: place1.y }, place1.radius, Math.atan2(p1a.y - place1.y, p1a.x - place1.x), Math.atan2(p2a2.y - place1.y, p2a2.x - place1.x), 20);
    const arcPoints2 = calculateArcPoints({ x: place2.x, y: place2.y }, place2.radius, Math.atan2(p1b2.y - place2.y, p1b2.x - place2.x), Math.atan2(p2a.y - place2.y, p2a.x - place2.x), 20);

    polygon.push(...arcPoints1);
    polygon.push(intersectionPoint);
    polygon.push(...arcPoints2);
  }

  polygon = polygon.map(point => ({ x: parseFloat(point.x.toFixed(1)), y: parseFloat(point.y.toFixed(1)) }));

  return polygon;
}
