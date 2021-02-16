var body, game, blocks;

function run(){
	/*let map = [
        " ###",
        "###",
        "##",
        "#"].join("\n");
    console.log(map);*/

	const shapeMaps = [
		[
			"#",
			"#",
			"#",
			"#"
		].join("\n"),
		[
			"#",
			"###",
			""
		].join("\n"),
		[
			"  #",
			"###",
			""
		].join("\n"),
		[
			"##",
			"##"
		].join("\n"),
		[
			" ##",
			"##",
			""
		].join("\n"),
		[
			" #",
			"###",
			""
		].join("\n"),
		[
			"##",
			" ##",
			""
		].join("\n")
	];
	const shapeSizes = [4, 3, 3, 2, 3, 3, 3];

	const shapeColours = ['cyan', 'blue', 'orange', 'yellow', 'green', 'magenta', 'red']

    game = { // Main game mechanics, including timing
        secondCount: 0,
		score: 0,
        playing: true,
        c: { //canvas
            canvas: document.querySelector("#gameCanvas"),
            width: 809,
            height: 500,
            ctx: document.querySelector("#gameCanvas").getContext("2d"),
        },
		frame: function() {
			ctx = game.c.ctx;
			ctx.clearRect(0, 0, game.c.width, game.c.height);
            ctx.fillStyle = "lightblue";
            ctx.font = "20px Audiowide";
            ctx.textAlign = "right";
            ctx.fillText("Seconds: " + Math.trunc(game.secondCount), game.c.width - 10, 60, game.c.width/2 - 20);
			ctx.fillText("Score :" + game.score, game.c.width - 10, 90, game.c.width/2 - 20)
		
			//carry out collision and append newmap to current map or append map to body and create new falling block

            
			body.draw();

			fBlock = blocks.fallingBlock.current;
			fBlock.draw();

			ctx.strokeStyle = "#888888";
            ctx.lineWidth = 1;
            body.drawGrid();
			
			if(game.playing){
				requestAnimationFrame(game.frame);
			}else{
				clearInterval(drop);
			}

		},
		fall: function(){
			fBlock = blocks.fallingBlock.current;
			fBlock.newY += 1;
			if (game.check(fBlock.map, fBlock, fBlock.newY, fBlock.x) == false){
				fBlock.y = fBlock.newY;
			} else{
				fBlock.newY = fBlock.y;
				body.addToBody(fBlock);
				game.newBlock();
			}
			game.secondCount += dropWaitTime / 1000;
		},

		check: function(blockMap, block, blockY, blockX){//takes body and block map and allows to choose whether we test the new y and x values of the falling block if we so choose
		//this means with this function we can test either rotation collision, y move collision, and x move collision by altering the parameters given.
			for (let y = 0; y < blockMap.length; y++){
				let row = blockMap[y];
				for (let x = 0; x < row.length; x++){
					if (row[x]){
						try{
							if (body.map[y + blockY][x + blockX] != 0){
								return true;
							}
						}catch{
							if (y + (blockY) >= blocks.gridH){
								return true;
							}else if (x + (blockX) >= blocks.gridW){
								return true;
							} else if (x + (blockX) < 0){
								return true;
							} else{
								//block is above the canvas and has just spawned in so we will just let this error catch pass as it is a completely expected result
							}
						}
					}
				}
			}
			return false;
		},

		newBlock: function(){
			let index = Math.floor(Math.random() * (shapeMaps.length))
			let map = shapeMaps[index];
			let size = shapeSizes[index];
			let color = shapeColours[index];
			let x = Math.floor(Math.random() * (7));
			let y = -size
			blocks.fallingBlock.current = new blocks.fallingBlock.New(x, y, size, map, color);
			game.score += 1;
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
	window.addEventListener("keydown", game.keyPressed);

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
				this.newMap = [];

                this.x = x; // save x
                this.y = y; // save y
				this.newX = this.x;
				this.newY = this.y;

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

					if (game.check(newMap, this, this.y, this.x) == false){
						this.map = newMap;
					} else {
					}
                }

                this.move = function(direction){ //moves the piece left or right
					if (direction){ //moving left
                        this.newX -= 1; // moves the piece one block to the left
                    }

                    if (!direction) { // moving right
                        this.newX += 1; // moves the piece one block to the right
                    }
					if (game.check(this.map, this, this.y, this.newX) == false){
						this.x = this.newX;
					} else {
						this.newX = this.x;
					}
				}
			},
            current: undefined, // current falling block
        }
    };

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
	}

    /* Create a blank map */
    for(let y = 0; y < body.height; y++) {
        let row = [];
    	for(let x = 0; x < body.width; x++) {
            row.push(0);
		}
        body.map.push(row);
    }

	body.texturePalette.push("transparent");
	

    /* Init falling block */

    game.newBlock();


	
	
	
	
	requestAnimationFrame(game.frame);
	const dropWaitTime = 500;
	const drop = setInterval(game.fall, dropWaitTime);
}

window.onload = run;