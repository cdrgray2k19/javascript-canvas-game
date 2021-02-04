window.onload = function() {

    var game = { // Main game mechanics, including timing
        lastTick: 0, // Changes to keep time logged
        counter: 0,
        canvas: document.querySelector("#gameCanvas"),
        cWidth: 809,
        cHeight: 500,
        ctx: document.querySelector("#gameCanvas").getContext("2d"),
        tick: function(thisTick) { // main game tick / frame function called by the browser repeatedly while playing
            game.counter++;
            const sinceLastTick = thisTick - game.lastTick; // Store time in ms since last tick
            game.lastTick = thisTick; // Save new tick

            if(game.counter % 50 == 0) {
                //Regular Checks, every 50 frames
                game.ctx.clearRect(0, 0, game.cWidth, game.cHeight);
                game.ctx.fillStyle = "lightblue";
                game.ctx.font = "20px Audiowide";
                game.ctx.textAlign = "right";
                game.ctx.fillText("FPS: " + Math.trunc(1000 / sinceLastTick), game.cWidth - 10, 30, game.cWidth/2 - 20);
            }

            requestAnimationFrame(game.tick); // New tick
        },
    };

    requestAnimationFrame(game.tick);

}