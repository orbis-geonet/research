import { calculateInternalTangents } from "./function-repo/calculateInternalTangents.js";
import { findIntersection } from "./function-repo/findIntersection.js";
import { createPolygon } from "./function-repo/createPolygon.js";

import { Place } from "./simulation-repo/place.js";

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

// Create two places
const place1 = new Place(100, 100, 50, 0);
const place2 = new Place(250, 100, 30, 0);

function init() {
  Place.initDragAndDrop(canvas);

  update();
}

function update() {
  draw();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw circles
  place1.draw(ctx);
  place2.draw(ctx);

  // Calculate tangent points and intersection point
  var { p1a, p1b, p2a, p2b } = calculateInternalTangents(place1.x, place1.y, place1.radius, place2.x, place2.y, place2.radius);
  var intersectionPoint = findIntersection(p1b, p2b, p1a, p2a);

  // Create the polygon array of points
  var polygon = createPolygon(place1, place2, intersectionPoint, p1a, p1b, p2a, p2b);

  // Draw the polygon
  ctx.beginPath();
  ctx.moveTo(polygon[0].x, polygon[0].y); // Move to the first point
  polygon.forEach(point => {
    ctx.lineTo(point.x, point.y); // Draw lines to each point
  });
  ctx.closePath(); // Close the path to complete the polygon

  // Stroke or fill the polygon as needed
  ctx.strokeStyle = "red";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.strokeStyle = "black";
  ctx.lineWidth = 1;

  requestAnimationFrame(update);
}

init();

init()
