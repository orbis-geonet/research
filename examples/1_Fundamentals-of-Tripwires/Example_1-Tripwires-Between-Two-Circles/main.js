import { calculateExternalTangents } from "./function-repo/calculateExternalTangents.js";
import { drawExternalTangents } from "./function-repo/drawExternalTangents.js";
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
  var { p1a, p1b, p2a, p2b } = calculateExternalTangents(place1.x, place1.y, place1.radius, place2.x, place2.y, place2.radius);

  // Draw external tangents
  drawExternalTangents(ctx, p1a, p1b, p2a, p2b);

  // Draw the center line
  drawCenterLine(ctx, place1.x, place1.y, place2.x, place2.y);

  requestAnimationFrame(update);
}

init()
