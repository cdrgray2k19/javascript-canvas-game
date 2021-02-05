function run() {

    var game = { // Main game mechanics, including timing
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

            /* New frame */
            if(game.playing) requestAnimationFrame(game.frame); // Built-in function - only new frame if game is playing
        },
    };

    var blocks = {
        originX: 10,
        originY: 10,
        gridW: 10, // grid width in blocks
        gridH: 15, // grid height in blocks
        blockSize: 32,

        getCoords: function(block_x, block_y, block_w, block_h) { //x, y, width, height converted from number of blocks to canvas pixels
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
        }
    }

    requestAnimationFrame(game.frame);

}

window.onload = run;