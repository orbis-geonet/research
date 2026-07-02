import { calculateExternalTangents } from '../../../geometry-utils/calculateExternalTangents.js';

import { Tripwire } from '../../tripwire.js';
import { TripwireGroup } from '../../tripwire-group.js';
import { isCircleInside } from '../../../geometry-utils/isCircleInside.js';

export async function handleComputeTripwires({ place }) {
  place.closePlaces.forEach(closePlace => {
    if (place.group !== closePlace.group) {
      return;
    }

    // For security, that tripwires between to places are not duplicated
    let hasTripwire = false;
    for (let tripwire of Tripwire.tripwires) {
      if (tripwire.startPlace === closePlace && tripwire.endPlace === place) {
        hasTripwire = true;
        break;
      } else if (tripwire.startPlace === place && tripwire.endPlace === closePlace) {
        hasTripwire = true;
        break;
      }
    }

    if (hasTripwire) {
      return;
    }

    // Don't create tripwires if one place is inside the other
    const { isPlace1InsidePlace2, isPlace2InsidePlace1 } = isCircleInside(place, closePlace);
    if (isPlace1InsidePlace2 || isPlace2InsidePlace1) {
      new TripwireGroup(place.id, closePlace.id, place.group, [
        new Tripwire(place, closePlace, { x: place.x, y: place.y }, { x: closePlace.x, y: closePlace.y }, place.group, "center")
      ]);
      return;
    }

    const { p1a, p1b, p2a, p2b } = calculateExternalTangents(place.x, place.y, place.radius, closePlace.x, closePlace.y, closePlace.radius);

    new TripwireGroup(place.id, closePlace.id, place.group, [
      new Tripwire(place, closePlace, p1b, p2b, place.group, "first"),
      new Tripwire(place, closePlace, p1a, p2a, place.group, "second"),
      new Tripwire(place, closePlace, { x: place.x, y: place.y }, { x: closePlace.x, y: closePlace.y }, place.group, "center")
    ]);
  });
}
