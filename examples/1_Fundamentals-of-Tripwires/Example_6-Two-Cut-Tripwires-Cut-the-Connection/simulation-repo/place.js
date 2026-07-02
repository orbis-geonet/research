import { calculateExternalTangents } from "../function-repo/calculateExternalTangents.js";
import { TripwireGroup } from "./tripwire-group.js";
import { Tripwire } from "./tripwire.js";

export class Place {
  static id = 0;
  static places = [];

  static groupColors = ["rgba(255, 0, 0, 0.5)", "rgba(0, 0, 255, 0.5)", "rgba(0, 128, 0, 0.5)", "rgba(255, 165, 0, 0.5)", "rgba(128, 0, 128, 0.5)", "rgba(165, 42, 42, 0.5)", "rgba(255, 192, 203, 0.5)", "rgba(128, 128, 128, 0.5)", "rgba(0, 0, 0, 0.5)", "rgba(255, 255, 0, 0.5)"];
  static distanceThreshold = 40;

  constructor(x, y, radius, group) {
    this.id = Place.id++;
    Place.places.push(this);

    this.x = x;
    this.y = y;
    this.radius = radius;
    this.group = group;

    this.isHovered = false;

    this.closePlaces = [];
  }

  update() {
    // Check which places are close to this place
    this.closePlaces = [];

    for (let place of Place.places) {
      if (place !== this && place.group === this.group && this.distanceToPlace(place) < Place.distanceThreshold) {
        this.closePlaces.push(place);
      }
    }

    // Calculate all tripwires
    for (let place of this.closePlaces) {
      const { p1a, p1b, p2a, p2b } = calculateExternalTangents(this.x, this.y, this.radius, place.x, place.y, place.radius);
      new TripwireGroup([
        new Tripwire(this, place, p1a, p2a, this.group),
        new Tripwire(this, place, p1b, p2b, this.group),
        new Tripwire(place, this, { x: place.x, y: place.y }, { x: this.x, y: this.y }, this.group)
      ]);
    }
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);

    ctx.stroke();

    ctx.fillStyle = Place.groupColors[this.group];
    ctx.fill();
    ctx.fillStyle = "black";

    // Draw a circle with the same radius plus the distanceThreshold
    if (this.isHovered) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius + Place.distanceThreshold, 0, 2 * Math.PI);

      ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";
      ctx.stroke();
      ctx.strokeStyle = "black";
    }
  }

  distanceToPlace(place) {
    return Math.sqrt((this.x - place.x) ** 2 + (this.y - place.y) ** 2) - this.radius - place.radius;
  }

  static generatePlaces(canvas, numPlaces, minRadius = 20, maxRadius = 50, numGroups = 2){
    for (let i = 0; i < numPlaces; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const radius = Math.random() * (maxRadius - minRadius) + minRadius;
      const group = Math.floor(Math.random() * numGroups);

      new Place(x, y, radius, group);
    }
  }

  static initDragAndDrop(canvas) {
    let selectedPlace = null;
    let offsetX = 0;
    let offsetY = 0;

    canvas.addEventListener("mousedown", function (e) {
      const x = e.offsetX;
      const y = e.offsetY;

      for (let place of Place.places) {
        if (Math.sqrt((x - place.x) ** 2 + (y - place.y) ** 2) < place.radius) {
          selectedPlace = place;
          offsetX = x - place.x;
          offsetY = y - place.y;
          break;
        }
      }
    });

    canvas.addEventListener("mousemove", function (e) {
      if (selectedPlace) {
        selectedPlace.x = e.offsetX - offsetX;
        selectedPlace.y = e.offsetY - offsetY;
      }
    });

    canvas.addEventListener("mouseup", function (e) {
      selectedPlace = null;
    });
  }

  static initHover(canvas) {
    canvas.addEventListener("mousemove", function (e) {
      const x = e.offsetX;
      const y = e.offsetY;
      let hovered = false;
  
      for (let place of Place.places) {
        if (Math.sqrt((x - place.x) ** 2 + (y - place.y) ** 2) < place.radius) {
          place.isHovered = true;
          hovered = true;
        } else {
          place.isHovered = false; // Reset isHovered for places not hovered over
        }
      }
  
      if (!hovered) {
        // If no place is hovered over, reset all places
        for (let place of Place.places) {
          place.isHovered = false;
        }
      }
    });
  }
}
