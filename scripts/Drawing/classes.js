var ids = 0;
class Obj {
    constructor(origin, end, id=-1) {
        this.origin = origin;
        this.end = end;
        this.points = [origin, end];
        this.dir = end.y < center[1] ? 1 : (end.y == center[1] ? 0 : -1); // 1 up; 0 down
        if (id < 0){
            this.id = ids;
            ids++;
        } else {
            this.id = id;
        }
    }
    
}

class Point {
    constructor(name, x, y) {
        this.name = name;
        this.x = x;
        this.y = y;
    }
}