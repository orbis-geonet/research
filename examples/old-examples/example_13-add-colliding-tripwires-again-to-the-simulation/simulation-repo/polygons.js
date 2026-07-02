import { createExternalPolygon } from "../function-repo/createExternalPolygon.js";
import { Place } from "./place.js";

export class Polygons {
  polygons = [];

  constructor() {
    if (!Polygons.instance) {
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

                // console.log(mappedPolygons)
                
                this.polygons.push({
                    places: connectedPlaces,
                    polygons: mappedPolygons,
                    mergedPolygon: polygonClipping.union(...mappedPolygons)[0],
                });
            }
        }
    }
  }

  draw(ctx) {
    // Draw polygons
    for (let { mergedPolygon } of this.polygons) {
        if (!mergedPolygon) {
            continue;
        }

        const polygon = mergedPolygon[0];

        ctx.beginPath();
        ctx.moveTo(polygon[0][0], polygon[0][1]);

        for (let i = 1; i < polygon.length; i++) {
            ctx.lineTo(polygon[i][0], polygon[i][1]);
        }

        ctx.closePath();
        ctx.fillStyle = "rgba(0, 0, 255, 0.1)";
        ctx.fill();
        ctx.fillStyle = "black";
    }

    // for (let { polygons } of this.polygons) {
    //   if (polygons.length === 0) {
    //     continue;
    //   }

    //   ctx.beginPath();
    //   ctx.moveTo(polygons[0][0][0], polygons[0][0][1]);

    //   for (let i = 1; i < polygons.length; i++) {
    //     ctx.lineTo(polygons[i][0][0], polygons[i][0][1]);
    //   }

    //   ctx.closePath();
    //   ctx.fillStyle = "rgba(0, 0, 255, 0.1)";
    //   ctx.fill();
    //   ctx.fillStyle = "black";
    // }
  }
}

function setsEqual(set1, set2) {
  if (set1.size !== set2.size) return false;
  for (let item of set1) {
      if (!set2.has(item)) return false;
  }
  return true;
}
