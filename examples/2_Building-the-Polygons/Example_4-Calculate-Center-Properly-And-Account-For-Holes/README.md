# Calculate Center Properly And Account For Holes

If you start the `index.html` using a live server, you can see many places forming amorphous territories, each with a single center point. The **Precision** input at the top controls the accuracy (and cost) of the center calculation.

## Result

![Territory centers for two groups](./imgs/territory-centers.png)
![Centers on amorphous, concave territories](./imgs/amorphous-centers.png)

*Two groups (red / green). Each connected territory gets one center point (black dot), placed deep inside the shape — even for concave "C" and "L" territories where a naive centroid would fall in the notch (or outside the territory entirely). White circles are places that aren't connected to a group.*

## Description

This is the final step of the research: giving every merged territory a single, well-placed **center point** — the anchor Orbis uses to label a tribe's territory on the map.

The obvious choice, the polygon's **centroid**, breaks for the amorphous shapes produced in [Example 3](../Example_3-Amorphous-Shapes-With-Many-Places/README.md). The centroid of a horseshoe- or ring-shaped territory can land in a concave gap, or even outside the territory. So instead we compute the **pole of inaccessibility**: the point that is furthest from the polygon's boundary — i.e. the deepest point inside the shape.

### Pole of inaccessibility (`findPolygonCenter` / `polylabel`)

`findPolygonCenter.js` implements the `polylabel` algorithm (originally from Mapbox) as a grid + priority-queue search:

1. Cover the polygon's bounding box with square cells.
2. Keep a priority queue of cells ordered by each cell's **best possible** distance to the boundary (`cell.d + cell.h * √2`).
3. Repeatedly pop the most promising cell. If it can't beat the current best by more than `precision`, discard it; otherwise split it into four child cells and re-queue them.
4. The winner is the cell centre furthest from the boundary — a stable point that is always inside the polygon.

`precision` (the input at the top of the page) trades accuracy against speed: a smaller value searches more finely.

### Accounting for holes

When places connect in a loop, the merged territory can contain a **hole** — an interior gap with no coverage. A center dropped into that hole would be wrong, so `polygons.js` runs `checkHoles` to classify the interior rings of the merged polygon:

- **Holes that contain places** are treated as genuine holes and passed to `polylabel` as its `holes` argument. The search then skips any grid cell whose center falls inside a hole (`isPointInAnyPolygon`), so the center can never be placed in a gap — it stays in the solid band of territory.
- Hole rings are smoothed with the [turf](https://www.npmjs.com/package/@turf/polygon-smooth/v/6.5.0) library before drawing, just like the outer polygon.

The result: every connected territory — sprawling, concave, or with a hole in the middle — gets exactly one center point in a sensible, always-inside location.

> **Note:** this example loads `tinyqueue` from a CDN. The pinned URL in `index.html` (`tinyqueue`) now resolves to an ESM-only build that does not expose the global `TinyQueue` the code expects, so the center calculation can silently fail. If the canvas renders places but no polygons/centers, pin the UMD build instead: `https://cdn.jsdelivr.net/npm/tinyqueue@2.0.3/tinyqueue.min.js`.
