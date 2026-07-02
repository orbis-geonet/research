import { calculateExternalTangents } from "../function-repo/calculateExternalTangents.js";
import { createExternalPolygon } from "../function-repo/createExternalPolygon.js";

export class Place {
  static id = 0;
  static places = [];

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
    this.tripwires = [];

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

    // Calculate external tangents for close places
    this.tripwires = [];

    for (let place of this.closePlaces) {
      const { p1a, p1b, p2a, p2b } = calculateExternalTangents(this.x, this.y, this.radius, place.x, place.y, place.radius);
      this.tripwires.push({ to: place.id, p1: p1a, p2: p2a });
      this.tripwires.push({ to: place.id, p1: p1b, p2: p2b });
      this.tripwires.push({ to: this.id, p1: { x: this.x, y: this.y }, p2: { x: place.x, y: place.y } });
    }

    // Create external polygons
    this.polygons = [];

    for (let place of this.closePlaces) {
      this.polygons.push(createExternalPolygon(this, place));
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

    // Draw tripwires
    for (let tripwire of this.tripwires) {
      ctx.beginPath();
      ctx.moveTo(tripwire.p1.x, tripwire.p1.y);
      ctx.lineTo(tripwire.p2.x, tripwire.p2.y);

      ctx.strokeStyle = "rgba(0, 0, 0, 0.3)";
      ctx.stroke();
      ctx.strokeStyle = "black";
    }

    // Draw the merged polygons
    // if (this.polygon) {
    //   if (this.polygon.length > 0) {
    //     const polygon = this.polygon[0];

    //     ctx.beginPath();
    //     ctx.moveTo(polygon[0][0], polygon[0][1]);

    //     for (let i = 1; i < polygon.length; i++) {
    //       ctx.lineTo(polygon[i][0], polygon[i][1]);
    //     }

    //     ctx.closePath();
    //     ctx.fillStyle = "rgba(0, 0, 255, 0.1)";
    //     ctx.fill();
    //     ctx.fillStyle = "black";
    //   }
    // }
  }

  distanceToPlace(place) {
    return Math.sqrt((this.x - place.x) ** 2 + (this.y - place.y) ** 2) - this.radius - place.radius;
  }

  static generatePlaces(canvas, numPlaces, minRadius = 20, maxRadius = 50) {
    for (let i = 0; i < numPlaces; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const radius = Math.random() * (maxRadius - minRadius) + minRadius;

      new Place(x, y, radius);
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
