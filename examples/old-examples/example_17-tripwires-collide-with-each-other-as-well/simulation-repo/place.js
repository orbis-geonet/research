import { calculateExternalTangents } from "../function-repo/calculateExternalTangents.js";
import { createExternalPolygon } from "../function-repo/createExternalPolygon.js";
import { createMixedPolygon1 } from "../function-repo/createMixedPolygon1.js";
import { createMixedPolygon2 } from "../function-repo/createMixedPolygon2.js";

import { TripwireGroup } from "../simulation-repo/tripwire-group.js";
import { Tripwire } from "../simulation-repo/tripwire.js";

export class Place {
  static id = 0;
  static places = [];

  static distanceThreshold = 60;

  constructor(x, y, radius, group) {
    this.id = Place.id++;
    Place.places.push(this);

    this.x = x;
    this.y = y;
    this.radius = radius;
    this.group = group;

    this.isHovered = false;

    this.closePlaces = [];

    this.polygonTypes = [];
    this.polygons = [];
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
      if (place.group !== this.group) {
        continue;
      }

      const { p1a, p1b, p2a, p2b } = calculateExternalTangents(this.x, this.y, this.radius, place.x, place.y, place.radius);
      new TripwireGroup(this.id, this.group, [
        new Tripwire(this, place, p1b, p2b, this.group, "first"),
        new Tripwire(this, place, p1a, p2a, this.group, "second"),
        new Tripwire(place, this, { x: place.x, y: place.y }, { x: this.x, y: this.y }, this.group, "center")
      ]);
    }
  }

  update2() {
    // Compute polygon types
    const tripwireStates = TripwireGroup.getState(this.id);

    // Create external polygons
    this.polygons = [];

    for (let place of this.closePlaces) {
      const tripwireGroup = tripwireStates.find(tripwireGroup => tripwireGroup.toPlace === place.id);

      if (tripwireGroup.state === "connected") {
        this.polygons.push(createExternalPolygon(this, place));
      } else if (tripwireGroup.state === "internal1") {
        this.polygons.push(createMixedPolygon1(this, place));
      } else if (tripwireGroup.state === "internal2") {
        this.polygons.push(createMixedPolygon2(this, place));
      }
    }

    // Merge polygons
    if (this.polygons.length === 0) {
      this.polygon = null;
    } else if (this.polygons.length === 1) {
      this.polygon = this.polygons.map(polygon => polygon.map(point => [point.x, point.y]));
    } else if (this.polygons.length > 1) {
      const formattedPolygons = this.polygons.map(polygon => [polygon.map(point => [point.x, point.y])]);
      this.polygon = polygonClipping.union(...formattedPolygons)[0];
    }
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.stroke();

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

  static generatePlaces(canvas, numPlaces, options = {}) {
    const { minRadius = 20, maxRadius = 50, numGroups = 2 } = options;
    const places = [];

    // Function to check if two circles overlap
    function circlesOverlap(circle1, circle2) {
        const dx = circle1.x - circle2.x;
        const dy = circle1.y - circle2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < circle1.radius + circle2.radius;
    }

    // Function to generate a random non-overlapping circle
    function generateNonOverlappingCircle() {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = Math.random() * (maxRadius - minRadius) + minRadius;
        const group = Math.floor(Math.random() * numGroups);
        const newCircle = { x, y, radius };

        // Check if the new circle overlaps with any existing circles
        for (const place of places) {
            if (circlesOverlap(newCircle, place)) {
                // If overlap is detected, generate a new circle recursively
                return generateNonOverlappingCircle();
            }
        }

        // If no overlap is detected, add the circle to the list of places
        places.push(newCircle);
        new Place(x, y, radius, group);
    }

    // Generate non-overlapping circles
    for (let i = 0; i < numPlaces; i++) {
        generateNonOverlappingCircle();
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

function convertPolygonFormat(polygons) {
  return polygons.map(polygon => polygon.map(point => [point.x, point.y]));
}
