var objectDiv = document.getElementById("objs");
var unorderedList = document.createElement("ul");

document.body.onload = makeObjectList;
focal_distance_input.oninput =() => {
    focal_distance = parseFloat(focal_distance_input.value);
    focal_distance_input.setAttribute("data-title", focal_distance / 10);
    basic_points = [
        basic_points[0],
        new Point("F", (width-opt_axe_width)/2+focal_distance, center[1]),
        new Point("F'", (width+opt_axe_width)/2-focal_distance, center[1]),
    ];
    ctx.stroke();
    if (on) { draw(); }
    else { draw_screen(); }
    makeObjectList();
};

function makeObjectList() {
    objectDiv.appendChild(unorderedList);
    unorderedList.innerHTML = "";
    objects.forEach(obj => {
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
        if (image_objects[index] != 0 && image_objects.length-1 > index) {
            odstfocaleOO = scale * Math.abs(image_objects[index].origin.x - center[0]);
            zoom = Math.floor(10000 * odstfocaleOO / dstfocaleOO) / 100 + "%";
        }
        var listElement = document.createElement("li");
        var matrix = ": &nbsp<table class='matrix'><tr><td class='left'>"+x1+"</td><td>"+x2+"</td></tr><tr><td class='left'>"+y1+"</td><td>"+y2+"</td></tr></table>";
        var ctr = "<span class='dstc'>" + cname + oname + " = " + Math.floor(precision * dstfocaleOO) / precision + "</span>;";
        var img = "<span class='img'>" + cname + oname + "' = " + (odstfocaleOO != "-" ? Math.floor(precision * odstfocaleOO) / precision : "-") + ";</span>";
        var fract = "<span class='fraction'>&nbsp;<span class='frac'><sup>"+cname+oname+"'</sup><span>&frasl;</span><sub>"+cname+oname+"</sub></span>&nbsp= " + zoom + ";&nbsp</span>";
        var state = "&nbsp" + oname + cname;
        var indicator = "";
        if (dstfocaleOO > 2 * fdstfocaleOO) { state += "&nbsp>&nbsp2f"; indicator = "plus petite"; }
        else if (dstfocaleOO == 2 * fdstfocaleOO) { state += "&nbsp=&nbsp2f"; indicator = "la même"; }
        else if (dstfocaleOO < 2 * fdstfocaleOO && dstfocaleOO > fdstfocaleOO) { state = "2f&nbsp>&nbsp" + oname + cname + "&nbsp>&nbspf"; indicator = "plus grande"; }
        else if (dstfocaleOO == fdstfocaleOO) { state += "&nbsp=&nbspf"; indicator = "à l\u2019infini"; }
        else { state += "&nbsp<&nbspf"; indicator = "virtuelle et plus grande"; }
        var statespan = "&nbsp<span class='state " + indicator[0] + indicator[indicator.length-2] + "' title='L\u2019 image de l\u2019objet " + oname + ename  +" est " + indicator + "'>" + state + "</span>;&nbsp";
        var hide = document.createElement("button");
        hide.setAttribute("class", "hideButton");
        var Isoff = includes(obj.id, skip) ? "-off" : "";
        hide.innerHTML = '<ion-icon name="eye'+Isoff+'-outline"></ion-icon><ion-icon class="hidden" name="eye'+Isoff+'"></ion-icon>';
        listElement.appendChild(hide);
        hide.setAttribute("name", obj.id);
        hide.setAttribute(
            "onclick",
            'onclickhide(this);'
        );
        var cinput = document.createElement("input");
        cinput.setAttribute("type", "color");
        cinput.setAttribute("value", objects_color[index]);
        cinput.oninput = () => {
            objects_color[index] = cinput.value;
            listElement.style.color = objects_color[index];
            draw();
        };
        listElement.innerHTML += objname + matrix + sep + ctr + (odstfocaleOO == "-" ? "" : img + fract) + statespan;
        listElement.style.color = objects_color[index];
        listElement.appendChild(cinput);
        listElement.setAttribute("id", obj.id.toString());
        unorderedList.append(listElement);
    });
}

function createNewObject(name, origin, end, color=null) {
    color = color ? color : colors[(objects.length+1)%colors.length];
    objects.push(new Obj(origin, end));
    objects_color.push(color);
}

function getObjectById(id) {
    for (var obj of objects) {
        if (obj.id == parseInt(id)) { return obj; }
    }
}

function onclickhide(element) {
    if (element.firstChild.name == "eye-outline") {
        element.innerHTML = '<ion-icon name="eye-off-outline"></ion-icon><ion-icon class="hidden" name="eye-off"></ion-icon>';
        skip.push(parseInt(element.name));
    } else if (element.firstChild.name == "eye-off-outline") {
        element.innerHTML = '<ion-icon name="eye-outline"></ion-icon><ion-icon class="hidden" name="eye"></ion-icon>';
        spliceObject(element.name, skip);
    } 
    draw();
}