# Tripwires Between Multiple Places
If you start the index.html using a live server, you can see several places with different radii. You can drag and drop the places to see how the tripwires change.

## Result
![Multiple places](./imgs/multiple-places.png)

## Description
In the previous example, we connected two circles. Now, we want to connect multiple places. We do this by iterating over every place and check which places are close by.

You can find the concrete implementation in the `update` method of the place.js file. Below is a functional representation of the code.

```javascript
// Iterate over every place
for (var i = 0; i < places.length; i++) {
  for (var j = i + 1; j < places.length; j++) {
    // Skip if the places are the same
    if (i === j) {
      continue;
    }

    var place1 = places[i];
    var place2 = places[j];

    // Calculate the distance between the places
    var dx = place2.x - place1.x;
    var dy = place2.y - place1.y;
    var d = Math.sqrt(dx * dx + dy * dy);

    var distance = d - place1.r - place2.r;
    if (distance < 1000) {
      place1.closePlaces.push(place2);
    }
  }
}
```

Now, for each place we have a list of close places. We can iterate again over every place and it's close places to calculate the tripwires.

```javascript
// Iterate over every place
for (var i = 0; i < places.length; i++) {
  var place = places[i];
  for (var closePlace of place.closePlaces) {
    const { p1a, p1b, p2a, p2b } = calculateExternalTangents(place.x, place.y, place.r, closePlace.x, closePlace.y, closePlace.r);
    place.tripwires.push({ to: closePlace.id, p1: p1a, p2: p2a });
    place.tripwires.push({ to: closePlace.id, p1: p1b, p2: p2b });
    place.tripwires.push({ to: place.id, p1: { x: place.x, y: place.y }, p2: { x: closePlace.x, y: closePlace.y } });
  }
}
```
