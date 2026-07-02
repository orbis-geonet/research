# Tripwires Collide With Each Other
If you start the index.html using a live server, you can see the simulation with lots of places again. Places with different radii and color are placed on the canvas. You can drag and drop the places to see how the tripwires change. Places with the same color are in the same group and will connect to each other, if they are close enough. If you drag a place of another color into the tripwire of a different group, the tripwire will change its color to red. If two tripwires are cut, the connection between the places will be cut completely.

## Result

## Description
This example shows also that tripwires can collide with each other. Sometimes, places can be placed in a way that they won't collide with tripwires, but their tripwires will collide with each other.

To achieve this, we just iterate over all tripwires. Whenever two tripwires collide (and they have to be from different groups), we can change their state to 'isColliding'. In the simulation here, we just set both tripwires to colliding. In the App implementation, you only want to change the state of the tripwire that is older.

![Tripwires colliding with each other](./imgs/tripwires-colliding-with-each-other.png)
