export class TripwireGroup {
  static id = 0;
  static tripwireGroups = [];

  connected = true;

  constructor(placeId, tripwires) {
    this.id = TripwireGroup.id++;
    TripwireGroup.tripwireGroups.push(this);

    this.placeId = placeId;
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

  draw(ctx) {
    // if (this.connected) {
    //   this.tripwires.forEach(tripwire => tripwire.draw(ctx));
    // }
  }
}