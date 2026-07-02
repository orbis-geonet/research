import { Place } from "./simulation-repo/place.js";
import { Polygons } from "./simulation-repo/polygons.js";
import { TripwireGroup } from "./simulation-repo/tripwire-group.js";

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

function init() {
  Place.generatePlaces(canvas, 20, { minRadius: 20, maxRadius: 35, numGroups: 2 });

  Place.initDragAndDrop(canvas);
  Place.initHover(canvas);

  update();
}

function update() {
  TripwireGroup.tripwireGroups = [];

  Place.places.forEach((place) => place.update());
  TripwireGroup.tripwireGroups.forEach((tripwireGroup) => tripwireGroup.update());
  TripwireGroup.checkCollisions();
  Place.places.forEach((place) => place.update2());
  Polygons.getInstance().update();

  draw();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  Polygons.getInstance().draw(ctx);
  Place.places.forEach((place) => place.draw(ctx));
  TripwireGroup.tripwireGroups.forEach((tripwireGroup) => tripwireGroup.draw(ctx));

  requestAnimationFrame(update);
}

init()
