import { Place } from "./simulation-repo/place.js";
import { Polygons } from "./simulation-repo/polygons.js";
import { TripwireGroup } from "./simulation-repo/tripwire-group.js";

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
const iterations = document.getElementById("iterations");
const iterationsValue = document.getElementById("iterations-value");

{/* <label for="iterations">Iterations:</label> */}
{/* <input style="width: 400px;" type="range" id="iterations" name="iterations" min="1" max="20" value="2"> */}
{/* <span id="iterations-value">10</span> */}




// Generate places
Place.generatePlaces(canvas, 5);

function init() {
  iterations.oninput = function() {
    iterationsValue.innerHTML = this.value;
  }

  iterations.onchange = function() {
    Polygons.getInstance().iterations = parseInt(this.value);
  }

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
