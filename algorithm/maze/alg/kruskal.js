var canvas;
var ctx;
var MaxLengthX;
var MaxLengthY;
const BlockSize = 15
const UnProcessedGrid = []
const MazeMapValue = []
const GridByValue = []
const [
    DirectionNorth,
    DirectionWest,
    DirectionSouth,
    DirectionEast,
] = [ "N", "W", "S", "E" ]

class GridData {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
}

function initializeMapGrids(width, height) {
    MaxLengthX = width / BlockSize
    MaxLengthY = height / BlockSize

    // start from 0 - lastIndex-1
    var xStartEdge = 0
    var yStartEdge = 0
    var xLastEdge = MaxLengthX - 1
    var yLastEdge = MaxLengthY - 1

    // i = y, j = x
    var posValue = 1;
    for ( var i = 0 ; i < MaxLengthY ; i++) {
        MazeMapValue[i] = []
        for (var j = 0 ; j < MaxLengthX ; j++) {
            mapVal = 0

            if (i == yStartEdge || i == yLastEdge || j == xStartEdge || j == xLastEdge) { // for border map
                mapVal = 0
            } else {
                if (j%2 != 0 && i%2 != 0) {
                    mapVal = posValue
                    posValue++
                } else {
                    mapVal = 0
                }
            }

            MazeMapValue[i][j] = mapVal
            if (mapVal != 0) {
                var gridData = new GridData(j, i)
                UnProcessedGrid.push(gridData)
                GridByValue[mapVal] = [gridData]
            }
        }
    }
}

function shuffle(array) {
  let currentIndex = array.length;

  while (currentIndex != 0) {

    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
}

function simpleKruskal() {
    if (UnProcessedGrid.length > 0) {
        var processingGrid = UnProcessedGrid.pop()
        var processingMapValue = MazeMapValue[processingGrid.y][processingGrid.x]
        var stringDirection = "NWSE";
        var startDirIdx = Math.floor(Math.random() * (stringDirection.length-1))
        var dx, dy;

        var isNextValid = false
        var dirIdx = startDirIdx
        while (!isNextValid) {
            var direction = stringDirection.charAt(dirIdx)

            if (direction == DirectionNorth) [dy, dx] = [processingGrid.y + 2, processingGrid.x + 0]
            else if (direction == DirectionWest) [dy, dx] = [processingGrid.y + -2, processingGrid.x + 0]
            else if (direction == DirectionSouth) [dy, dx] = [processingGrid.y + 0, processingGrid.x -2]
            else if (direction == DirectionEast) [dy, dx] = [processingGrid.y + 0, processingGrid.x + 2]

            if (dy > 0 && dy < MazeMapValue.length) {
                if (dx > 0 && dx < MazeMapValue.length) {
                    if (MazeMapValue[dy][dx] != processingMapValue) {
                        isNextValid = true
                    }
                }
            }

            dirIdx = dirIdx + 1
            if (dirIdx >= stringDirection.length) {
                dirIdx = 0
            }

            if (dirIdx == startDirIdx) {
                break
            }
        }

        if (isNextValid) {
            if (processingGrid.y > dy) {
                for (var i = dy ; i <= processingGrid.y ; i++) {
                    MazeMapValue[i][processingGrid.x] = processingMapValue
                }
            } else if (dy > processingGrid.y) {
                for (var i = processingGrid.y ; i <= dy ; i++) {
                    MazeMapValue[i][processingGrid.x] = processingMapValue
                }
            } else if (processingGrid.x > dx) {
                for (var i = dx ; i <= processingGrid.x ; i++) {
                    MazeMapValue[processingGrid.y][i] = processingMapValue
                }
            } else if (dx > processingGrid.x) {
                for (var i = processingGrid.x ; i <= dx ; i++) {
                    MazeMapValue[processingGrid.y][i] = processingMapValue
                }
            }
        }
    }
}

function kruskal() {
    if (UnProcessedGrid.length > 0) {
        var processingGrid = UnProcessedGrid.pop()
        var processingMapValue = MazeMapValue[processingGrid.y][processingGrid.x]
        var stringDirection = "NWSE";
        var startDirIdx = Math.floor(Math.random() * (stringDirection.length-1))
        var dx, dy;

        var isNextValid = false
        var dirIdx = startDirIdx
        while (!isNextValid) {
            var direction = stringDirection.charAt(dirIdx)

            if (direction == DirectionNorth) [dy, dx] = [processingGrid.y + 2, processingGrid.x + 0]
            else if (direction == DirectionWest) [dy, dx] = [processingGrid.y + -2, processingGrid.x + 0]
            else if (direction == DirectionSouth) [dy, dx] = [processingGrid.y + 0, processingGrid.x -2]
            else if (direction == DirectionEast) [dy, dx] = [processingGrid.y + 0, processingGrid.x + 2]

            if (dy > 0 && dy < MazeMapValue.length) {
                if (dx > 0 && dx < MazeMapValue.length) {
                    if (MazeMapValue[dy][dx] != processingMapValue) {
                        isNextValid = true
                    }
                }
            }

            dirIdx = dirIdx + 1
            if (dirIdx >= stringDirection.length) {
                dirIdx = 0
            }

            if (dirIdx == startDirIdx) {
                break
            }
        }
        
        // Update map value
        if (isNextValid) {
            var gridByValueArr = []

            if (processingGrid.y > dy) {
                for (var i = dy ; i <= processingGrid.y ; i++) {
                    var targetMapVal = MazeMapValue[i][processingGrid.x]
                    if (targetMapVal > 0 && targetMapVal != processingMapValue) {
                        for (var j = 0 ; j < GridByValue[targetMapVal].length ; j++) {
                            var targetGrid = GridByValue[targetMapVal][j]
                            MazeMapValue[targetGrid.y][targetGrid.x] = processingMapValue
                            gridByValueArr.push(targetGrid)
                        }
                        GridByValue[targetMapVal] = []
                    } else {
                        MazeMapValue[i][processingGrid.x] = processingMapValue
                        gridByValueArr.push(new GridData(processingGrid.x, i))
                    }
                }
            } else if (dy > processingGrid.y) {
                for (var i = processingGrid.y ; i <= dy ; i++) {
                    var targetMapVal = MazeMapValue[i][processingGrid.x]
                    if (targetMapVal > 0 && targetMapVal != processingMapValue) {
                        for (var j = 0 ; j < GridByValue[targetMapVal].length ; j++) {
                            var targetGrid = GridByValue[targetMapVal][j]
                            MazeMapValue[targetGrid.y][targetGrid.x] = processingMapValue
                            gridByValueArr.push(targetGrid)
                        }
                        GridByValue[targetMapVal] = []
                    } else {
                        MazeMapValue[i][processingGrid.x] = processingMapValue
                        gridByValueArr.push(new GridData(processingGrid.x, i))
                    }
                }
            } else if (processingGrid.x > dx) {
                for (var i = dx ; i <= processingGrid.x ; i++) {
                    var targetMapVal = MazeMapValue[processingGrid.y][i]
                    if (targetMapVal > 0 && targetMapVal != processingMapValue) {
                        for (var j = 0 ; j < GridByValue[targetMapVal].length ; j++) {
                            var targetGrid = GridByValue[targetMapVal][j]
                            MazeMapValue[targetGrid.y][targetGrid.x] = processingMapValue
                            gridByValueArr.push(targetGrid)
                        }
                        GridByValue[targetMapVal] = []
                    } else {
                        MazeMapValue[processingGrid.y][i] = processingMapValue
                        gridByValueArr.push(new GridData(i, processingGrid.y))
                    }
                }
            } else if (dx > processingGrid.x) {
                for (var i = processingGrid.x ; i <= dx ; i++) {
                    var targetMapVal = MazeMapValue[processingGrid.y][i]
                    if (targetMapVal > 0 && targetMapVal != processingMapValue) {
                        for (var j = 0 ; j < GridByValue[targetMapVal].length ; j++) {
                            var targetGrid = GridByValue[targetMapVal][j]
                            MazeMapValue[targetGrid.y][targetGrid.x] = processingMapValue
                            gridByValueArr.push(targetGrid)
                        }
                        GridByValue[targetMapVal] = []
                    } else {
                        MazeMapValue[processingGrid.y][i] = processingMapValue
                        gridByValueArr.push(new GridData(i, processingGrid.y))
                    }
                }
            }
            
            GridByValue[processingMapValue] = gridByValueArr
        }
    }
}

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

function draw() {
    // kruskal
    simpleKruskal();
    for (var i = 0 ; i < MaxLengthY ; i++) {
        for (var j = 0 ; j < MaxLengthX ; j++) {
            if (MazeMapValue[i][j] == 0) {
                ctx.fillStyle = "black"
                ctx.fillRect(j*BlockSize, i*BlockSize, BlockSize, BlockSize)
            } else {
                ctx.fillStyle = "white"
                ctx.fillRect(j*BlockSize, i*BlockSize, BlockSize, BlockSize)
            }
        }
    }
    // delay(1000).then(() => window.requestAnimationFrame(draw));
    window.requestAnimationFrame(draw)
}

function main() {
    if (canvas.clientWidth % BlockSize != 0 || canvas.clientHeight % BlockSize != 0) {
        alert(`Invalid map, must be able to be modded by ${BlockSize} equal 0, width=${canvas.clientWidth%20}, height=${canvas.clientHeight%20}`)
        return
    }

    initializeMapGrids(canvas.clientWidth, canvas.clientHeight)
    shuffle(UnProcessedGrid)

    window.requestAnimationFrame(draw);
}

window.onload = function() {
    canvas = document.getElementById("canvas-maze-kruskal");
    ctx = canvas.getContext("2d");
    main();
}