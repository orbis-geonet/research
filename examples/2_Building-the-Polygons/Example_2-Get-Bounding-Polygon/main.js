import { createExternalPolygon } from "./function-repo/createExternalPolygon.js";
import { createInternalPolygon } from "./function-repo/createInternalPolygon.js";
import { createMixedPolygon1 } from "./function-repo/createMixedPolygon1.js";
import { createMixedPolygon2 } from "./function-repo/createdMixedPolygon2.js";

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

  let polygon = [];

  const indentation1 = document.getElementById("indentation1").checked;
  const indentation2 = document.getElementById("indentation2").checked;

  if (indentation1 && indentation2) {
    polygon = createInternalPolygon(place1, place2);
  } else if (!indentation1 && !indentation2) {
    polygon = createExternalPolygon(place1, place2);
  } else if (indentation1 && !indentation2) {
    polygon = createMixedPolygon1(place1, place2);
  } else if (!indentation1 && indentation2) {
    polygon = createMixedPolygon2(place1, place2);
  }

  // Draw polygon
  ctx.beginPath();
  ctx.moveTo(polygon[0].x, polygon[0].y);
  for (let i = 1; i < polygon.length; i++) {
    ctx.lineTo(polygon[i].x, polygon[i].y);
  }
  ctx.closePath();
  ctx.strokeStyle = "red";
  ctx.stroke();

  requestAnimationFrame(update);
}

init();

init()
