"use strict";

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var w = 1000;
var h = 1000;
var opt_axe_width = (3*w)/4;
var l_x = w/2;
var center = [l_x, h/4];

var lineWidth = 2;
var linethickness = 3;
var thickness = 5;

var lw1;
var lh1;
var lw2;
var lh2;
var new_x1;
var new_y1;
var new_x2;
var new_y2;
var add = 25;

var colors = [
  "#ff0000", // rouge
  "#00ff00", // vert (clair)
  "#0000ff", // bleu
  "#22dd22", // vert (normal)
  "#e70ee7", // mauve
  "#ffd700", // doré
  "#11d7d7", // cyan
  "#aaaaaa", // gris clair
  "#555555", // gris foncé
  // "#000000", // taha
];
colors.sort(()=>Math.random()-0.5)

var points = [];
var result_points = [];
var to_pass = [];
var result_to_pass = [];
var objs = [];
var result_objs = [];

var doing = false;
var startBtn = document.getElementById("start");

startBtn.onclick = () => {
  switch (startBtn.innerText) {
    case "Démarrer":
      startBtn.innerText = "Arrêter";
      doing = true;
      draw();
      break;
    case "Continuer":
      startBtn.innerText = "Arrêter";
      doing = true;
      draw();
      break;
    case "Arrêter":
      startBtn.innerText = "Continuer";
      doing = false;
      break;
  }
};

var focal_distance = 150;
var focal_distance_input = document.getElementById("dstf");
focal_distance_input.setAttribute("min", 10);
focal_distance_input.setAttribute("max", opt_axe_width/2-15);
focal_distance_input.setAttribute("value", focal_distance);
focal_distance_input.setAttribute("data-title", focal_distance/10);
focal_distance_input.oninput = () => {
    focal_distance = parseFloat(focal_distance_input.value);
    focal_distance_input.setAttribute("data-title", focal_distance/10);
    points.splice(4, 2);
    focal_points();
    if (doing) draw();
    else draw_screen();;
}
    
function setup() {
    points = [
        new Point("A", 5*w/32, h/4, "down"),
        new Point("B", 5*w/32, h/8, "up"),
        new Point("C", w/2-focal_distance*2, h/4, "down"),
        new Point("D", w/2-focal_distance*2, 1.25*h/16, "up"),
        new Point("I", w/2-3*focal_distance/2, h/4, "down"),
        new Point("J", w/2-3*focal_distance/2, 1.75*h/16, "up"),
        new Point("K", w/2-focal_distance, h/4, "down"),
        new Point("L", w/2-focal_distance, h/6, "up"),
        new Point("M", w/2-focal_distance/2, h/4, "down"),
        new Point("N", w/2-focal_distance/2, 1.25*h/8, "up")
    ];
    objs = [
      // new Obj(points[0], points[1]),
      // new Obj(points[2], points[3]),
      // new Obj(points[4], points[5]),
      // new Obj(points[6], points[7]),
      // new Obj(points[8], points[9]),
    ];
    focal_points();
    get_passable();
}

function focal_points() {
    points.push(
      new Point("F", w / 2 - focal_distance, h / 4, "down"),
      new Point("F'", w / 2 + focal_distance, h / 4, "down")
    );
}

function get_passable() {
    for (var point of points) {
      for (var ob of objs) {
        if (ob.end == point) {
          to_pass.push(point);
        }
      }
    }
    for (var point of result_points) {
      for (var ob of result_objs) {
        if (ob.end == point) {
          result_to_pass.push(point);
        }
      }
    }
}
setup();

/*
* ctx.fillStyle = "#ffffff";
* ctx.fill();
* ctx.lineWidth = 1;
* ctx.strokeStyle = "#000000";
* ctx.stroke();
*/

draw_screen();
function draw_screen() {
    ctx.strokeStyle = "#000000";
    ctx.fillStyle = "#000000";
    ctx.setLineDash([5, 0]);
    ctx.clearRect(0, 0, w, h)
    ctx.lineWidth = lineWidth;
    ctx.font = "20px Arial";
    for (var i = 0; i < linethickness; i++) {
        line(ctx, l_x, 10, l_x, h/2-10);
        ctx.stroke();
        line(ctx, w/8, h/4, w/8+opt_axe_width, h/4);
        ctx.stroke();
        line(ctx, l_x, 10, l_x-10, 20);
        ctx.stroke();
        line(ctx, l_x, 10, l_x+10, 20);
        ctx.stroke();
        line(ctx, l_x-10, h/2-20, l_x, h/2-10);
        ctx.stroke();
        line(ctx, l_x+10, h/2-20, l_x, h/2-10);
        ctx.stroke();
    }
    draw_points();
    draw_focal_points();
    // draw_result_points();
}

function draw_points() {
  for (var obj of objs) {
    ctx.strokeStyle = colors[objs.indexOf(obj)];
    ctx.fillStyle = colors[objs.indexOf(obj)];
    line(ctx, obj.origin.x, obj.origin.y, obj.end.x, obj.end.y);
    ctx.stroke();
    var point = obj.end;
    switch (point.dir) {
      case "up":
        line(ctx, point.x, point.y, point.x - 10, point.y + 10);
        ctx.stroke();
        line(ctx, point.x, point.y, point.x + 10, point.y + 10);
        ctx.stroke();
        break;
      case "down":
        line(ctx, point.x, point.y, point.x - 10, point.y - 10);
        ctx.stroke();
        line(ctx, point.x, point.y, point.x + 10, point.y - 10);
        ctx.stroke();
        break;
      case "left":
        line(ctx, point.x, point.y, point.x + 10, point.y - 10);
        ctx.stroke();
        line(ctx, point.x, point.y, point.x + 10, point.y + 10);
        ctx.stroke();
        break;
      case "right":
        line(ctx, point.x, point.y, point.x - 10, point.y - 10);
        ctx.stroke();
        line(ctx, point.x, point.y, point.x - 10, point.y + 10);
        ctx.stroke();
        break;
    }
    ctx.setLineDash([5, 0]);
    for (var point of obj.points) {
      if (point == obj.origin) {
        circle(ctx, point.x, point.y, thickness);
        ctx.fill();
      }
      switch (point.dir) {
        case "down":
          ctx.fillText(
            point.name,
            point.x - point.name.length * 6,
            point.y + 25
          );
          break;
        case "up":
          ctx.fillText(
            point.name,
            point.x - point.name.length * 6,
            point.y - 5
          );
          break;
        case "left":
          ctx.fillText(
            point.name,
            point.x - point.name.length * 10 - 8,
            point.y + 8
          );
          break;
        case "right":
          ctx.fillText(point.name, point.x + 10, point.y + 8);
          break;
      }
      ctx.stroke();
    }
  }
}

function draw_focal_points() {
  for (var point of [points[points.length-2], points[points.length-1]]) {
    ctx.strokeStyle = "#000000";
    ctx.fillStyle = "#000000";
    circle(ctx, point.x, point.y, thickness);
    ctx.fill();
    var offx = !point.name.includes("'") ? point.name.length * 6 : (point.name.length - 1) * 3;
    ctx.fillText(point.name, point.x-offx, point.y + 25);
    ctx.stroke();
  }
}

function draw_result_points() {
    for (var obj of result_objs) {
      line(ctx, obj.origin.x, obj.origin.y, obj.end.x, obj.end.y);
      ctx.stroke();
      var point = obj.end;
      switch (point.dir) {
        case "up":
          line(ctx, point.x, point.y, point.x - 10, point.y + 10);
          ctx.stroke();
          line(ctx, point.x, point.y, point.x + 10, point.y + 10);
          ctx.stroke();
          break;
        case "down":
          line(ctx, point.x, point.y, point.x - 10, point.y - 10);
          ctx.stroke();
          line(ctx, point.x, point.y, point.x + 10, point.y - 10);
          ctx.stroke();
          break;
        case "left":
          line(ctx, point.x, point.y, point.x + 10, point.y - 10);
          ctx.stroke();
          line(ctx, point.x, point.y, point.x + 10, point.y + 10);
          ctx.stroke();
          break;
        case "right":
          line(ctx, point.x, point.y, point.x - 10, point.y - 10);
          ctx.stroke();
          line(ctx, point.x, point.y, point.x - 10, point.y + 10);
          ctx.stroke();
          break;
      }
      ctx.setLineDash([5, 0]);
      for (var point of obj.points) {
        if (point == obj.origin) {
          circle(ctx, point.x, point.y, thickness);
          ctx.fill();
        }
        switch (point.dir) {
          case "down":
            ctx.fillText(
              point.name,
              point.x - (point.name.length - 1) * 3 - 5,
              point.y + 20
            );
            break;
          case "up":
            ctx.fillText(
              point.name,
              point.x - (point.name.length - 1) * 3 - 5,
              point.y - 10
            );
            break;
          case "left":
            ctx.fillText(
              point.name,
              point.x - point.name.length * 10 - 8,
              point.y + 8
            );
            break;
          case "right":
            ctx.fillText(point.name, point.x + 10, point.y + 8);
            break;
        }
        ctx.stroke();
      }
    }
}

function draw() {
  draw_screen();
  result_points = [];
  result_points = [];
  result_objs = [];
  for (var obj of objs) {
    ctx.setLineDash([5, 3]);
    ctx.strokeStyle = colors[objs.indexOf(obj)];
    ctx.fillStyle = colors[objs.indexOf(obj)];
    var orig = obj.origin;
    var end = obj.end;
    var f = points[points.length-1];
    line(ctx, end.x, end.y, l_x, end.y);
    ctx.stroke();
    //* AO = f
    if (end.x >= w/2-focal_distance-3 && end.x <= w/2-focal_distance+3) {
      var k = Math.max(w-f.x, h-f.y);
      var l = Math.max(w-center[0], h-center[1]);
      line(ctx, l_x, end.y, f.x+k, f.y+k);
      ctx.stroke();
      line(ctx, end.x, end.y, center[0]+l, center[1]+l);
      ctx.stroke();
    }
    //* AO = 2f 
    else if (end.x >= w/2-focal_distance*2-3 && end.x <= w/2-focal_distance*2+3) {
      var reverse_x = -end.x + 2 * center[0];
      var reverse_y = -end.y + 2 * center[1];
      lw1 = Math.abs(l_x - reverse_x);
      lh1 = Math.abs(end.y - reverse_y);
      lw2 = Math.abs(end.x - reverse_x);
      lh2 = Math.abs(end.y - reverse_y);
      new_x1 = Math.min(l_x, reverse_x) + lw1 + (lw1 * add) / lw1;
      new_y1 = Math.min(end.y, reverse_y) + lh1 + (lh1 * add) / lw1;
      new_x2 = Math.min(end.x, reverse_x) + lw2 + (lw2 * add) / lw2;
      new_y2 = Math.min(end.y, reverse_y) + lh2 + (lh2 * add) / lw2;
      line(ctx, l_x, end.y, new_x1, new_y1);
      ctx.stroke();
      line(ctx, end.x, end.y, new_x2, new_y2);
      ctx.stroke();
      var new_orig = new Point(orig.name + "'", reverse_x, orig.y, "up");
      var new_end = new Point(end.name + "'", reverse_x, reverse_y, "down");
      result_points.push(new_orig, new_end);
      result_objs.push(new Obj(new_orig, new_end))
      get_passable();
      draw_result_points();
    } 
    //* AO < f
    else if (end.x > w/2-focal_distance) {
      var m = 75; 
      var n = f.y+m-center[1]; 
      line(ctx, l_x, end.y, f.x+m+f.y/f.x*m, f.y+m);
      ctx.stroke();
      line(ctx, end.x, end.y, center[0]+n, center[1]+n);
      ctx.stroke();
    } 
    //* AO > 2f  ||  2f > AO > f
    else {
      var fCoords = [f.x, f.y];
      var cCoords = [center[0], center[1]];
      var x1 = fCoords[0];
      var x2 = cCoords[0];
      var y1 = fCoords[1];
      var y2 = cCoords[1];
      var transfa = [];
      var transfb = [];
      lw = Math.abs(x1 - x2);
      lh = Math.abs(y1 - y2);
      while ([x1, y1] != [x2, y2] && !transfb.includes([x1, y1]) && !transfa.includes([x2, y2]) && x1 < 1000) {
        x1 += 1;
        x2 += 1;
        lw = Math.abs(x1 - x2);
        y1 = 1;
        y2 = 1;
        lh = Math.abs(y1 - y2);
        transfa.push([x1, y1]);
        transfb.push([x2, y2]);
      }
      x1 = transfb.includes([x2, y2]) ? x2 : x1;
      y1 = transfb.includes([x2, y2]) ? y2 : y1;
      line(ctx, l_x, end.y, x1, y1);
      ctx.stroke();
      line(ctx, end.x, end.y, x1, y1);
      ctx.stroke();
      var new_orig = new Point(orig.name + "'", x1, orig.y, "up");
      var new_end = new Point(end.name + "'", x1, y1, "down");
      result_points.push(new_orig, new_end);
      result_objs.push(new Obj(new_orig, new_end))
      get_passable();
      draw_result_points();
    }
  }
}
draw();