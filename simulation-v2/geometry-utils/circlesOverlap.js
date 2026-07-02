export function circlesOverlap(place1, place2) {
  let isOverlapping = false;
  let intersectionPoints = [];

  const dx = place2.x - place1.x;
  const dy = place2.y - place1.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance <= place1.radius + place2.radius) {
    isOverlapping = true;

    const d = Math.sqrt(dx * dx + dy * dy);
    const a = (place1.radius * place1.radius - place2.radius * place2.radius + d * d) / (2 * d);
    const h = Math.sqrt(place1.radius * place1.radius - a * a);
    const x2 = place1.x + a * (place2.x - place1.x) / d;
    const y2 = place1.y + a * (place2.y - place1.y) / d;
    const x3 = x2 + h * (place2.y - place1.y) / d;
    const y3 = y2 - h * (place2.x - place1.x) / d;
    const x4 = x2 - h * (place2.y - place1.y) / d;
    const y4 = y2 + h * (place2.x - place1.x) / d;

    intersectionPoints = [
      { x: x3, y: y3 },
      { x: x4, y: y4 }
    ];
  }

  return { isOverlapping, intersectionPoints };
}
