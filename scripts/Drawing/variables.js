var colors = [
    "#ff0000", // rouge
    "#00ff00", // vert (clair)
    "#0000ff", // bleu
    "#22dd22", // vert (normal)
    "#e70ee7", // mauve
    "#ffd700", // doré
    "#11d7d7", // cyan
    "#aaaaaa", // gris clair
    // "#555555", // gris foncé
    // "#000000", // taha
];
colors.sort(()=>Math.random()-0.5)

var pointWidth = 7;
var nameY1Offset = 35;
var nameY2Offset = 20;
var end_arrow_x = 10;
var end_arrow_y = 15;

var lineOffset = 200;

var ax_arrow_x = 10;
var ax_arrow_y = 15;
var opt_axe_width = 800;
var opt_axe_height = 400;
var focal_distance = 200;
var focal_distance_input = document.getElementById("dstf");
focal_distance_input.setAttribute("min", 20);
focal_distance_input.setAttribute("max", opt_axe_width / 2 - 20);
focal_distance_input.setAttribute("value", focal_distance);
focal_distance_input.setAttribute("data-title", focal_distance / 10);

var on = false;
var startBtn = document.getElementById("start");
var defaultColor = "#000";
var backgroundColor = "#fff";
var axeColor = "#000";
var textColor = "#000";
var fillColor = "#000";
var textSize = 20;
var textFamily = "Arial";
var showPointsNames = true;