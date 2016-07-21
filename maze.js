var c = document.getElementById("mazeCanvas");
var ctx = c.getContext("2d");
var cells = [];
var cellStack = [];
var currentCell;
var width = 100;
var height = 100;
var cellSize = 10;
var totalCells = (width / cellSize) * (height / cellSize);
var visitedCells = 1;
var anim = null;
var playerCell = null;

window.onkeydown = function(event) {
  if (event.key=="ArrowUp") {
    if (playerCell.north != "border" && playerCell.north != "wall") {
      playerCell
    }
  } else if (event.key=="ArrowRight") {
    if (playerCell.east != "border" && playerCell.east != "wall") {

    }
  } else if (event.key=="ArrowDown") {
    if (playerCell.south != "border" && playerCell.south != "wall") {

    }
  } else if (event.key=="ArrowLeft") {
    if (playerCell.west != "border" && playerCell.west != "wall") {

    }
  }
}

function refreshMaze() {
  if (anim) {
    cancelAnimationFrame(anim);
  }
  cells = [];
  cellStack = [];
  currentCell;
  width = 100;
  height = 100;
  cellSize = 10;
  totalCells = (width / cellSize) * (height / cellSize);
  visitedCells = 1;
  if (document.getElementById('map-small').checked) {
    width = 100;
    height = 100;
  } else if (document.getElementById('map-medium').checked) {
    width = 200;
    height = 200;
  } else if (document.getElementById('map-large').checked) {
    width = 500;
    height = 500;
  }
  if (document.getElementById('cell-small').checked) {
    cellSize = 10;
  } else if (document.getElementById('cell-medium').checked) {
    cellSize = 20;
  } else if (document.getElementById('cell-large').checked) {
    cellSize = 50;
  }
  c.width = width;
  c.height = height;
  totalCells = (width / cellSize) * (height / cellSize);
  for (x = 0; x < width; x += cellSize) {
    for (y = 0; y < height; y += cellSize) {
      cells[cells.length] = new Cell(x, y, cells.length);
    }
  }
  currentCell = cells[0];
  playerCell = cells[0];
  createMaze();
};

function createMaze() {
  currentCell.gray();
  if (visitedCells < totalCells || cellStack.length > 0) {
    currentCell.visit();
    var neighborArray = currentCell.getNeighbors();
    if (neighborArray.length > 0) {
      var choice = Math.floor(Math.random() * neighborArray.length);
      availableCell = neighborArray[choice];
      breakWall(currentCell, availableCell);
      currentCell.gray();
      availableCell.gray();
      cellStack.push(currentCell);
      currentCell = availableCell;
      visitedCells++;
    } else {
      currentCell.white();
      currentCell = cellStack.pop();
    }
  } else {
    playMaze();
  }
  anim = requestAnimationFrame(createMaze);
}

function playMaze() {
  ctx.fillStyle = "#0f0";
  ctx.fillRect(1, 1, cellSize - 2, cellSize - 2);
  ctx.fillStyle = "#f00";
  ctx.fillRect(width - cellSize + 1, height - cellSize + 1, cellSize - 2, cellSize - 2);
}

function breakWall(currentCell, availableCell) {
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = cellSize - 2;
  ctx.beginPath();
  ctx.moveTo(currentCell.x + (cellSize / 2), currentCell.y + (cellSize / 2));
  ctx.lineTo(availableCell.x + (cellSize / 2), availableCell.y + (cellSize / 2));
  ctx.stroke();
}

function Cell(x, y, index) {
  this.x = x;
  this.y = y;
  this.index = index;
  this.north = "wall";
  this.west = "wall";
  this.south = "wall";
  this.east = "wall";
  this.player = false;
  if (this.index < width / cellSize) {
    this.west = "border";
  }
  if (this.index >= totalCells - (width / cellSize)) {
    this.east = "border";
  }
  if (this.index % (width / cellSize) == 0) {
    this.north = "border";
  }
  if ((this.index + 1) % (width / cellSize) == 0) {
    this.south = "border";
  }
  this.visited = false;
  ctx.fillStyle = "#fff";
  ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);

  this.visit = function() {
    this.visited = true;
  }

  this.gray = function() {
    ctx.fillStyle = "#ccc";
    ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
  }

  this.white = function() {
    ctx.fillStyle = "#fff";
    ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
  }

  this.getNeighbors = function() {
    var neighbors = [];
    // Check north
    if (this.north != "border") {
      if (cells[this.index - 1].visited == false) {
        neighbors[neighbors.length] = cells[this.index - 1];
      }
    }
    // Check west
    if (this.west != "border") {
      if (cells[this.index - (width / cellSize)].visited == false) {
        neighbors[neighbors.length] = cells[this.index - (width / cellSize)];
      }
    }
    // Check south
    if (this.south != "border") {
      if (cells[this.index + 1].visited == false) {
        neighbors[neighbors.length] = cells[this.index + 1];
      }
    }
    // Check east
    if (this.east != "border") {
      if (cells[this.index + (width / cellSize)].visited == false) {
        neighbors[neighbors.length] = cells[this.index + (width / cellSize)];
      }
    }

    return neighbors;
  }
}
