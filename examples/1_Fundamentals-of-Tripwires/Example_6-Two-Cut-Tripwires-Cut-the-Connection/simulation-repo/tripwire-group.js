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
}