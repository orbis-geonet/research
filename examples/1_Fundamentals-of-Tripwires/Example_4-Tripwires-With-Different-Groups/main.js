import { Place } from "./simulation-repo/place.js";

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
  Place.places.forEach((place) => place.update());

  draw();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw places
  Place.places.forEach((place) => place.draw(ctx));

  requestAnimationFrame(update);
}

init()
