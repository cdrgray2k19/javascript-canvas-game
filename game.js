var gl; // gl from canvas

window.onload = function() {
    gl = new glFromCanvas(document.querySelector("#glCanvas"), draw);
}

function draw(gl) {
    gl.do.clearScreen(gl, [0.0, 0.0, 0.0, 0.0]);
    gl.do.clearBuffers(gl);
    gl.do.addShape(gl, new shapes.Cuboid(-1, -1, -1, 1, 1, 1));
    gl.do.addShape(gl, new shapes.Cuboid(0, 0, 0, 1, 1, 1));
    gl.do.loadBuffers(gl);
    gl.do.loadTexture(gl, "cubetexture.png");
    gl.do.draw(gl, [0.7, [1, 0, 1], [0, 0, 0]]);
}