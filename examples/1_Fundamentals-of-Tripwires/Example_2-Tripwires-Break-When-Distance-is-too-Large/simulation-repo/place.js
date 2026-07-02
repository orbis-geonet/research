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
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.stroke();

    if (this.isHovered) {
      // Draw a circle with the same radius plus the distanceThreshold
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
