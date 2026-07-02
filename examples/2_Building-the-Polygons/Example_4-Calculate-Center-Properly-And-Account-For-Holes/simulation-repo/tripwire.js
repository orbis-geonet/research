import { doLineSegmentsIntersect } from "../function-repo/doLineSegmentsIntersect.js";
import { Place } from "./place.js";

export class Tripwire {
  static id = 0;
  static tripwires = [];

  constructor(startPlace, endPlace, p1, p2, group, location) {
    this.id = Tripwire.id++;
    Tripwire.tripwires.push(this);

    this.startPlace = startPlace;
    this.endPlace = endPlace;

    this.p1 = p1;
    this.p2 = p2;
    this.group = group;
    this.location = location;

    this.isColliding = false;
  }

  update() {
    this.isColliding = false;
    this.checkCollision();
  }

  isCollidingWithTripwire(otherTripwire) {
    // Check if the two tripwires have the same start and end points
    if (
      (this.p1.x === otherTripwire.p1.x && this.p1.y === otherTripwire.p1.y &&
       this.p2.x === otherTripwire.p2.x && this.p2.y === otherTripwire.p2.y) ||
      (this.p1.x === otherTripwire.p2.x && this.p1.y === otherTripwire.p2.y &&
       this.p2.x === otherTripwire.p1.x && this.p2.y === otherTripwire.p1.y)
  ) {
      return false; // The tripwires are overlapping but not intersecting
  }

    const intersection =  doLineSegmentsIntersect(this.p1, this.p2, otherTripwire.p1, otherTripwire.p2);
    return intersection;
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
      ctx.strokeStyle = "rgba(255, 0, 0, 0.5)";
    } else {
      ctx.strokeStyle = "rgba(0, 0, 0, 0.3)";
    }

    ctx.stroke();
    ctx.strokeStyle = "black";
  }
}
