function lineIntersection(pointA, pointB, pointC, pointD, name) {
  var z1 = pointA.x - pointB.x;
  var z2 = pointC.x - pointD.x;
  var z3 = pointA.y - pointB.y;
  var z4 = pointC.y - pointD.y;
  var dist = z1 * z4 - z3 * z2;
  if (dist == 0) {
    return null;
  }
  var tempA = pointA.x * pointB.y - pointA.y * pointB.x;
  var tempB = pointC.x * pointD.y - pointC.y * pointD.x;
  var xCoor = (tempA * z2 - z1 * tempB) / dist;
  var yCoor = (tempA * z4 - z3 * tempB) / dist;

  if (
    xCoor < Math.min(pointA.x, pointB.x) ||
    xCoor > Math.max(pointA.x, pointB.x) ||
    xCoor < Math.min(pointC.x, pointD.x) ||
    xCoor > Math.max(pointC.x, pointD.x)
  ) {
    return null;
  }
  if (
    yCoor < Math.min(pointA.y, pointB.y) ||
    yCoor > Math.max(pointA.y, pointB.y) ||
    yCoor < Math.min(pointC.y, pointD.y) ||
    yCoor > Math.max(pointC.y, pointD.y)
  ) {
    return null;
  }

  return new Point(name, xCoor, yCoor);
}

function toBorder(name, x1, y1, x2, y2, left, top, right, bottom) {
  var dx, dy, py, vx, vy;
  vx = x2 - x1;
  vy = y2 - y1;
  dx = vx < 0 ? left : right;
  dy = py = vy < 0 ? top : bottom;
  if (vx === 0) {
    dx = x1;
  } else if (vy === 0) {
    dy = y1;
  } else {
    dy = y1 + (vy / vx) * (dx - x1);
    if (dy < top || dy > bottom) {
      dx = x1 + (vx / vy) * (py - y1);
      dy = py;
    }
  }
  return new Point(name, dx, dy);
}

function sr(x, y) {
  return x * x + y * y;
}

function draw_point(ctx, x, y, name) {
  circle(ctx, x, y, pointWidth);
  ctx.fill();
  if (showPointsNames) {
    ctx.fillText(name, x - getTextWidth(ctx, name) / 2, y - nameY2Offset);
    ctx.stroke();
  }
}

function lineFromPoints(ctx, p1, p2) {
  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.closePath();
  ctx.stroke();
}

function draw_image_object(ctx, obj, color) {
  var origin = obj.origin;
  var end = obj.end;

  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  if (obj.dir > 0) {
    if (showPointsNames) {
      ctx.fillText(
        origin.name,
        origin.x - getTextWidth(ctx, origin.name) / 2,
        origin.y + nameY1Offset
      );
      ctx.stroke();
      ctx.fillText(
        end.name,
        end.x - getTextWidth(ctx, end.name) / 2,
        end.y - nameY2Offset
      );
      ctx.stroke();
    }

    line(ctx, end.x, end.y, end.x + end_arrow_x, end.y + end_arrow_y);
    ctx.stroke();
    line(ctx, end.x, end.y, end.x - end_arrow_x, end.y + end_arrow_y);
    ctx.stroke();
  } else if (obj.dir < 0) {
    if (showPointsNames) {
      ctx.fillText(
        origin.name,
        origin.x - getTextWidth(ctx, origin.name) / 2,
        origin.y - nameY2Offset
      );
      ctx.stroke();
      ctx.fillText(
        end.name,
        end.x - getTextWidth(ctx, end.name) / 2,
        end.y + nameY1Offset - 6
      );
      ctx.stroke();
    }

    line(ctx, end.x, end.y, end.x + end_arrow_x, end.y - end_arrow_y);
    ctx.stroke();
    line(ctx, end.x, end.y, end.x - end_arrow_x, end.y - end_arrow_y);
    ctx.stroke();
  } else if (showPointsNames) {
    ctx.fillText(
      origin.name,
      origin.x - getTextWidth(ctx, origin.name) / 2,
      origin.y + nameY1Offset
    );
    ctx.stroke();
    ctx.fillText(
      end.name,
      end.x - getTextWidth(ctx, end.name) / 2,
      end.y - nameY2Offset - 5
    );
    ctx.stroke();
  }

  circle(ctx, origin.x, origin.y, pointWidth);
  ctx.fill();

  line(ctx, origin.x, origin.y, end.x, end.y);
  ctx.stroke();
  line(ctx, 0, 0, 0, 0);
  ctx.stroke();

  ctx.strokeStyle = defaultColor;
  ctx.fillStyle = defaultColor;
}

function includes(obj, array) {
  for (var i = 0; i < array.length; i++) {
    if (array[i] == obj) {
      return true;
    }
  }
  return false;
}

function spliceObject(id, array) {
  for (var i = 0; i < array.length; i++) {
    if (array[i] == id) {
      array.splice(i, 1);
      break;
    }
  }
}
