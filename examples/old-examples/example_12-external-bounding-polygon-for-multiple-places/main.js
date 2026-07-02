import { Place } from "./simulation-repo/place.js";
import { Polygons } from "./simulation-repo/polygons.js";

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
  Polygons.getInstance().update();

  draw();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  Place.places.forEach((place) => place.draw(ctx));
  Polygons.getInstance().draw(ctx);

  requestAnimationFrame(update);
}

init()
