# Get Bounding Polyogn
If you start the index.html using a live server, you can see the external bounding polygon of two circles. You can still drag and drop the circles around. Furthermore, you have two radio buttons at the top to switch between external, mixed1, mixed2 and internal polygon.

## Result
External bounding polygon:
![External bounding polygon](./imgs/external-bounding-polygon.png)

Mixed1 bounding polygon:
![Mixed1 bounding polygon](./imgs/mixed1-bounding-polygon.png)

Mixed2 bounding polygon:
![Mixed2 bounding polygon](./imgs/mixed2-bounding-polygon.png)

Internal bounding polygon:
![Internal bounding polygon](./imgs/internal-bounding-polygon.png)

## Description
In the `function-repo` you find the four functions to generate the different kinds of polygons. Basically, they are just different ways to connect arc points, tangent points and intersection points into a list of points, which then can be used to draw the polygon.

There are two auxiliary functions in the `function-repo`:
- `calculateArcPoints`: This function calculates the points of an arc. It takes the center, the radius and the start and end angle of the arc as input and returns a list of points.
- `findIntersection`: This function is used to calculate the intersection point of the two inner tangents. This intersection point is used in the mixed1, mixed2 and internal polygon.

So far, the polygons are still pretty pointy. Smoothing the polygons is the last step of the computation and as it is quite a common task, there should be plenty of packages available already to do this. In the simulation I used the [turf library](https://www.npmjs.com/package/@turf/polygon-smooth/v/6.5.0).
