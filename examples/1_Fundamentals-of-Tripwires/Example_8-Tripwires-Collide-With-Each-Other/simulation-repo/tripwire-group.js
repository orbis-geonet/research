import { doLineSegmentsIntersect } from '../function-repo/doLineSegmentsIntersect.js';

export class TripwireGroup {
  static id = 0;
  static tripwireGroups = [];

  connected = true;

  constructor(tripwires) {
    this.id = TripwireGroup.id++;
    TripwireGroup.tripwireGroups.push(this);

    this.tripwires = tripwires;
  }

  update() {
    // Update each individual tripwire of this group
    this.tripwires.forEach(tripwire => tripwire.update());

    // Cound how many tripwires are broken
    let brokenTripwires = 0;
    this.tripwires.forEach(tripwire => {
      if (tripwire.isColliding) {
        brokenTripwires++;
      }
    })

    // If two tripwires are broken, the connection is lost
    this.connected = true;
    if (brokenTripwires >= 2) {
      this.connected = false;
    }

    // Additionally, you could check if the center tripwire is broken
    // and cut the connection in that case as well
  }

  draw(ctx) {
    if (this.connected) {
      this.tripwires.forEach(tripwire => tripwire.draw(ctx));
    }
  }

  static checkCollisions() {
    // Go through each tripwire group and check for collisions with other tripwire groups
    for (let tripwireGroup of TripwireGroup.tripwireGroups) {
      for (let otherTripwireGroup of TripwireGroup.tripwireGroups) {
        // If it is the same tripwire group, skip
        if (tripwireGroup === otherTripwireGroup) {
          continue;
        }

        // If the tripwires are from the same group, they can't collide
        if (tripwireGroup.tripwires[0].group === otherTripwireGroup.tripwires[0].group) {
          continue;
        }

        for (let tripwire of tripwireGroup.tripwires) {
          for (let otherTripwire of otherTripwireGroup.tripwires) {
            const collision = doLineSegmentsIntersect(tripwire.p1, tripwire.p2, otherTripwire.p1, otherTripwire.p2);
            
            if (collision) {
              // Here you can implement an if condition to break the older connection.
              // For simplicity, we will break both connections.
              tripwire.isColliding = true;
              otherTripwire.isColliding = true;
            }
            }
        }
      }
    }
  }
}