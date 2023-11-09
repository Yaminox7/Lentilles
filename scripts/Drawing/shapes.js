function line(ctx, x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.closePath();
}

function rect(ctx, x, y, width, heigth) {
    ctx.beginPath();
    ctx.rect(x, y, width, heigth);
    ctx.closePath();
}

// function custom_rect(ctx, x1, y1, x2, y2) {
    //     ctx.rect(x1, y1, );
    // }
    
function circle(ctx, x, y, radius) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.closePath();
}

function arc(ctx, x, y, radius, startAngle, endAngle, counter=false) {
    ctx.beginPath();
    ctx.arc(x, y, radius, Math.PI * startAngle, Math.PI * endAngle, counter);
    ctx.closePath();
}

function getTextSize(ctx, text) {
    var size = ctx.measureText(text);
    return [size.width, size.heigth];
}

function getTextWidth(ctx, text) {
    return ctx.measureText(text).width;
}

function getTextHeigth(ctx, text) {
    return ctx.measureText(text).heigth;
}