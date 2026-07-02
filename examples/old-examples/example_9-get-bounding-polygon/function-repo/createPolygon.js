import { calculateArcPoints } from './calculateArcPoints.js';

export function createPolygon(place1, place2, intersectionPoint, p1a, p1b, p2a, p2b) {
  var polygon = [p1a];

  // Discretize the arc from p1a to p1b
  // var startAngle1 = Math.atan2(p1a.y - place1.y, p1a.x - place1.x);
  // var endAngle1 = Math.atan2(p1b.y - place1.y, p1b.x - place1.x);
  // polygon = polygon.concat(calculateArcPoints(place1, place1.radius, startAngle1, endAngle1, 20));

  polygon.push(intersectionPoint);

  // Discretize the arc from p2b to p2a
  var startAngle2 = Math.atan2(p2b.y - place2.y, p2b.x - place2.x);
  var endAngle2 = Math.atan2(p2a.y - place2.y, p2a.x - place2.x);
  polygon = polygon.concat(calculateArcPoints(place2, place2.radius, startAngle2, endAngle2, 20));

  polygon.push(intersectionPoint);

  polygon.push(p1b);

  // This will close the polygon by adding the points on the arc from p1b to p1a
  var startAngle1 = Math.atan2(p1b.y - place1.y, p1b.x - place1.x);
  var endAngle1 = Math.atan2(p1a.y - place1.y, p1a.x - place1.x);
  polygon = polygon.concat(calculateArcPoints(place1, place1.radius, startAngle1, endAngle1, 20));

  return polygon;
}
