export function drawExternalTangents(ctx, p1a, p1b, p2a, p2b) {
  // Draw the first tangent line
  ctx.beginPath();
  ctx.moveTo(p1a.x, p1a.y);
  ctx.lineTo(p2a.x, p2a.y);

  ctx.strokeStyle = 'lightgreen';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'black';

  // Draw the second tangent line
  ctx.beginPath();
  ctx.moveTo(p1b.x, p1b.y);
  ctx.lineTo(p2b.x, p2b.y);

  ctx.strokeStyle = 'lightgreen';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'black';
}
