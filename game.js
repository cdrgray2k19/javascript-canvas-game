/* -----------Debug---------------- */
//setInterval(eval, 1000, "console.log(blocks.fallingBlock.current)");
/* -------------------------------- */

var game, blocks, body;
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
		score: 0,
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
			ctx.fillText("Score :" + game.score, game.c.width - 10, 90, game.c.width/2 - 20)


            body.draw();// draw static blocks

            fBlock = blocks.fallingBlock.current;

			if(body.checkCollision(fBlock, sinceLastFrame)){
				body.addToBody(fBlock);
				blocks.fallingBlock.current = new blocks.fallingBlock.New(Math.floor(Math.random() * 7), 0, 4, map, "orange");
				fBlock = blocks.fallingBlock.current
				game.score += 1;
				fBlock.x = Math.floor(Math.random() * (11 - fBlock.size));
                fBlock.y = -fBlock.size;
                fBlock.color = "rgb("  + (Math.floor(Math.random() * 155) + 100) + ", " + (Math.floor(Math.random() * 155) + 100) + ", "  + (Math.floor(Math.random() * 155) + 100) +  ")"; // rgb random values between 100 and 255
			}else{
				fBlock.y += sinceLastFrame / 100;
			}
			

			ctx.strokeStyle = "#888888";
            ctx.lineWidth = 2;
            body.drawGrid();
            
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

        fallingBlock: {
            New: function(x, y, size, map, color) { // constructor
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

                this.size = size; // save size
                this.color = color; // save colour
            
                this.draw = function() { // draw on grid
                    game.c.ctx.fillStyle = this.color; // set colour for drawing
                    originX = this.x; // top-left corner
                    originY = this.y; // top-left corner
                    for(let y = 0; y < this.map.length; y++) { // for every row (y-coordinate)
                        let row = this.map[y]; // get row
                        for(let x = 0; x < row.length; x++) { // for every building block
                            if(row[x]){
								game.c.ctx.fillRect(...blocks.getCoords(originX + x, originY + y, 1, 1)); // if is block in map, use spread syntax to turn array returned into args; relative to origin
							}
                        }
                    }
                }
            
                this.rotate = function(clockwise) { // clockwise parameter is a boolean value
                    let prevMap = this.map; // previous map
                    let newMap = [];

                    /* Create blank array of falses */
                    for(let y = 0; y < this.size; y++) {
                        let row = [];
                        for(let x = 0; x < this.size; x++) {
                            row.push(false);
                        }
                        newMap.push(row);
                    }
            
                    if(!clockwise) {
                        // not clockwise - Anti-clockwise - reverse rows **before** transpose

                        for(let y = 0; y < prevMap.length; y++) {
                            while(prevMap[y].length < this.size) {
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
            
                    if (this.isLegal(newMap)){
						this.map = newMap
					} else{
						console.log('illegal')
					}
                }

                this.move = function(direction){ //moves the piece left or right
                    if (direction){ //moving left
                        if(this.x == 0){ // to make sure you don't move off the board
                            //left
                        }else{
                            this.x -= 1; // moves the piece one block to the left
                        }
                    }

                    if (!direction) { // moving right
                        if(this.x == 6){ // to make sure you don't move off the board
                            //right
                        }else{
                            this.x += 1; // moves the piece one block to the right
                        }
                    }
                }
				this.isLegal = function(m){
					for(let y = 0; y < m.length; y++) {
                        let row = m[y]
                        for(let x = 0; x < row.length; x++) {
							if (row[x]){
								try{
									if (body.map[y+Math.ceil(block.y)][x+Math.ceil(block.x)] != 0){
										return false;
									}
								}catch{

								}
							}
                        }
                    }
					return true;
				}

            },
            current: undefined, // current falling block
        }
    }

	body = {
      	height: 15,
      	width: 10,
      	map: [],
      	texturePalette: [],
      	drawGrid: function() {
            /* For every coordinate */
            for(let y = 0; y < body.height; y++) {
                for(let x = 0; x < body.width; x++) {
                    game.c.ctx.strokeRect(blocks.originX + (x * blocks.blockSize), blocks.originY + (y * blocks.blockSize), blocks.blockSize, blocks.blockSize); // stroke / outline rectangle
                }
            }
        },
    	addToBody: function(block) { // block is the falling block
        	textureIndex = body.texturePalette.push(block.color);// palette array - -1 means index of last value - returns final length
          	for(let y = 0; y < block.map.length; y++) {
                  let row = block.map[y]; 
            	for(let x = 0; x < row.length; x++) {
                    //going through coordinates relative to block
              		if(row[x]){
                		try{
							body.map[y+Math.floor(block.y)][x+Math.floor(block.x)] = textureIndex - 1; // Math.floor ensures answer is whole number
						}catch{
							game.playing = false;
						}
              		}
          		}
        	}
    	},
		draw: function() {
            for(let y = 0; y < body.height; y++) {
                for(let x = 0; x < body.width; x++) {
                    if(body.map[y][x] != 0) { // if there is a colour
                        game.c.ctx.fillStyle = (body.texturePalette[body.map[y][x]]); // find colour index, then get colour from index
						game.c.ctx.fillRect(...blocks.getCoords(x, y, 1, 1));
					}
                }
            }
        },
	
		checkCollision: function(block, sinceLastFrame){
			if (block.y >= (body.height - block.size)){ // return true if hit bottom
				return true;
			}
			
			var tempY = block.y; // set temporary value for block Y then increment and check if there are any squares in the body that overlap with the new block position

			tempY += sinceLastFrame / 100;

			for(let y = 0; y < block.map.length; y++) { // for every row (y-coordinate)
                let row = block.map[y]; // get row
                    for(let x = 0; x < row.length; x++) { // for every building block
						if(row[x]){
							if (y + Math.floor(tempY) >= 0){
								try{
									if (body.map[y+Math.floor(tempY)][x+Math.floor(block.x)] != 0){ // Math.floor ensures answer is whole number
										return true;
									}
								}catch{

								}
							} else {
								if (body.map[0][x] != 0){
									console.log('end')
									game.playing = false;
								}
							}
              			}
					}
			};
			return false;
		},
	}

    /* Create a blank map */
    for(let y = 0; y < body.height; y++) {
        let row = [];
    	for(let x = 0; x < body.width; x++) {

            row.push(0);
		
		}
        body.map.push(row);
    }

	body.texturePalette.push("black");
	

    /* Init falling block */
    blocks.fallingBlock.current = new blocks.fallingBlock.New(Math.floor(Math.random() * 7), 0, 4, map, "orange");

    requestAnimationFrame(game.frame);

}

window.onload = run;
