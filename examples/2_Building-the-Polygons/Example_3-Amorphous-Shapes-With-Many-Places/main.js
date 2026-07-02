import { Place } from "./simulation-repo/place.js";
import { Polygons } from "./simulation-repo/polygons.js";
import { TripwireGroup } from "./simulation-repo/tripwire-group.js";

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

const numOfPlacesInput = document.getElementById("numOfPlaces");
const minRadiusInput = document.getElementById("minRadius");
const maxRadiusInput = document.getElementById("maxRadius");
const numOfGroupsInput = document.getElementById("numOfGroups");

const generateButton = document.getElementById("generate");

// Generate places
// Place.generatePlaces(canvas, 100, { minRadius: 3, maxRadius: 15, numGroups: 5 });

function init() {
  // Generate places
  generateButton.addEventListener("click", () => {
    Place.places = [];
    Place.id = 0;
  
    TripwireGroup.tripwireGroups = [];
  
    Polygons.getInstance().polygons = [];

    Place.generatePlaces(canvas, parseInt(numOfPlacesInput.value), {
      minRadius: parseInt(minRadiusInput.value),
      maxRadius: parseInt(maxRadiusInput.value),
      numGroups: parseInt(numOfGroupsInput.value)
    });

    init();
  });

  Place.initDragAndDrop(canvas);
  Place.initHover(canvas);

  update();
}

function update() {
  TripwireGroup.tripwireGroups = [];

  Place.places.forEach((place) => place.update());
  TripwireGroup.tripwireGroups.forEach((tripwireGroup) => tripwireGroup.update());
  Place.places.forEach((place) => place.update2());
  Polygons.getInstance().update();

  draw();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  Place.places.forEach((place) => place.draw(ctx));
  TripwireGroup.tripwireGroups.forEach((tripwireGroup) => tripwireGroup.draw(ctx));
  Polygons.getInstance().draw(ctx);

  requestAnimationFrame(update);
}

init()
