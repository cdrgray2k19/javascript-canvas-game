var game, blocks;
function run() {

    let map = [
        " ###",
        "###",
        "##",
        "#"].join("\n");
    console.log(map);

    game = { // Main game mechanics, including timing
        lastFrame: 0, // Changes to keep time logged
        frameCount: 0,
        secondCount: 0,
        playing: true,
        c: { //canvas
            canvas: document.querySelector("#gameCanvas"),
            width: 809,
            height: 500,
            ctx: document.querySelector("#gameCanvas").getContext("2d"),
        },
        frame: function(thisFrame) { // main game frame function called by the browser repeatedly while playing

            /* Frames and time managing */
            const sinceLastFrame = thisFrame - game.lastFrame; // Store time in ms since last Frame
            game.lastFrame = thisFrame; // Save new Frame

            ctx = game.c.ctx;
            
            /* Regular code executed every n frames */
            if(game.frameCount % 50 == 0) {
                //Every 1 second
                game.fps = Math.trunc(1000 / sinceLastFrame);
            }
            game.frameCount++;
            game.secondCount += sinceLastFrame / 1000;

            ctx.clearRect(0, 0, game.c.width, game.c.height);
            ctx.fillStyle = "lightblue";
            ctx.font = "20px Audiowide";
            ctx.textAlign = "right";
            ctx.fillText("FPS: " + game.fps, game.c.width - 10, 30, game.c.width/2 - 20);
            ctx.fillText("Seconds: " + Math.trunc(game.secondCount), game.c.width - 10, 60, game.c.width/2 - 20);

            ctx.strokeStyle = "white";
            ctx.lineWidth = 2;
            blocks.drawGrid();

            fBlock = blocks.fallingBlock.current;

            if(fBlock.y < (15 - fBlock.height)) {
                fBlock.y += sinceLastFrame / 100;
            } else {
                fBlock.x = Math.floor(Math.random() * (11 - fBlock.width));
                fBlock.y = -fBlock.height;
                fBlock.color = "rgb("  + (Math.floor(Math.random() * 155) + 100) + ", " + (Math.floor(Math.random() * 155) + 100) + ", "  + (Math.floor(Math.random() * 155) + 100) +  ")"; // rgb random values between 100 and 255
            }
            fBlock.draw();

            /* New frame */
            if(game.playing) requestAnimationFrame(game.frame); // Built-in function - only new frame if game is playing
        },
        keyPressed: function(e) { // e is event
            if(e.keyCode === 39) { // Right key pressed - see https://keycode.info/
                blocks.fallingBlock.current.rotate(true); // clockwise
            } else if(e.keyCode === 37) { // Left key pressed
                blocks.fallingBlock.current.rotate(false); // anti-clockwise
            } else if (e.keyCode === 65) { // a pressed
                blocks.fallingBlock.current.move(true); //move the block to the left
            } else if (e.keyCode === 68) { //d pressed
                blocks.fallingBlock.current.move(false); //move the block to the right
            }
        },
    };

    window.addEventListener("keydown", game.keyPressed); // Set game.keyPressed as default key down function - keypress event does not support arrow keys

    blocks = {
        originX: 10,
        originY: 10,
        gridW: 10, // grid width in blocks
        gridH: 15, // grid height in blocks
        blockSize: 32,

        getCoords: function(block_x, block_y, block_width, block_height) { //x, y, width, height converted from number of blocks to canvas pixels
            let x = blocks.originX + (block_x * blocks.blockSize); // calculate x using pixel measurements
            let y = blocks.originY + (block_y * blocks.blockSize); // calculate y using pixel measurements
            let width = (block_width * blocks.blockSize); // calculate width using pixel measurements
            let height = (block_height * blocks.blockSize); // calculate height using pixel measurements
            return [x, y, width, height]; // return array that can be expanded into fillRect function using '...' spread syntax (see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
        },

        drawGrid: function() {
            /* For every coordinate */
            for(let y = 0; y < blocks.gridH; y++) {
                for(let x = 0; x < blocks.gridW; x++) {
                    game.c.ctx.strokeRect(blocks.originX + (x * blocks.blockSize), blocks.originY + (y * blocks.blockSize), blocks.blockSize, blocks.blockSize); // stroke / outline rectangle
                }
            }
        },

        fallingBlock: {
            New: function(x, y, width, height, map, color) { // constructor
                /* Get map array from human-readable string */
                let array = [];
                let rows = map.split("\n"); // every line, \n means new line
                for(let i = 0; i < rows.length; i++) { // look through each row (y coordinate)
                    let row = rows[i].split(""); // get blocks in row
                    let rowArray = []; // row array
                    for(let i = 0; i < row.length; i++) { // for each block / character
                        rowArray.push(row[i] == "#"); // true if character is '#'; else false
                    }
                    array.push(rowArray); // add row to main array
                }
            
                this.map = array; // save map array
                this.x = x; // save x
                this.y = y; // save y
                this.width = width; // save width
                this.height = height; // save height
                this.color = color; // save colour
            
                this.draw = function() { // draw on grid
                    game.c.ctx.fillStyle = this.color; // set colour for drawing
                    originX = this.x; // top-left corner
                    originY = this.y; // top-left corner
                    for(let y = 0; y < this.map.length; y++) { // for every row (y-coordinate)
                        let row = this.map[y]; // get row
                        for(let x = 0; x < row.length; x++) { // for every building block
                            if(row[x]) game.c.ctx.fillRect(...blocks.getCoords(originX + x, originY + y, 1, 1)); // if is block in map, use spread syntax to turn array returned into args; relative to origin
                        }
                    }
                }
            
                this.rotate = function(clockwise) { // clockwise parameter is a boolean value
                    let prevMap = this.map; // previous map
                    let newMap = [];

                    let h = this.width;
                    this.width = this.height;
                    this.height = h;

                    /* Create blank array of falses */
                    for(let y = 0; y < this.height; y++) {
                        let row = [];
                        for(let x = 0; x < this.height; x++) {
                            row.push(false);
                        }
                        newMap.push(row)
                    }
            
                    if(!clockwise) {
                        // not clockwise - Anti-clockwise - reverse rows **before** transpose

                        for(let y = 0; y < prevMap.length; y++) {
                            while(prevMap[y].length < this.width) {
                                prevMap[y].push(false); // Make all arrays same size so rotating works
                            }
                            prevMap[y].reverse(); // reverse rows
                        }

                    }
            
                    for(let y = 0; y < prevMap.length; y++) { // for every row
                        let row = prevMap[y]
                        for(let x = 0; x < row.length; x++) { // for every block
                            //transpose - see https://en.wikipedia.org/wiki/Transpose and https://stackoverflow.com/questions/42519/how-do-you-rotate-a-two-dimensional-array
                            newMap[x][y] = row[x];
                        }
                    }
                    
                    if(clockwise) {
                        /* Clockwise - reverse rows **after** transpose */
                        
                        for(let y = 0; y < newMap.length; y++) {
                            newMap[y].reverse(); // reverse rows
                        }
            
                    }
            
                    this.map = newMap;
                }

                this.move = function(direction){ //moves the piece left or right
                    if (direction){ //moving left
                        if(this.x == 0){ // to make sure you don't move off the board
                            console.log('left-most')
                        }else{
                            this.x -= 1; // moves the piece one block to the left
                        }
                    }

                    if (!direction) { // moving right
                        if(this.x == 6){ // to make sure you don't move off the board
                            console.log('right-most')
                        }else{
                            this.x += 1; // moves the piece one block to the right
                        }
                    }
                }
            },
            current: undefined, // current falling block
        }
    }

    /* Init falling block */
    blocks.fallingBlock.current = new blocks.fallingBlock.New(Math.floor(Math.random() * 7), 0, 4, 4, map, "orange");

    requestAnimationFrame(game.frame);

}

window.onload = run;