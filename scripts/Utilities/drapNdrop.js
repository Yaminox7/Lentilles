var dragged = [];

function isInsidePoint(x, y, point) {
    var dx = x - point.x;
    var dy = y - point.y;
    // console.log(point.name, x, y, point.x, point.y, dx*dx + dy*dy <= pointWidth*pointWidth);
    // if (dx*dx + dy*dy <= pointWidth*pointWidth) console.log("I'm in side point ", point);
    return dx*dx + dy*dy <= pointWidth*pointWidth;
}

function keepInsideBox(point) {
    if (point[0].x < (width - opt_axe_width) / 2) {
        point[0].x = (width - opt_axe_width) / 2;
        point[1].origin.x = (width - opt_axe_width) / 2;
        point[1].end.x = (width - opt_axe_width) / 2;
    } else if (point[0].x + pointWidth > width / 2 - 20) {
        point[0].x = width / 2 - 20;
        point[1].origin.x = width / 2 - 20;
        point[1].end.x = width / 2 - 20;
    }
    if (point[0].y < (height - opt_axe_height)/2+ax_arrow_y+10 && point[0] == point[1].end) {
        point[0].y = (height - opt_axe_height)/2+ax_arrow_y+10;
        point[1].end.y = (height - opt_axe_height)/2+ax_arrow_y+10;
    } else if (point[0].y + pointWidth > height-77 && point[0] == point[1].end) {
        point[0].y = height-77;
        point[1].end.y = height-77; 
    }
}

canvas.addEventListener('mousedown', function(e) {
    var mouseX = e.offsetX; //e.clientX;
    var mouseY = e.offsetY; //e.clientY;
    for (var obj of objects) {
        for (var point of obj.points) if (isInsidePoint(mouseX, mouseY, point)) dragged = [point, obj];
    }
});

canvas.addEventListener('mousemove', function(e) {
    if (dragged.length > 0) {
        changecursor("grabbing");
        dragged[0].x = e.offsetX; //e.clientX;
        dragged[1].origin.x = e.offsetX; //e.clientX;
        dragged[1].end.x = e.offsetX; //e.clientX;
        if (dragged[0] == dragged[1].end) {
            dragged[0].y = e.offsetY; //e.clientY;
            dragged[1].end.y = e.offsetY; //e.clientY;
            changeDir(dragged[1]);
        }
        keepInsideBox(dragged);
        update(dragged[1]);
        draw();
    } else {
        var changedAny = false;
        for (var obj of objects) {
            for (var point of obj.points) { 
                if (isInsidePoint(e.offsetX, e.offsetY, point)) {
                    changedAny = true; break;
                }
            }
            if (changedAny) break;
        }
        changecursor(changedAny ? "grab" : "default");
    }
});

canvas.addEventListener('mouseup', function(e) {
    changecursor("default");
    dragged = [];
});

function changecursor(cursor) {
    canvas.style.cursor = cursor;
}

function changeDir(obj) {
    obj.dir = obj.end.y < center[1] ? 1 : obj.end.y == center[1] ? 0 : -1;
}

function update(obj) {
    var listElement = document.getElementById(obj.id.toString());
    var scale = 2.54 / 96; var precision = 10; var index = objects.indexOf(obj);
    var oname = obj.origin.name;
    var ename = obj.end.name;
    var cname = basic_points[0].name;
    var objname = oname + ename;
    var sep = "&nbsp; ; "; 
    var x1 = Math.floor(precision * scale * (obj.origin.x - w + opt_axe_width/2)) / precision;
    var x2 = Math.floor(precision * scale * (obj.end.x - w + opt_axe_width/2)) / precision;
    var y1 = Math.floor(precision * scale * (-obj.origin.y + h)) / precision;
    var y2 = Math.floor(precision * scale * (-obj.end.y + h)) / precision;
    var dstfocaleOO = scale * Math.abs(obj.origin.x - center[0]);
    var odstfocaleOO = "-";
    var fdstfocaleOO = scale * Math.abs(basic_points[1].x - center[0]);
    var zoom = 0;
    var state = "&nbsp" + oname + cname;
    var indicator = "";
    if (dstfocaleOO > 2 * fdstfocaleOO) { state += "&nbsp>&nbsp2f"; indicator = "plus petite"; }
    else if (dstfocaleOO == 2 * fdstfocaleOO) { state += "&nbsp=&nbsp2f"; indicator = "la même"; }
    else if (dstfocaleOO < 2 * fdstfocaleOO && dstfocaleOO > fdstfocaleOO) { state = "2f&nbsp>&nbsp" + oname + cname + "&nbsp>&nbspf"; indicator = "plus grande"; }
    else if (dstfocaleOO == fdstfocaleOO) { state += "&nbsp=&nbspf"; indicator = "à l\u2019infini"; }
    else { state += "&nbsp<&nbspf"; indicator = "virtuelle et plus grande"; }
    if (image_objects[index] != 0 && image_objects.length-1 > index) {
        odstfocaleOO = scale * Math.abs(image_objects[index].origin.x - center[0]);
        zoom = Math.floor(10000 * odstfocaleOO / dstfocaleOO) / 100 + "%";
    }
    for (var i = 0; i < listElement.childElementCount; i++) {
        var element = listElement.children[i];
        if (element.tagName == "TABLE") {
            element.innerHTML = "<tr><td class='left'>"+x1+"</td><td>"+x2+"</td></tr><tr><td class='left'>"+y1+"</td><td>"+y2+"</td></tr>"
        } else if (element.className == "dstc") {
            element.innerHTML = cname + oname + " = " + Math.floor(precision * dstfocaleOO) / precision;
        } else if (element.className == "img") {
            element.innerHTML = odstfocaleOO != "-" ? cname + oname + "' = " + Math.floor(precision * odstfocaleOO) / precision + ";" : "";
        } else if (element.className == "fraction") {
            element.innerHTML = odstfocaleOO != "-" ? "&nbsp;<span class='frac'><sup>"+cname+oname+"'</sup><span>&frasl;</span><sub>"+cname+oname+"</sub></span>&nbsp= " + zoom + ";&nbsp" : "";
        } else if (element.classList[0] == "state") {
            element.setAttribute("title", "L\u2019 image de l\u2019objet " + oname + ename  + " est " + indicator);
            element.innerHTML = state;
        }
    }
}