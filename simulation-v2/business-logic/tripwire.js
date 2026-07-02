import { GridModule } from "./grid/models/Grid.js";
import { handleGetPlaces } from "./places/handlers/handle-get-places.js";
import { Place } from "./places/models/Place.js";

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

  draw(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.p1.x, this.p1.y);
    ctx.lineTo(this.p2.x, this.p2.y);

    if (this.isColliding) {
      ctx.strokeStyle = rgba(255, 0, 0, 0.5);
    }

    ctx.stroke();
    ctx.strokeStyle = "black";
  }

  getDistanceToClosestPoint(place) {
    const dx = this.p2.x - this.p1.x;
    const dy = this.p2.y - this.p1.y;
    const lineLengthSquared = dx * dx + dy * dy;

    if (lineLengthSquared === 0) return;

    const u = ((place.x - this.p1.x) * dx + (place.y - this.p1.y) * dy) / lineLengthSquared;

    let closestX, closestY;

    if (u >= 0 && u <= 1) {
        // Closest point is within the line segment
        closestX = this.p1.x + u * dx;
        closestY = this.p1.y + u * dy;
    } else {
        // Closest point is outside the line segment, calculate distance to endpoints
        const distanceToP1 = Math.sqrt((place.x - this.p1.x) ** 2 + (place.y - this.p1.y) ** 2);
        const distanceToP2 = Math.sqrt((place.x - this.p2.x) ** 2 + (place.y - this.p2.y) ** 2);
        return Math.min(distanceToP1, distanceToP2);
    }

    // Calculate the perpendicular (right-angled) distance from place to the line
    return Math.sqrt((place.x - closestX) ** 2 + (place.y - closestY) ** 2);
  }

  getSideOfLine(place) {
    const crossProduct = (this.p2.x - this.p1.x) * (place.y - this.p1.y) - (this.p2.y - this.p1.y) * (place.x - this.p1.x);
    return crossProduct > 0 ? 'left' : (crossProduct < 0 ? 'right' : 'on the line');
  }

  changePlaceRadius(place, distanceToClosest) {
    const newRadius = place.radius + (distanceToClosest - place.radius);
    const currentTime = Math.min(this.startPlace.lastCheckinTime, this.endPlace.lastCheckinTime);
    place.radius = newRadius;
    place.lastCheckinTime = currentTime;
    place.lastCheckinRadius = newRadius;
  }

  checkCollision() {
    // Check if a tripwire collides with a place from a different group
    for (let place of handleGetPlaces()) {
      if (place.group === this.group) {
        continue;
      }

      const distanceToClosest = this.getDistanceToClosestPoint(place);
      const side = this.getSideOfLine(place);

      if (this.location === 'center') {
        if (distanceToClosest < place.radius) {
          this.isColliding = true;
        }
      }

      if (this.location === 'first') {
        if (side === 'left' && distanceToClosest <= this.startPlace.radius + 1) {
          if (place.lastCheckinTime > this.startPlace.lastCheckinTime && place.lastCheckinTime > this.endPlace.lastCheckinTime) {
            this.isColliding = true;
          } else if (place.lastCheckinTime < this.startPlace.lastCheckinTime || place.lastCheckinTime < this.endPlace.lastCheckinTime) {
            Place.places = Place.places.filter(p => p.id !== place.id);
            GridModule.getInstance().removePlaceFromGrid(place);
          }
        } else if (side === 'right' && distanceToClosest <= place.radius + 1) {
          if (place.lastCheckinTime > this.startPlace.lastCheckinTime && place.lastCheckinTime > this.endPlace.lastCheckinTime) {
            this.isColliding = true;
          } else if (place.radius + 1 > distanceToClosest) {
            this.changePlaceRadius(place, distanceToClosest);
          }
        }
      }

      if (this.location === 'second') {
        if (side === 'right' && distanceToClosest <= this.endPlace.radius + 1) {
          if (place.lastCheckinTime > this.startPlace.lastCheckinTime && place.lastCheckinTime > this.endPlace.lastCheckinTime) {
            this.isColliding = true;
          } else if (place.lastCheckinTime < this.startPlace.lastCheckinTime || place.lastCheckinTime < this.endPlace.lastCheckinTime) {
            Place.places = Place.places.filter(p => p.id !== place.id);
            GridModule.getInstance().removePlaceFromGrid(place);
          }
        } else if (side === 'left' && distanceToClosest <= place.radius + 1) {
          if (place.lastCheckinTime > this.startPlace.lastCheckinTime && place.lastCheckinTime > this.endPlace.lastCheckinTime) {
            this.isColliding = true;
          } else if (place.radius + 1 > distanceToClosest) {
            this.changePlaceRadius(place, distanceToClosest);
          }
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
