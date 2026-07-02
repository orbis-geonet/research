import { createExternalPolygon } from '../../../geometry-utils/createExternalPolygon.js';
import { createInsidePolygon } from '../../../geometry-utils/createInsidePolygon.js';
import { createMixedPolygon1 } from '../../../geometry-utils/createMixedPolygon1.js';
import { createMixedPolygon2 } from '../../../geometry-utils/createMixedPolygon2.js';
import { isCircleInside } from '../../../geometry-utils/isCircleInside.js';

import { TripwireGroup } from '../../tripwire-group.js';

export async function handleComputePolygons({ place }) {
  const tripwireStates = TripwireGroup.getState(place.id);

  // Create external polygons
  place.polygons = [];

  for (let closePlace of place.closePlaces) {
    const tripwireGroup = tripwireStates.find(tripwireGroup => tripwireGroup.toPlace === closePlace.id);

    if (tripwireGroup === undefined) {
      continue;
    }

    const { isPlace1InsidePlace2, isPlace2InsidePlace1 } = isCircleInside(place, closePlace);
    if (isPlace1InsidePlace2 || isPlace2InsidePlace1) {
      place.polygons.push(createInsidePolygon(place, closePlace));
    } else if (tripwireGroup.state === "connected") {
      place.polygons.push(createExternalPolygon(place, closePlace));
    } else if (tripwireGroup.state === "internal1") {
      place.polygons.push(createMixedPolygon1(place, closePlace));
    } else if (tripwireGroup.state === "internal2") {
      place.polygons.push(createMixedPolygon2(place, closePlace));
    }
  }

  // Merge polygons
  if (place.polygons.length === 0) {
    place.polygon = null;
  } else if (place.polygons.length === 1) {
    place.polygon = place.polygons.map(polygon => polygon.map(point => [point.x, point.y]));
  } else if (place.polygons.length > 1) {
    const formattedPolygons = place.polygons.map(polygon => [polygon.map(point => [point.x, point.y])]);
    formattedPolygons.push(formattedPolygons[0]);
    place.polygon = polygonClipping.union(...formattedPolygons)[0];
  }
}
