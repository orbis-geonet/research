export class Place {
  static id = 0;
  static places = [];

  constructor(x, y, radius, group) {
    this.id = Place.id++;
    Place.places.push(this);

    this.x = x;
    this.y = y;
    this.radius = radius;
    this.group = group;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.stroke();
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
}
