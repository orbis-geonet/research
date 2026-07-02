# Amorphous Shapes With Many Places
If you start the index.html using a live server, you can generate a bunch of places at the top. You can then move them around to create amorphous shapes.

## Result
![Amorphous shapes](./imgs/amorphous-shapes.png)

## Description
The important part of this example is within the `polygon.js` file in the simulation repo. Within the update function, it basically does the following:
1. The while loop creates groups of connected places. In the example image above, we'd have four groups of connected places.
2. After that, for each group, it creates a union of all the polygons of the connected places.
3. It then smooths the polygon using the turf library.

By doing that, we have a `this.polygons` that contains for each group:
- The places that are part of that polygon
- The polygon itself
- (Later on we will add the center point of the polygon here as well)
