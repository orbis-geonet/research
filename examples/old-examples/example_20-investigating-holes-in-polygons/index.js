window.onload = function () {
  var canvas = document.getElementById("myCanvas");
  var ctx = canvas.getContext("2d");

  function drawCircle() {
    var centerX = canvas.width / 2;
    var centerY = canvas.height / 2;
    var circleRadius = 30;

    ctx.beginPath();
    ctx.arc(centerX, centerY, circleRadius, 0, Math.PI * 2);
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.closePath();
  }

  function drawConcavePolygon() {
    var numPoints = 15;
    var centerX = canvas.width / 2;
    var centerY = canvas.height / 2;
    var outerRadius = 150;
    var innerRadius = 100;
    var angleIncrement = (Math.PI * 2) / numPoints;

    ctx.beginPath();
    for (var i = 0; i < numPoints; i++) {
      var angle = i * angleIncrement;
      var x = centerX + outerRadius * Math.cos(angle);
      var y = centerY + outerRadius * Math.sin(angle);
      ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle = "black";
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.moveTo(centerX + innerRadius, centerY);
    for (var i = numPoints - 1; i >= 0; i--) {
      var angle = i * angleIncrement;
      var x = centerX + innerRadius * Math.cos(angle);
      var y = centerY + innerRadius * Math.sin(angle);
      ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle = "red";
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.fillStyle = "yellow";
    ctx.fill("evenodd");
  }

  function clearCanvas() {
    // With light gray color
    ctx.fillStyle = "lightgray";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
  }

  clearCanvas();

  window.drawCircle = drawCircle;
  window.drawConcavePolygon = drawConcavePolygon;
  window.clearCanvas = clearCanvas;
};
