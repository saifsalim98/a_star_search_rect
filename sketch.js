var cnv;  // create a canvas variable

// function to remove any element from the set
function removeFromSet(arr,element) {  
    for(var i = arr.length -1 ; i >= 0 ; i--) {
        if(arr[i]==element) {
            arr.splice(i,1);
        }
    }
}

// function to calculate the heuristics
function heuristic(a,b) {
    var d = abs(a.i-b.i) + abs(a.j-b.j); // Manhattan distance
    return d;  // Sum of absolute differences of the Cartesian coordinates of two points.
}

// function to align the canvas in the middle of the screen
function centerCanvas() {
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  cnv.position(x, y);
}

var cols = 3; // number of columns in the grid
var rows = 3; // number of rows in the grid
var grid = new Array(cols);

var openSet = []; // element that has been discovered
var closedSet = []; // element that has been evaluated
var start; // element at (1,1)
var end; // element at (n,n)
var count = 0;
var path = []; // the best path until the last element is evaluated
var noSolution = false; // boolean value which will be one when any present element will be the end element

function Element(i, j) {
    this.i = i; // x-coordinate
    this.j = j; // y-coordinate
    this.f = 0; // fScore
    this.g = 0; // gScore
    this.h = 0; // hScore
    this.neighbours = []; // neighbours of a particular element
    this.previous = undefined; // previous element of the neighbour
    this.wall = false;  // wall resembles obstacles
    if (random(1) < 0.3) { 
        this.wall = true;
    }
    this.show = function (col) {
        fill(col);
        if (this.wall) {
            fill(0);
        }
        noStroke();
        rect(this.i * w +1 , this.j * h +1 , w - 2 , h - 2); // rect(x, y, length, breadth)
    }

    // excluding diagonal neighbours
    this.addNeighbours = function (grid) {
        var i = this.i;
        var j = this.j;
        if (i < cols -1) {
            this.neighbours.push(grid[i+1][j]);
        }
        if (i > 0) {
            this.neighbours.push(grid[i-1][j]);
        }
        if (j < rows -1){
            this.neighbours.push(grid[i][j+1]);
        }
        if (j > 0){
            this.neighbours.push(grid[i][j-1]);
        }
    }
}

// Creating a canvas
function setup() {
    cnv = createCanvas(500, 500);
    console.log('A*');

    w = width / cols; // (width of canvas / number of colums)
    h = height / rows; // (height of canvas / number of rows)

    // Making a grid or 2D array 
    for (var i = 0; i < cols; i++) {
        grid[i] = new Array(rows);
    }

    // Initializing each element in the grid 
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            grid[i][j] = new Element(i, j);
        }
    }
    
    // storing neighbours of each and every elements in the grid
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            grid[i][j].addNeighbours(grid);
        }
    }

    start = grid[0][0];
    end = grid[cols - 1][rows - 1];
    start.wall = false; // start should not be an obstacle
    end.wall = false; // end should not be an obstacle

    openSet.push(start); // initialize start in openSet

}

function draw() {
    // while loop is not needed because the draw function itself iterates 60 times a second

    // slow down the iteration of draw() to 1 iteration per second 
    frameRate(1);
    // loop until the openSet queue contains no element
    if (openSet.length > 0) {
        
        // initialize the first element of openSet queue as winner
        var winner = 0;
        
        // compare the fScore of all the elements of openSet and assign winner to the element having least fScore
        for ( var i = 0; i < openSet.length; i++) {
            if (openSet[i].f < openSet[winner].f)
                winner = i;
        }
        
        // declare the winner element as present 
        var present = openSet[winner];
        
        // if present is equal to end element then stop looping the draw() and show the length of the path in the console
        if ( present === end) {
            noLoop();
            console.log(path.length+1);
            console.log('Done');
        }
        
        // remove the present element from openSet(discovered) and push it to closedSet(evaluated)
        removeFromSet(openSet, present);
        closedSet.push(present);
        
        // declare the neighbours of present elements as neighbours
        var neighbours = present.neighbours;
        
        // loop through all the neighbours and calculate their gScore, heuristics and hence the hScore
        // also push the neighbour into openSet which has just been discovered 
        for (var i = 0; i < neighbours.length ; i++) {
            
            var neighbour = neighbours[i];
            
            if (!closedSet.includes(neighbour) && !neighbour.wall) {
            var tempG = present.g + 1;
            
                if (openSet.includes(neighbour)) {
                    if (tempG < neighbour.g) {
                        neighbour.g = tempG;
                    }
                } else {
                    neighbour.g = tempG;
                    openSet.push(neighbour);
                }    
                neighbour.h = heuristic(neighbour,end);
                neighbour.f = neighbour.g + neighbour.h;
                neighbour.previous = present;
            }
        }
            
        
        
        
    }
    
    // openSet queue is empty and the last evaluated element is not end element
    else {
        console.log('No solution');
        noSolution = true;
        noLoop();
    }
    
    // start with a black background of the canvas
    background(0);
    
    // paint all the elements as White
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            grid[i][j].show(color(255));
        }
    }
    
    // paint all the elements of the closedSet as Red
    for (var i = 0 ; i < closedSet.length; i++) {
        closedSet[i].show(color(255,0,0));
    }

    // paint all the elements of the openSet as Green
    for (var i = 0 ; i < openSet.length; i++) {
        openSet[i].show(color(0,255,0));
    }
    
    // while noSolution == True, means until it has been declared that there is no solution, draw the path from the
    // last evaluated element to the start element
    if (!noSolution) {
        path = [];
        var temp = present;
        path.push(temp);
        while (temp.previous) {
            path.push(temp.previous);
            temp = temp.previous;
        } 
    }
    
    // paint all the elements of the path as Blue
    for (var i = 0; i < path.length; i++) {
        path[i].show(color(0,0,255)); 
    }
    
}
