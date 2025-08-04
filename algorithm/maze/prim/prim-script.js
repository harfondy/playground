function MainPrim() {
    var canvas = document.getElementById("canvas-maze-prim");
    var ctx = canvas.getContext("2d");
    var startX;
    var startY;
    var MaxLengthX;
    var MaxLengthY;
    const BlockSize = 15

    const MazeGridValue = []
    const frontier = []

    const [
        N, S, E, W
    ] = [1, 2, 4, 8] // 1000, 0100, 0010, 0001
    const MapDirectionValue = {
        "N": 1,
        "S": 2,
        "E": 4,
        "W": 8
    }
    const OPPOSITE_DIRECTION = {
        N: "S",
        S: "N",
        E: "W",
        W: "E"
    }
    const PATH = 0x10
    const FRONTIER = 0x20

    class GridData {
        constructor(x, y, EdgeDirX, EdgeDirY) {
            this.x = x
            this.y = y
            this.EdgeDirX = EdgeDirX
            this.EdgeDirY = EdgeDirY
        }
    }

    function initializeMapGrids(width, height) {
        // Determine max length of X and Y
        MaxLengthX = width / BlockSize
        MaxLengthY = height / BlockSize

        // i = y, j = x
        for ( var i = 0 ; i < MaxLengthY ; i++) {
            MazeGridValue[i] = []
            for (var j = 0 ; j < MaxLengthX ; j++) {
                var mapVal = 0

                if (i == 0 || i == MaxLengthY-1 || j == 0 || j == MaxLengthX-1) { // for border map
                    mapVal = -1
                }

                MazeGridValue[i][j] = mapVal
            }
        }
    }

    function mark(x, y) {
        MazeGridValue[y][x] |= PATH
        addFrontier(x-2, y)
        addFrontier(x+2, y)
        addFrontier(x, y-2)
        addFrontier(x, y+2)
    }

    function addFrontier(x, y) {
        if (x > 0 && y > 0 && y < MaxLengthY-1 && x < MaxLengthX-1 && MazeGridValue[y][x] == 0) {
            // 0 [000000] | 0x20 (32) = [000001]0x20 (32)
            // 0x10 [000010] (16) | 0x20 [000001] (32) = 0x30 (48)
            MazeGridValue[y][x] |= FRONTIER
            frontier.push(new GridData(x, y, "", ""))
        }
        
        // this is to make the edge as a frontier due to starting even and mapsize odd and the substract -2
        // made 1 is not processed because min 2 - 2 = 0 or 2 + 2 = mapsize
        // let edgeDirX = "";
        // let edgeDirY = "";
        // if (x == 0) {
        //     if (y == 0) edgeDirY = "S"
        //     else if(y == MaxLengthY) edgeDirY = "N"
        //     edgeDirX = "E"

        //     MazeGridValue[y][x+1] |= FRONTIER
        //     frontier.push(new GridData(x+1, y, edgeDirX, edgeDirY))
        // } else if (x == MaxLengthX) {
        //     if (y == 0) edgeDirY = "S"
        //     else if(y == MaxLengthY) edgeDirY = "N"
        //     edgeDirX = "W"

        //     MazeGridValue[y][x-1] |= FRONTIER
        //     frontier.push(new GridData(x-1, y, edgeDirX, edgeDirY))
        // } else if (y == 0) {
        //     if (x == 0) edgeDirX = "E"
        //     else if(x == MaxLengthY) edgeDirX = "W"
        //     edgeDirY = "S"

        //     MazeGridValue[y+1][x] |= FRONTIER
        //     frontier.push(new GridData(x, y+1, edgeDirX, edgeDirY))
        // } else if (y == MaxLengthY) {
        //     if (x == 0) edgeDirX = "E"
        //     else if(x == MaxLengthY) edgeDirX = "W"
        //     edgeDirY = "N"

        //     MazeGridValue[y-1][x] |= FRONTIER
        //     frontier.push(new GridData(x, y-1, edgeDirX, edgeDirY))
        // }
    }

    // when on the edge case, the starting even and maxlength odds
    function neighbors(x, y, edgeDirX, edgeDirY) {
        const n = []
        
        if (x+2 < MaxLengthX && (MazeGridValue[y][x+2] & PATH) != 0) {
            n.push(new GridData(x+2, y, "", ""))
        }

        if (x-2 > 0 && (MazeGridValue[y][x-2] & PATH) != 0) {
            n.push(new GridData(x-2, y, "", ""))
        }

        if (y+2 < MaxLengthY && (MazeGridValue[y+2][x] & PATH) != 0) {
            n.push(new GridData(x, y+2, "", ""))
        }

        if (y-2 > 0 && (MazeGridValue[y-2][x] & PATH) != 0) {
            n.push(new GridData(x, y-2, "", ""))
        }
        // Pending handle even odd, gridSize and starting point
        // if (edgeDirX == "W" && (MazeGridValue[y][x-1] & PATH) != 0) {
        //     n.push(new GridData(x-1, y, "", ""))
        // }
        // if (edgeDirX == "E" && (MazeGridValue[y][x+1] & PATH) != 0) {
        //     n.push(new GridData(x+1, y, "", ""))
        // }
        // if (edgeDirY == "N" && (MazeGridValue[y-1][x] & PATH) != 0) {
        //     n.push(new GridData(x, y-1, "", ""))
        // }
        // if (edgeDirY == "S" && (MazeGridValue[y+1][x] & PATH) != 0) {
        //     n.push(new GridData(x, y+1, "", ""))
        // }
        return n
    }

    // Base on the https://weblog.jamisbuck.org/2011/1/10/maze-generation-prim-s-algorithm
    // it starts with E, W, S, N
    function direction(x, y, dx, dy) {
        if (x < dx) return "E"
        else if (x > dx) return "W"
        else if (y < dy) return "S"
        else if (y > dy) return "N"
    }

    function random(min, max) {
        return Math.floor(Math.random() * max) + min
    }

    function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
    }

    function prim() {
        if(frontier.length > 0) {
            const randFrontier = random(0, frontier.length-1)
            const processedGrid = frontier.splice(randFrontier, 1)[0]
            
            const neighborProcessedGrid = neighbors(processedGrid.x, processedGrid.y, processedGrid.EdgeDirX, processedGrid.EdgeDirY)
            
            const randTargetNeighbor = random(0, neighborProcessedGrid.length)
            const targetNeighbor = neighborProcessedGrid[randTargetNeighbor]
            
            const dir = direction(processedGrid.x, processedGrid.y, targetNeighbor.x, targetNeighbor.y)

            // if (!processedGrid.EdgeDirX && !processedGrid.EdgeDirY) {
            MazeGridValue[processedGrid.y][processedGrid.x] |= MapDirectionValue[dir]
            MazeGridValue[targetNeighbor.y][targetNeighbor.x] |= MapDirectionValue[OPPOSITE_DIRECTION[dir]]
        
            // for wall
            switch (dir) {
                case "E":
                    if (processedGrid.x+1 < MaxLengthX) {
                        MazeGridValue[processedGrid.y][processedGrid.x+1] |= MapDirectionValue[OPPOSITE_DIRECTION[dir]]
                    }
                    break;
                case "W":
                    if (processedGrid.x-1 > 0) {
                        MazeGridValue[processedGrid.y][processedGrid.x-1] |= MapDirectionValue[OPPOSITE_DIRECTION[dir]]
                    }
                    break
                case "S":
                    if (processedGrid.y+1 < MaxLengthY) {
                        MazeGridValue[processedGrid.y+1][processedGrid.x] |= MapDirectionValue[OPPOSITE_DIRECTION[dir]]
                    }
                    break;
                case "N":
                    if (processedGrid.y-1 > 0) {
                        MazeGridValue[processedGrid.y-1][processedGrid.x] |= MapDirectionValue[OPPOSITE_DIRECTION[dir]]
                    }
                    break;
            }
            mark(processedGrid.x, processedGrid.y)
            // } else {
            //     MazeGridValue[processedGrid.y][processedGrid.x] |= PATH
            // }
        }
    }

    function draw() {
        prim()
        for (var i = 0 ; i < MaxLengthY ; i++) {
            for (var j = 0 ; j < MaxLengthX ; j++) {
                if (MazeGridValue[i][j] == 0 || MazeGridValue[i][j] == -1 || MazeGridValue[i][j] == FRONTIER) {
                    ctx.fillStyle = "black"
                    ctx.fillRect(j*BlockSize, i*BlockSize, BlockSize, BlockSize)
                } else {
                    ctx.fillStyle = "white"
                    ctx.fillRect(j*BlockSize, i*BlockSize, BlockSize, BlockSize)
                }
            }
        }
        // delay(100).then(() => window.requestAnimationFrame(draw));
        window.requestAnimationFrame(draw)
    }


    if (canvas.clientWidth % BlockSize != 0 || canvas.clientHeight % BlockSize != 0) {
        alert(`Invalid map, must be able to be modded by ${BlockSize} equal 0, width=${canvas.clientWidth%20}, height=${canvas.clientHeight%20}`)
        return
    }

    initializeMapGrids(canvas.clientWidth, canvas.clientHeight)
    startY = random(1, MaxLengthY-1)
    startX = random(1, MaxLengthX-1)

    if (MaxLengthX % 2 != 0) {
        if (startX % 2 == 0) {
            if (startX+1 >= MaxLengthX) {
                startX--
            } else {
                startX++
            }
        }
    }

    if (MaxLengthY % 2 != 0) {
        if (startY % 2 == 0) {
            if (startY+1 >= MaxLengthY) {
                startY--
            } else {
                startY++
            }
        }
    }

    mark(startX, startY)

    window.requestAnimationFrame(draw);
}