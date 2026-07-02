# Tripwires Break When Distance is too Large
If you start the index.html using a live server, you can hover over a circle to see his radius. If you drag and drop the circles, so that they are close enough, you can see the tripwires connecting the circles. If you drag the circles too far apart, the tripwires will break.

## Result
![Hovering a circle](./imgs/hover.png)
![Connected circles](./imgs/connected.png)

## Description
Tripwires are used to connect circles. If the circles are too far apart, the tripwires will break. To do that, we have to know how far two circles are apart. Here, we are interested in the distance between the outer borders of the circles.

Getting that distance is quite easy. First, we calculate the distance between the centers of the circles.
```javascript
var dx = x2 - x1;
var dy = y2 - y1;
var d = Math.sqrt(dx * dx + dy * dy);
```

Then, we subtract the radii of the circles from the distance between the centers.

```javascript
var distance = d - r1 - r2;
```

Now we can test if this distance is smaller than a certain threshold. Let's say we only want to connect circles that are within a 1000 meters distance. We simply check if the distance is smaller than 1000.
```javascript
if (distance < 1000) {
  // Connect the circles
}
```

<br/>

Note: In the final simulation, the maximum distance is based on the radius of the circles. If the distance is larger than the sum of the radii, the tripwires will break.
```javascript
if (distance < r1 + r2) {
  // Connect the circles
}
```
