import { calculateInternalTangents } from "./function-repo/calculateInternalTangents.js";
import { findIntersection } from "./function-repo/findIntersection.js";
import { createPolygon } from "./function-repo/createPolygon.js";

import { Place } from "./simulation-repo/place.js";
import { smoothPolygon } from "./function-repo/smoothPolygon.js";

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

  // Calculate tangent points and intersection point
  var { p1a, p1b, p2a, p2b } = calculateInternalTangents(place1.x, place1.y, place1.radius, place2.x, place2.y, place2.radius);
  var intersectionPoint = findIntersection(p1b, p2b, p1a, p2a);

  // Create the polygon array of points
  var polygon = createPolygon(place1, place2, intersectionPoint, p1a, p1b, p2a, p2b);

  var smoothenedPolygon = smoothPolygon(polygon);

  // Draw the polygon
  ctx.beginPath();
  ctx.moveTo(smoothenedPolygon[0].x, smoothenedPolygon[0].y); // Move to the first point
  smoothenedPolygon.forEach(point => {
    ctx.lineTo(point.x, point.y); // Draw lines to each point
  });

  ctx.closePath(); // Close the path to complete the polygon
  ctx.strokeStyle = "red";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.strokeStyle = "black";
  ctx.lineWidth = 1;

  // Draw each point of the smoothened polygon
  // ctx.fillStyle = "blue";
  // smoothenedPolygon.forEach(point => {
  //   if (point.y > 99 && point.y < 101) {
  //     // console.log(point.x, point.y)
  //   }

  //   ctx.beginPath();
  //   ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
  //   ctx.fill();
  // });
  // ctx.fillStyle = "black";

  requestAnimationFrame(update);
}

init();

init()
