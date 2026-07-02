export function findIntersection(line1Start, line1End, line2Start, line2End) {
  // Line 1 represented as a1x + b1y = c1
  let a1 = line1End.y - line1Start.y;
  let b1 = line1Start.x - line1End.x;
  let c1 = a1 * line1Start.x + b1 * line1Start.y;

  // Line 2 represented as a2x + b2y = c2
  let a2 = line2End.y - line2Start.y;
  let b2 = line2Start.x - line2End.x;
  let c2 = a2 * line2Start.x + b2 * line2Start.y;

  // Calculate the determinant
  let determinant = a1 * b2 - a2 * b1;

  if (determinant == 0) {
    // Lines are parallel
    return null;
  } else {
    let x = (b2 * c1 - b1 * c2) / determinant;
    let y = (a1 * c2 - a2 * c1) / determinant;
    return { x, y };
  }
}
