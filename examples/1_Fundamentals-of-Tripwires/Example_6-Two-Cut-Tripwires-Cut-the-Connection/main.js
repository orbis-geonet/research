import { Place } from "./simulation-repo/place.js";
import { TripwireGroup } from "./simulation-repo/tripwire-group.js";

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
  TripwireGroup.tripwireGroups = [];

  Place.places.forEach((place) => place.update());
  TripwireGroup.tripwireGroups.forEach((tripwireGroup) => tripwireGroup.update());

  draw();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  Place.places.forEach((place) => place.draw(ctx));
  TripwireGroup.tripwireGroups.forEach((tripwireGroup) => tripwireGroup.draw(ctx));

  requestAnimationFrame(update);
}

init()
