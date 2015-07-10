/**
 * Created by dombroco on 7/7/15.
 */

var WALLS = {
    'LEFT' : 0,
    'RIGHT' : 1,
    'TOP' : 2,
    'BOTTOM' : 3
};

var mazeSize = 0;
var cellSize = 20;
var maze = [];

function oppositeWall(location){
    if(location === WALLS.LEFT){
        return WALLS.RIGHT;
    }
    if(location === WALLS.RIGHT){
        return WALLS.LEFT;
    }
    if(location === WALLS.TOP){
        return WALLS.BOTTOM;
    }
    if(location === WALLS.BOTTOM){
        return WALLS.TOP;
    }
    throw new Error("Bad location: " + location);
}

function createMaze(size){
    mazeSize = size;
    // Initialize the cells
    for(i=0;i<size;i++){
        maze[i]=[];
        for(j=0;j<size;j++){
            var c = new Cell();
            maze[i][j] = c;
            var left = j > 0 ? maze[i][j-1] : undefined;
            var top = i > 0 ?  maze[i-1][j] : undefined;
            if(isThing(left)){
                left.addNeighbor(c,WALLS.RIGHT);
                c.addNeighbor(left,WALLS.LEFT);
            }
            if(isThing(top)){
                top.addNeighbor(c,WALLS.BOTTOM);
                c.addNeighbor(top,WALLS.TOP);
            }
        }
    }
    // Set-up the beginning and end cells
    maze[0][0].setWall(WALLS.TOP,false);
    maze[mazeSize-1][mazeSize-1].setWall(WALLS.BOTTOM,false);

    var stack = [];
    var randomX = randomInt(0,size-1);
    var randomY = randomInt(0,size-1);
    buildMaze(maze[randomX][randomY],stack);
    drawMaze(mazeSize,cellSize);
}

function removeJoiningWall(cellOne,cellTwo){
    if(cellOne == null || cellTwo == null){
        return;
    }

    if(cellTwo == cellOne.getNeighbor(WALLS.LEFT)){
        cellTwo.setWall(WALLS.RIGHT,false);
        cellOne.setWall(WALLS.LEFT,false);
    }else if(cellTwo == cellOne.getNeighbor(WALLS.RIGHT)){
        cellTwo.setWall(WALLS.LEFT,false);
        cellOne.setWall(WALLS.RIGHT,false);
    }else if(cellTwo == cellOne.getNeighbor(WALLS.TOP)){
        cellTwo.setWall(WALLS.BOTTOM,false);
        cellOne.setWall(WALLS.TOP,false);
    }else if(cellTwo == cellOne.getNeighbor(WALLS.BOTTOM)){
        cellTwo.setWall(WALLS.TOP,false);
        cellOne.setWall(WALLS.BOTTOM,false);
    }
}

function buildMaze(cell, visitedCells){
    if(cell == null){
        if(visitedCells.length > 0){
            visitedCells.pop();
        }
        return;
    }

    visitedCells.push(cell);
    cell.visited = true;
    while(!cell.allNeighborsVisited()){
        var neighbor = cell.getRandomUnvisitedNeighbor();

        removeJoiningWall(cell,neighbor);
        buildMaze(neighbor,visitedCells);
    }
}

function drawMaze(msize,csize){
    var canvas = document.getElementById("maze_canvas");
    var ctx = canvas.getContext('2d');
    ctx.strokeStyle = "rgb(0,0,0)";
    var x = 10;
    var y = 10;
    for(var i=0;i < msize;i++){
        for(var j=0;j < mazeSize; j++){
            var c = maze[i][j];
            var path = new Path2D();
            if(c.hasWall(WALLS.LEFT)){
                path.moveTo(x,y);
                path.lineTo(x,y+csize);
                ctx.stroke(path);
            }
            if(c.hasWall(WALLS.BOTTOM)){
                path.moveTo(x,y+csize);
                path.lineTo(x+csize,y+csize);
                ctx.stroke(path);
            }
            if(c.hasWall(WALLS.TOP)){
                path.moveTo(x,y);
                path.lineTo(x+csize,y);
                ctx.stroke(path);
            }
            if(c.hasWall(WALLS.RIGHT)){
                path.moveTo(x+csize,y);
                path.lineTo(x+csize,y+csize);
                ctx.stroke(path);
            }
            x = x + csize;
        }
        x = 10;
        y = y + csize;
    }
}

function Cell(){
    this.visited = false;
    this.neighbors = [null,null,null,null];
    this.walls = [true,true,true,true];
    this.thing = null;
}

Cell.prototype.addNeighbor = function (cell, location) {
    this.neighbors[location] = cell;
}

Cell.prototype.hasWall = function(wall){
    return this.walls[wall];
}

Cell.prototype.getNeighbor = function(location){
    return this.neighbors[location];
}

Cell.prototype.isEmpty = function () {
    return this.thing == null;
}

Cell.prototype.getThing = function(){
    return this.thing;
}

Cell.prototype.setThing = function(o){
    this.thing = o;
}

Cell.prototype.allNeighborsVisited = function(){
    for(i=0;i<this.neighbors.length;i++){
        var c = this.neighbors[i];
        if(c != null && !c.visited){
            return false;
        }
    }
    return true;
}

Cell.prototype.getRandomUnvisitedNeighbor = function () {
    var unvisited = [];
    for(i=0;i<this.neighbors.length;i++){
        var c = this.neighbors[i];
        if(c != null && !c.visited){
            unvisited.push(c);
        }
    }
    if(unvisited.length > 0) {
        var r = randomInt(0, unvisited.length);
        return unvisited[r];
    }
    return null;
}

Cell.prototype.setWall = function(indexNumber,hasWall){
    this.walls[indexNumber] = hasWall;
}

function isThing(thing){
    return typeof thing !== 'undefined';
}

function randomInt(){

    var min = isThing(arguments[0]) ? arguments[0] : 0;
    var max = isThing(arguments[1]) ? arguments[1] : 900000001;

    // In case the arguments are passed in the wrong order,
    // just swap them around.
    if(max < min){
        var temp = max;
        max = min;
        min = temp;
    }

    if(max == min){
        return max;
    }

    if(max - min <= 1){
        return 0;
    }

    var rand = Math.random() * 10000;
    // I don't know if Math.random() will return something
    // less than 1E-5, so just keep doing it until we do
    while(rand < 1){
        rand = Math.random() * 10000;
    }

    return Math.floor((rand % max) + min);
}