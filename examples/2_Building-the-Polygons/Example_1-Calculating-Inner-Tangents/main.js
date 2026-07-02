import { calculateInternalTangents } from "./function-repo/calculateInternalTangents.js";
import { calculateExternalTangents } from "./function-repo/calculateExternalTangents.js";
import { drawTangents } from "./function-repo/drawTangents.js";
import { drawCenterLine } from "./function-repo/drawCenterLine.js";

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

  // Calculate external tangents
  const internal = document.getElementById("internal").checked;
  const external = document.getElementById("external").checked;

  if (internal) {
    var { p1a, p1b, p2a, p2b } = calculateInternalTangents(place1.x, place1.y, place1.radius, place2.x, place2.y, place2.radius);
  } else if (external) {
    var { p1a, p1b, p2a, p2b } = calculateExternalTangents(place1.x, place1.y, place1.radius, place2.x, place2.y, place2.radius);
  }

  // Draw the points
  ctx.beginPath();
  ctx.arc(p1a.x, p1a.y, 5, 0, 2 * Math.PI);
  ctx.fillStyle = "red";
  ctx.fill();

  ctx.beginPath();
  ctx.arc(p1b.x, p1b.y, 5, 0, 2 * Math.PI);
  ctx.fillStyle = "red";
  ctx.fill();

  ctx.beginPath();
  ctx.arc(p2a.x, p2a.y, 5, 0, 2 * Math.PI);
  ctx.fillStyle = "red";
  ctx.fill();

  ctx.beginPath();
  ctx.arc(p2b.x, p2b.y, 5, 0, 2 * Math.PI);
  ctx.fillStyle = "red";
  ctx.fill();

  // Draw the tangents
  drawTangents(ctx, p1a, p1b, p2a, p2b);

  // Draw the center line
  drawCenterLine(ctx, place1.x, place1.y, place2.x, place2.y);

  requestAnimationFrame(update);
}

init()
