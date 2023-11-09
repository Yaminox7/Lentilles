var colorDiv = document.getElementById("cols");
var bginput = document.getElementById("bgi");
var cbginput = document.getElementById("cbgi");
var cainput = document.getElementById("cai");
var cfinput = document.getElementById("cfi");
var ctinput = document.getElementById("cti");
var ctfinput = document.getElementById("ctfi");
var hpninput = document.getElementById("hpni");
var objectsListParent = document.getElementById("objs");
var fonts = ["Arial", "Verdana", "Tahoma", "Trebuchet MS", "Times New Roman", "Georgia", "Garamond", "Courier New", "Brush Script MT", "Cursive"];

fonts.forEach(font => {
    var opt = document.createElement("option");
    opt.value = font.toLowerCase();
    opt.innerText = capitalize(font);
    opt.style.fontFamily = capitalize(font);
    ctfinput.appendChild(opt);
});

bginput.value = rgbToHex(window.getComputedStyle(document.body)["backgroundColor"]);
cbginput.value = Hex(backgroundColor);
cainput.value = Hex(axeColor);
cfinput.value = Hex(fillColor);
ctinput.value = Hex(textColor);
ctfinput.value = textFamily.toLowerCase();

bginput.oninput = () => {
    document.body.style.backgroundColor = bginput.value;
};

cbginput.oninput = () => {
    backgroundColor = cbginput.value;
    draw();
};

cainput.oninput = () => {
    axeColor = cainput.value;
    draw();
};

cfinput.oninput = () => {
    fillColor = cfinput.value;
    draw();
};

ctinput.oninput = () => {
    textColor = ctinput.value;
    draw();
};

ctfinput.onchange = () => {
    textFamily = ctfinput.value;
    objectsListParent.lastChild.style.fontFamily = ctfinput.value;
    ctx.font = textSize + "px " + textFamily;
    ctfinput.style.fontFamily = capitalize(ctfinput.value);
    draw();
}

hpninput.onchange = () => {
    showPointsNames = !hpninput.checked;
    draw();
}

var offy1i = document.getElementById("offsety1");
var offy2i = document.getElementById("offsety2");
var offy1t = document.getElementById("offsety1v");
var offy2t = document.getElementById("offsety2v");

offy1i.value = nameY2Offset;
offy2i.value = nameY1Offset;
offy1t.innerText = nameY2Offset;
offy2t.innerText = nameY1Offset;

offy1i.oninput = () => {
    nameY2Offset = parseInt(offy1i.value);
    offy1t.innerText = offy1i.value;
    draw();
};

offy2i.oninput = () => {
    nameY1Offset = parseInt(offy2i.value);
    offy2t.innerText = offy2i.value;
    draw();
};

function capitalize(string) {
    return string[0].toUpperCase() + string.toLowerCase().replace(string.toLowerCase()[0], "");
}

function rgbToHex(rgb) {
    rgb = rgb.toLowerCase().replace("rgb(", "").replace(")", "").split(",");
    return "#" + parseInt(rgb[0]).toString(16) + parseInt(rgb[1]).toString(16) + parseInt(rgb[2]).toString(16);
}

function Hex(hex) {
    hex = hex.toLowerCase().replace("#", "");
    if (hex.length == 6) return "#" + hex;
    if (hex.length == 3) return "#" + hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    if (hex.length == 1) return "#" + hex[0] + hex[0] + hex[0] + hex[0] + hex[0] + hex[0];
}