import { polylabel } from "../function-repo/findPolygonCenter.js";
import { isPointInPolygon } from "../function-repo/isPointInsidePolygon.js";

import { Place } from "./place.js";

export class Polygons {
  static colors = ["rgba(255, 0, 0, 0.5)", "rgba(0, 255, 0, 0.5)", "rgba(0, 0, 255, 0.5)", "rgba(128, 0, 128, 0.5)", "rgba(255, 165, 0, 0.5)", "rgba(255, 255, 0, 0.5)", "rgba(255, 192, 203, 0.5)", "rgba(165, 42, 42, 0.5)", "rgba(0, 255, 255, 0.5)", "rgba(255, 0, 255, 0.5)"];

  precisionInput = document.getElementById("precision");

  precision = 20.0;
  polygons = [];

  constructor() {
    if (!Polygons.instance) {
      this.precisionInput.addEventListener("input", () => {
        this.precision = parseFloat(this.precisionInput.value);
        console.log(this.precision)
      });

      Polygons.instance = this;
    }

    return Polygons.instance;
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new Polygons();
    }

    return this.instance;
  }

  update() {
    const places = Place.places;

    this.polygons = [];

    const visited = new Set();
    const consideredGroups = new Set();

    for (let place of places) {
        if (!visited.has(place)) {
            const currentGroup = new Set();
            const queue = [place];
    
            while (queue.length > 0) {
                const currentPlace = queue.shift();
                visited.add(currentPlace);
                currentGroup.add(currentPlace.id);
    
                for (let otherPlace of currentPlace.closePlaces) {
                    if (!visited.has(otherPlace)) {
                        queue.push(otherPlace);
                    }
                }
            }
    
            // Check if the current group has been considered before
            if (!consideredGroups.has(Array.from(currentGroup).toString())) {
                consideredGroups.add(Array.from(currentGroup).toString());
    
                // Generate a single polygon for the connected places
                const connectedPlaces = Array.from(currentGroup).map(id => places.find(place => place.id === id));

                const polygons = connectedPlaces.map(place => place.polygons).flat();
                const mappedPolygons = polygons.map(polygon => [polygon.map(point => [point.x, point.y])]);

                if (mappedPolygons.length === 0) {
                    this.polygons.push({
                        places: connectedPlaces,
                        polygons: [],
                    });
                    continue;
                }

                let mergedPolygon = polygonClipping.union(...mappedPolygons);
                const originalMergedPolygon = mergedPolygon;
                let holes = [];
                
                let center;
                if (mergedPolygon[0].length > 1) {
                    const checkHoles = Polygons.checkHoles(mergedPolygon[0]);
                    mergedPolygon = [[checkHoles.polygon, ...checkHoles.holesWithoutPlaces]];
                    holes = checkHoles.holesWithPlaces.map(hole => turf.polygonSmooth(turf.polygon([hole]), { iterations: 2 }).features[0].geometry.coordinates[0]);

                    if (holes.length > 0) {
                      center = polylabel(originalMergedPolygon[0], this.precision, false, []);
                    } else {
                      center = polylabel([checkHoles.polygon], this.precision, false);
                    }
                } else {
                  center = polylabel(mergedPolygon[0], this.precision, false, []);
                }


                const turfPolygon = turf.polygon(mergedPolygon[0]);
                const smoothedPolygons = turf.polygonSmooth(turfPolygon, { iterations: 2 });

                this.polygons.push({
                    places: connectedPlaces,
                    polygons: mappedPolygons,
                    mergedPolygon: [smoothedPolygons.features[0].geometry.coordinates[0]],
                    holes,
                    center,
                });
            }
        }
    }
  }

  static checkHoles(polygon) {
    const originalPolygon = polygon[0];
    const holes = polygon.slice(1);
    let holesWithoutPlaces = [];
    let holesWithPlaces = [];

    const places = Place.places;
  
    for (let hole of holes) {
      let hasPlaceInside = false;
      for (let place of places) {
        if (isPointInPolygon([place.x, place.y], hole)) {
          hasPlaceInside = true;
          holesWithPlaces.push(hole);
          break;
        }
      }

      if (!hasPlaceInside) {
        holesWithoutPlaces.push(hole);
      }
    }

    return {
      polygon: originalPolygon,
      holesWithoutPlaces,
      holesWithPlaces,
    }
  }

  draw(ctx) {
    // Draw polygons
    for (let p of this.polygons) {
      const { places, mergedPolygon } = p;

      if (!mergedPolygon) {
          continue;
      }

      // console.log(places[0].group)

      const polygon = mergedPolygon[0];

      ctx.beginPath();
      ctx.moveTo(polygon[0][0], polygon[0][1]);

      for (let i = 1; i < polygon.length; i++) {
          ctx.lineTo(polygon[i][0], polygon[i][1]);
      }

      ctx.closePath();
      ctx.fillStyle = Polygons.colors[places[0].group];
      ctx.fill();
      ctx.fillStyle = "black";

      // Draw center
      ctx.beginPath();
      ctx.arc(p.center[0], p.center[1], 5, 0, 2 * Math.PI);
      ctx.fillStyle = "black";
      ctx.fill();

      // Draw holes
      for (let hole of p.holes) {
        ctx.beginPath();
        ctx.moveTo(hole[0][0], hole[0][1]);

        for (let i = 1; i < hole.length; i++) {
            ctx.lineTo(hole[i][0], hole[i][1]);
        }

        ctx.closePath();
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.fillStyle = "black";
      }
    }
  }
}
