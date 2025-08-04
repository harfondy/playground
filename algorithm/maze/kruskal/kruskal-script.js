/*
    Reference: https://weblog.jamisbuck.org/2011/1/3/maze-generation-kruskal-s-algorithm

    Note logic kruskal:
    1. Create a Grid Value Map which represents the value of each grid (in this case, -1 for border, 0 for wall, and 1, 2, 4, 8 for the path)
    2. Create a Grid Tree Map which represents the grid's connection between each other whether it is connected or not
       - in this case, refer to the reference above, this tree map will be used to change the block's alphabet
    3. Create a Unprocessed Grid which will be used to process the grid, and randomize the grid
    4. Initialize the Grid Value Map and Grid Tree Map
       - 0 for all, -1 for border
       - Direction value north, east, south, west will be 1, 2, 4, 8 because 1000, 0100, 0010, 0001
       - Unprocessed Grid for each y and x % 2 is not 0, so we have a path and a wall
       - the Direction value will be used as a logic to handle connection between two Processed Grid Path to cross each other (see the logic section below)
    5. Main logic is in the kruskal function
       - Pop the Unprocessed Grid, and check the direction of the grid
       - Check if the grid is out of bounds, if it is, skip the grid
       - Check if the grid's connection already using the Grid Tree Map, if yes will skip, if no
         - Set the grid's value with the direction value
         - Set the wall's value with the opposite direction value
         - Set the dxGrid and dyGrid with the opposite direction value
         - Connect the grid's tree with the wall's tree
         - Connect the dyGrid and dxGrid with the wall's tree
         - if current direction is north, check the south of the grid, if it has a path then check with this condition
            - if current grid's value & S (bitwise AND) is not 0, then change the Grid Map Value wall between the path and make it a path
         - if current direction is west, chec the east of the grid and the south, if it has a path check with this condition
            - if ((current grid's value | E) & S) (bitwise AND) is not 0, then change the Grid Map Value wall between the path and make it a path

*/

function MainKruskal() {
    var canvas = document.getElementById("canvas-maze-kruskal");
    var ctx = canvas.getContext("2d");
    var MaxLengthX;
    var MaxLengthY;
    const BlockSize = 15
    const UnProcessedGrid = []
    const MazeGridValue = []
    const MazeTreeNode = []

    const [
        N, S, E, W
    ] = [1, 2, 4, 8] // 1000, 0100, 0010, 0001
    const MapDirectionValue = {
        "N": 1,
        "S": 2,
        "E": 4,
        "W": 8
    }
    const DX = { E: 2, W: -2, N: 0, S: 0 }
    const DY = { E: 0, W: 0, N: -2, S: 2 }
    const DXWall = { E: 1, W: -1, N: 0, S: 0 }
    const DYWall = { E: 0, W: 0, N: -1, S: 1 }
    const OPPOSITE_DIRECTION = {
        N: "S",
        S: "N",
        E: "W",
        W: "E"
    }

    class TreeNode {
        parent = null;

        constructor() {
            this.parent = null
        }

        root() {
            return this.parent === null ? this : this.parent.root();
        }

        isChildOfNode(node) {
            return this.root() === node.root()
        }

        connect(node) {
            node.root().parent = this;
        }
    }

    class UnprocessedGridData {
        constructor(x, y, direction) {
            this.x = x
            this.y = y
            this.direction = direction
        }
    }

    function initializeMapGrids(width, height) {
        // Determine max length of X and Y
        MaxLengthX = width / BlockSize
        MaxLengthY = height / BlockSize

        // i = y, j = x
        for ( var i = 0 ; i < MaxLengthY ; i++) {
            MazeGridValue[i] = []
            MazeTreeNode[i] = []
            for (var j = 0 ; j < MaxLengthX ; j++) {
                var isUnprocessedGrid = false
                var mapVal = 0

                if (i == 0 || i == MaxLengthY-1 || j == 0 || j == MaxLengthX-1) { // for border map
                    mapVal = -1
                } else {
                    if (j%2 != 0 && i%2 != 0) {
                        isUnprocessedGrid = true // grid will be processed
                    } else {
                        mapVal = 0 // wall
                    }
                }

                MazeGridValue[i][j] = mapVal
                MazeTreeNode[i][j] = new TreeNode()
                if (isUnprocessedGrid) {
                    UnProcessedGrid.push(new UnprocessedGridData(j, i, "N"))
                    UnProcessedGrid.push(new UnprocessedGridData(j, i, "W"))
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

    function kruskal() {
        if (UnProcessedGrid.length > 0) {
            var processingGrid = UnProcessedGrid.pop();
            var dxGrid = processingGrid.x + DX[processingGrid.direction];
            var dyGrid = processingGrid.y + DY[processingGrid.direction];
            var dxGridWall = processingGrid.x + DXWall[processingGrid.direction];
            var dyGridWall = processingGrid.y + DYWall[processingGrid.direction];
            
            if (dxGrid < 0 || dxGrid >= MaxLengthX || dyGrid < 0 || dyGrid >= MaxLengthY) {
                return; // skip if out of bounds
            }
            
            if (!MazeTreeNode[processingGrid.y][processingGrid.x].isChildOfNode(MazeTreeNode[dyGrid][dxGrid])) {
                MazeGridValue[processingGrid.y][processingGrid.x] |= MapDirectionValue[processingGrid.direction]; // 0 | N/S/E/W = N/S/E/W
                MazeGridValue[dyGridWall][dxGridWall] |= MapDirectionValue[OPPOSITE_DIRECTION[processingGrid.direction]]; // 0 | W/E/S/N = W/E/S/N
                MazeGridValue[dyGrid][dxGrid] |= MapDirectionValue[OPPOSITE_DIRECTION[processingGrid.direction]]; // 0 | W/E/S/N = W/E/S/N

                MazeTreeNode[processingGrid.y][processingGrid.x].connect(MazeTreeNode[dyGridWall][dxGridWall]);
                MazeTreeNode[dyGrid][dxGrid].connect(MazeTreeNode[dyGridWall][dxGridWall]);
                
                // (N) 1 & (S) 2 = 0, (S) 2 & (S) 2 = 2, (E) 4 & (S) 2 = 0, (W) 8 & (S) 2 = 0
                if ((MazeGridValue[processingGrid.y][processingGrid.x] & S) !== 0) { // Logic to connect connected path, check south processed grid
                    MazeGridValue[processingGrid.y + 1][processingGrid.x] |= MazeGridValue[processingGrid.y][processingGrid.x];
                }

                // (N) 1 & (E) 4 = 0, (S) 2 & (E) 4 = 0, (E) 4 & (E) 4 = 4, (W) 8 & (E) 4 = 0
                if ((MazeGridValue[processingGrid.y][processingGrid.x] & E) !== 0) { // Logic to connect connected path, check east processed grid & then check south
                    /*
                        ((E)[0010]4 | (N)[1000]1) = 5 => 5 & (S) 2 = 0
                        ((E)[0010]4 | (S)[0100]2) = 6 => 6 & (S) 2 = 2
                        ((E)[0010]4 | (E)[0010]4) = 4 => 4 & (S) 2 = 0
                        ((E)[0010]4 | (W)[0001]8) = 12 => 12 & (S) 2 = 0
                    */
                    if (((MazeGridValue[processingGrid.y][processingGrid.x] | MazeGridValue[processingGrid.y][processingGrid.x]) & S) != 0) {
                        MazeGridValue[processingGrid.y][processingGrid.x + 1] |= MazeGridValue[processingGrid.y][processingGrid.x];
                    }
                } 
            }
        }
    }

    function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
    }

    function draw() {
        kruskal()
        for (var i = 0 ; i < MaxLengthY ; i++) {
            for (var j = 0 ; j < MaxLengthX ; j++) {
                if (MazeGridValue[i][j] == 0 || MazeGridValue[i][j] == -1) {
                    ctx.fillStyle = "black"
                    ctx.fillRect(j*BlockSize, i*BlockSize, BlockSize, BlockSize)
                } else {
                    ctx.fillStyle = "white"
                    ctx.fillRect(j*BlockSize, i*BlockSize, BlockSize, BlockSize)
                }
            }
        }
        // delay(10000).then(() => window.requestAnimationFrame(draw));
        window.requestAnimationFrame(draw)
    }
    if (canvas.clientWidth % BlockSize != 0 || canvas.clientHeight % BlockSize != 0) {
        alert(`Invalid map, must be able to be modded by ${BlockSize} equal 0, width=${canvas.clientWidth%20}, height=${canvas.clientHeight%20}`)
        return
    }

    initializeMapGrids(canvas.clientWidth, canvas.clientHeight)
    shuffle(UnProcessedGrid)

    window.requestAnimationFrame(draw);
}