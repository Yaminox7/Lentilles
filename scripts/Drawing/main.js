"use strict";

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var width = canvas.width;
var height = canvas.height;
var w = width / 2;
var h = height / 2;
var center = [w, h];
var points = [
  new Point("A", 100, center[1]),
  new Point("B", 100, center[1] + 120),
  new Point("C", ((width - opt_axe_width) / 2 + focal_distance) / 2, center[1]),
  new Point(
    "D",
    ((width - opt_axe_width) / 2 + focal_distance) / 2,
    center[1] - 50
  ),
  new Point("E", (width - opt_axe_width) / 2 + focal_distance, center[1]),
  new Point("G", (width - opt_axe_width) / 2 + focal_distance, center[1] - 75),
  new Point("H", 250, center[1]),
  new Point("I", 250, center[1] - 150),
  new Point("J", 400, center[1]),
  new Point("K", 400, center[1] - 135),
  new Point("L", 450, center[1]),
  new Point("M", 450, center[1]),
];
var objects = [
  new Obj(points[0], points[1]),
  new Obj(points[2], points[3]),
  new Obj(points[4], points[5]),
  new Obj(points[6], points[7]),
  new Obj(points[8], points[9]),
  new Obj(points[10], points[11]),
];
var skip = [];
var image_objects = [];
var basic_points = [
  new Point("O", w, h),
  new Point("F", (width - opt_axe_width) / 2 + focal_distance, center[1]),
  new Point("F'", (width + opt_axe_width) / 2 - focal_distance, center[1]),
];
var objects_color = colors.slice(0, objects.length);

startBtn.onclick = () => {
  switch (startBtn.innerText) {
    case "Démarrer":
      startBtn.innerText = "Arrêter";
      on = true;
      draw();
      break;
    case "Continuer":
      startBtn.innerText = "Arrêter";
      on = true;
      draw();
      break;
    case "Arrêter":
      startBtn.innerText = "Continuer";
      on = false;
      break;
  }
};

setup();

function setup() {
  ctx.font = textSize + "px " + textFamily;
  draw();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = backgroundColor;
  rect(ctx, 0, 0, width, height);
  ctx.fill();
  image_objects = [];
  draw_ax();
  draw_images();
  draw_objects();
  draw_focal_points();
}

function draw_screen() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = backgroundColor;
  rect(ctx, 0, 0, width, height);
  ctx.fill();
  draw_ax();
  draw_objects();
  draw_focal_points();
}

function draw_ax() {
  line(ctx, 0, 0, 0, 0);
  ctx.stroke();
  ctx.strokeStyle = axeColor;
  ctx.fillStyle = axeColor;
  line(ctx, 0, 0, 0, 0);
  ctx.stroke();
  var x1 = width - opt_axe_width;
  var x2 = width + opt_axe_width;
  var h1 = height - opt_axe_height;
  var h2 = height + opt_axe_height;
  line(ctx, x1 / 2, center[1], x2 / 2, center[1]);
  ctx.stroke();
  line(ctx, center[0], h1 / 2, center[0] + ax_arrow_x, h1 / 2 + ax_arrow_y);
  ctx.stroke();
  line(ctx, center[0], h1 / 2, center[0] - ax_arrow_x, h1 / 2 + ax_arrow_y);
  ctx.stroke();

  line(ctx, center[0], h1 / 2, center[0], h2 / 2);
  ctx.stroke();
  line(ctx, center[0], h2 / 2, center[0] + ax_arrow_x, h2 / 2 - ax_arrow_y);
  ctx.stroke();
  line(ctx, center[0], h2 / 2, center[0] - ax_arrow_x, h2 / 2 - ax_arrow_y);
  ctx.stroke();

  ctx.setLineDash([10, 14]);
  line(ctx, 0, center[1], x1 / 2, center[1]);
  ctx.stroke();
  line(ctx, x2 / 2, center[1], width, center[1]);
  ctx.stroke();
  ctx.setLineDash([5, 0]);
}

function draw_focal_points() {
  for (var point of basic_points) {
    ctx.strokeStyle = fillColor;
    ctx.fillStyle = fillColor;
    circle(ctx, point.x, point.y, pointWidth);
    ctx.fill();
    ctx.fillStyle = textColor;
    if (showPointsNames) {
      ctx.fillText(
        point.name,
        point.x - getTextWidth(ctx, point.name) / 2,
        point.y + nameY1Offset
      );
      ctx.stroke();
    }
  }
}

function draw_objects() {
  for (var obj of objects) {
    if (includes(obj.id, skip)) {
      continue;
    }
    var color = objects_color[objects.indexOf(obj) % objects_color.length];
    var origin = obj.origin;
    var end = obj.end;
    line(ctx, 0, 0, 0, 0);
    ctx.stroke();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    line(ctx, 0, 0, 0, 0);
    ctx.stroke();
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

    ctx.strokeStyle = "#000";
    ctx.fillStyle = "#000";
  }
}

function draw_images() {
  for (var obj of objects) {
    var drawImage = true;
    if (includes(obj.id, skip)) {
      drawImage = false;
    }
    ctx.setLineDash([8, 10]);
    var color = objects_color[objects.indexOf(obj) % objects_color.length];
    ctx.strokeStyle = color;
    var origin = obj.origin;

    if (obj.dir == 0) {
      // point
      var end = new Point(obj.end.name, obj.end.x, center[1] + 50);
      var projection = new Point(end.name + "|", w, end.y);
      if (end.x > basic_points[1].x) {
        // real
        var res1 = toBorder(
          "Y",
          projection.x,
          projection.y,
          basic_points[2].x,
          h,
          width,
          height,
          0,
          0
        );
        var res2 = toBorder("Y", end.x, end.y, w, h, width, height, 0, 0);

        var res = lineIntersection(projection, res1, end, res2, end.name + "'");
        ctx.setLineDash([5, 0]);

        if (res != null) {
          // draw_point(ctx, res.x, res.y, res.name);
          var image_origin = new Point(origin.name + "'", res.x, h);
          var image_obj = new Obj(
            image_origin,
            new Point(res.name, res.x, center[1])
          );
          if (drawImage) {
            draw_image_object(ctx, image_obj, color);
            line(ctx, 0, 0, 0, 0);
            ctx.stroke();
          }
          image_objects.push(image_obj);
        } else {
          image_objects.push(0);
        }
      } else {
        // virtual
        var res1 = toBorder(
          "Y",
          projection.x,
          projection.y,
          basic_points[2].x,
          h,
          0,
          0,
          width,
          height
        );
        var res2 = toBorder("Y", end.x, end.y, w, h, 0, 0, width, height);

        var res = lineIntersection(projection, res1, end, res2, end.name + "'");
        ctx.setLineDash([5, 0]);
        if (res != null) {
          // draw_point(ctx, res.x, res.y, res.name);
          var image_origin = new Point(origin.name + "'", res.x, h);
          var image_obj = new Obj(
            image_origin,
            new Point(res.name, res.x, center[1])
          );
          if (drawImage) {
            draw_image_object(ctx, image_obj, color);
          }
          image_objects.push(image_obj);
        } else {
          image_objects.push(0);
        }
      }
    } else {
      var end = obj.end;
      var projection = new Point(end.name + "|", w, end.y);
      if (drawImage) {
        lineFromPoints(ctx, end, projection);
      }
      if (end.x > basic_points[1].x) {
        // real
        var res1 = toBorder(
          "Y",
          projection.x,
          projection.y,
          basic_points[2].x,
          h,
          width,
          height,
          0,
          0
        );
        if (res1 != null && drawImage) {
          lineFromPoints(ctx, basic_points[2], res1);
        }

        ctx.setLineDash([8, 10]);
        var res2 = toBorder("Y", end.x, end.y, w, h, width, height, 0, 0);
        if (res2 != null && drawImage) {
          lineFromPoints(ctx, basic_points[0], res2);
        }
        if (drawImage) {
          line(ctx, 0, 0, 0, 0);
          ctx.stroke();
        }

        var res = lineIntersection(projection, res1, end, res2, end.name + "'");
        ctx.setLineDash([5, 0]);

        if (res != null) {
          // draw_point(ctx, res.x, res.y, res.name);
          var image_origin = new Point(origin.name + "'", res.x, h);
          var image_obj = new Obj(image_origin, res);
          if (drawImage) {
            draw_image_object(ctx, image_obj, color);
            line(ctx, 0, 0, 0, 0);
            ctx.stroke();
          }
          image_objects.push(image_obj);
        } else {
          image_objects.push(0);
        }
      } else {
        // virtual
        var res1 = toBorder(
          "Y",
          projection.x,
          projection.y,
          basic_points[2].x,
          h,
          0,
          0,
          width,
          height
        );
        if (res1 != null && drawImage) {
          lineFromPoints(ctx, projection, res1);
        }

        ctx.setLineDash([8, 10]);
        var res2 = toBorder("Y", end.x, end.y, w, h, 0, 0, width, height);
        if (res2 != null && drawImage) {
          lineFromPoints(ctx, end, res2);
        }
        if (drawImage) {
          line(ctx, 0, 0, 0, 0);
          ctx.stroke();
        }

        var res = lineIntersection(projection, res1, end, res2, end.name + "'");
        ctx.setLineDash([5, 0]);
        if (res != null) {
          // draw_point(ctx, res.x, res.y, res.name);
          var image_origin = new Point(origin.name + "'", res.x, h);
          var image_obj = new Obj(image_origin, res);
          if (drawImage) {
            draw_image_object(ctx, image_obj, color);
            line(ctx, 0, 0, 0, 0);
            ctx.stroke();
          }
          image_objects.push(image_obj);
        } else {
          image_objects.push(0);
        }
      }
    }
  }
  ctx.strokeStyle = "#000";
}
