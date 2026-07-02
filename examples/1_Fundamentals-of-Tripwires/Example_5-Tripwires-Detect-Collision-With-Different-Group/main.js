import { Place } from "./simulation-repo/place.js";
import { Tripwire } from "./simulation-repo/tripwire.js";

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

// Generate places
Place.generatePlaces(canvas, 5);

function init() {
  Place.initDragAndDrop(canvas);
  Place.initHover(canvas);

  update();
}

function update() {
  Tripwire.tripwires = [];

  Place.places.forEach((place) => place.update());
  Tripwire.tripwires.forEach((tripwire) => tripwire.update());

  draw();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  Place.places.forEach((place) => place.draw(ctx));
  Tripwire.tripwires.forEach((tripwire) => tripwire.draw(ctx));

  requestAnimationFrame(update);
}

init()
