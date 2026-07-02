import { doLineSegmentsIntersect } from '../function-repo/doLineSegmentsIntersect.js';

export class TripwireGroup {
  static id = 0;
  static tripwireGroups = [];

  connected = true;

  constructor(placeId, group, tripwires) {
    this.id = TripwireGroup.id++;
    TripwireGroup.tripwireGroups.push(this);

    this.placeId = placeId;
    this.group = group;
    this.tripwires = tripwires;
  }

  static getState(placeId) {
    let states = [];

    TripwireGroup.tripwireGroups.forEach(tripwireGroup => {
      if (tripwireGroup.placeId === placeId) {
        const tripwireGroupId = tripwireGroup.id;
        const toPlace = tripwireGroup.tripwires[0].endPlace.id;
        let state = "connected";

        if (!tripwireGroup.connected) {
          state = "broken";
          states.push({ tripwireGroupId, toPlace, state });
          return;
        }

        tripwireGroup.tripwires.forEach(tripwire => {
          const type = tripwire.location;
          const collision = tripwire.isColliding;

          if (tripwire.location === "center" && tripwire.isColliding) {
            state = "broken";
          }

          if (tripwire.location === "first" && tripwire.isColliding) {
            state = "internal1";
          }

          if (tripwire.location === "second" && tripwire.isColliding) {
            state = "internal2";
          }
        });

        states.push({ tripwireGroupId, toPlace, state });
      }
    });

    return states;
  }

  update() {
    this.tripwires.forEach(tripwire => tripwire.update());

    let brokenTripwires = 0;

    this.tripwires.forEach(tripwire => {
      if (tripwire.isColliding) {
        brokenTripwires++;
      }
    })

    this.connected = true;

    if (brokenTripwires >= 2) {
      this.connected = false;
    }
  }

  static checkCollisions() {
    // Go through each tripwire group and check for collisions with other tripwire groups
    for (let tripwireGroup of TripwireGroup.tripwireGroups) {
      for (let otherTripwireGroup of TripwireGroup.tripwireGroups) {
        if (tripwireGroup === otherTripwireGroup) {
          continue;
        }


        if (tripwireGroup.group === otherTripwireGroup.group) {
          continue;
        }

        for (let tripwire of tripwireGroup.tripwires) {
          for (let otherTripwire of otherTripwireGroup.tripwires) {
            const collision = doLineSegmentsIntersect(tripwire.p1, tripwire.p2, otherTripwire.p1, otherTripwire.p2);

            if (collision) {
              if (tripwire.group > otherTripwire.group) {
                tripwire.isColliding = true;
              } else {
                otherTripwire.isColliding = true;
              }
            }
            }
        }
      }
    }
  }

  draw(ctx) {
    // if (this.connected) {
    //   this.tripwires.forEach(tripwire => tripwire.draw(ctx));
    // }
  }
}