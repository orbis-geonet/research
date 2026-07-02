import { Place } from "./place.js";

export class Tripwire {
  static id = 0;
  static tripwires = [];

  constructor(startPlace, endPlace, p1, p2, group) {
    this.id = Tripwire.id++;
    Tripwire.tripwires.push(this);

    this.startPlace = startPlace;
    this.endPlace = endPlace;

    this.p1 = p1;
    this.p2 = p2;
    this.group = group;

    this.isColliding = false;
  }

  update() {
    this.isColliding = false;
    this.checkCollision();
  }

  checkCollision() {
    // Check if a tripwire collides with a place from a different group
    for (let place of Place.places) {
      if (place.group !== this.group && place.id !== this.endPlace.id) {
        // Calculate distance from place to the line segment
        const dx = this.p2.x - this.p1.x;
        const dy = this.p2.y - this.p1.y;
        const lineLength = Math.sqrt(dx * dx + dy * dy);
        const u = ((place.x - this.p1.x) * dx + (place.y - this.p1.y) * dy) / (lineLength * lineLength);
  
        // Closest point on the line segment to the place
        const closestX = this.p1.x + u * dx;
        const closestY = this.p1.y + u * dy;
  
        let distanceToClosest;
  
        // Check if the closest point is within the line segment
        if (u >= 0 && u <= 1) {
          distanceToClosest = Math.sqrt((place.x - closestX) ** 2 + (place.y - closestY) ** 2);
        } else {
          // If closest point is outside the line segment, calculate distance to endpoints
          const distanceToP1 = Math.sqrt((place.x - this.p1.x) ** 2 + (place.y - this.p1.y) ** 2);
          const distanceToP2 = Math.sqrt((place.x - this.p2.x) ** 2 + (place.y - this.p2.y) ** 2);
          distanceToClosest = Math.min(distanceToP1, distanceToP2);
        }
  
        // Check for collision
        if (distanceToClosest < place.radius) {
          this.isColliding = true;
        }
      }
    }
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.p1.x, this.p1.y);
    ctx.lineTo(this.p2.x, this.p2.y);

    if (this.isColliding) {
      ctx.strokeStyle = "red";
    } else {
      ctx.strokeStyle = "lightgreen";
    }

    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
  }
}
