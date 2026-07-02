export function isCircleInside(place1, place2) {
  const dx = place2.x - place1.x;
  const dy = place2.y - place1.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  // Check if place1 is inside place2
  const isPlace1InsidePlace2 = distance + place1.radius <= place2.radius;

  // Check if place2 is inside place1
  const isPlace2InsidePlace1 = distance + place2.radius <= place1.radius;

  return {
    isPlace1InsidePlace2,
    isPlace2InsidePlace1
  };
}
