const maths = {
  isPowerOf2: (value) => { 
    return (value & (value - 1)) == 0; 
    // No digits in common between n and n-1, so must be 100 and 011, or 100000 and 011111 etc., so n must be a power of 2.
  },
}

const glConstants = {
  initShaderProgram: (gl, vsSource, fsSource) => {
    // Initialise Shader Program from GLSL
    const vertexShader = glConstants.loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = glConstants.loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    // Create the shader program

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // If creating the shader program failed, alert

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
      return null;
    }

    return shaderProgram;
  },
  loadShader: (gl, type, source) => {
    //Create shader
    const shader = gl.createShader(type);

    // Send the source to shader
    gl.shaderSource(shader, source);

    // Compile from GLSL
    gl.compileShader(shader);

    // Error if needed
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  },
  initBuffers: (gl, positions=[
    -1.0, -1.0,  1.0,
     1.0, -1.0,  1.0,
     1.0,  1.0,  1.0,
    -1.0,  1.0,  1.0,
  
    // Back face
    -1.0, -1.0, -1.0,
    -1.0,  1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0, -1.0, -1.0,
  
    // Top face
    -1.0,  1.0, -1.0,
    -1.0,  1.0,  1.0,
     1.0,  1.0,  1.0,
     1.0,  1.0, -1.0,
  
    // Bottom face
    -1.0, -1.0, -1.0,
     1.0, -1.0, -1.0,
     1.0, -1.0,  1.0,
    -1.0, -1.0,  1.0,
  
    // Right face
     1.0, -1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0,  1.0,  1.0,
     1.0, -1.0,  1.0,
  
    // Left face
    -1.0, -1.0, -1.0,
    -1.0, -1.0,  1.0,
    -1.0,  1.0,  1.0,
    -1.0,  1.0, -1.0,
  ], textureCoordinates=[
    // Front
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Back
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Top
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Bottom
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Right
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Left
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
  ], indices=[
    0,  1,  2,      0,  2,  3,    // front
    4,  5,  6,      4,  6,  7,    // back
    8,  9,  10,     8,  10, 11,   // top
    12, 13, 14,     12, 14, 15,   // bottom
    16, 17, 18,     16, 18, 19,   // right
    20, 21, 22,     20, 22, 23,   // left
  ], vertexNormals=[
    // Front
     0.0,  0.0,  1.0,
     0.0,  0.0,  1.0,
     0.0,  0.0,  1.0,
     0.0,  0.0,  1.0,

    // Back
     0.0,  0.0, -1.0,
     0.0,  0.0, -1.0,
     0.0,  0.0, -1.0,
     0.0,  0.0, -1.0,

    // Top
     0.0,  1.0,  0.0,
     0.0,  1.0,  0.0,
     0.0,  1.0,  0.0,
     0.0,  1.0,  0.0,

    // Bottom
     0.0, -1.0,  0.0,
     0.0, -1.0,  0.0,
     0.0, -1.0,  0.0,
     0.0, -1.0,  0.0,

    // Right
     1.0,  0.0,  0.0,
     1.0,  0.0,  0.0,
     1.0,  0.0,  0.0,
     1.0,  0.0,  0.0,

    // Left
    -1.0,  0.0,  0.0,
    -1.0,  0.0,  0.0,
    -1.0,  0.0,  0.0,
    -1.0,  0.0,  0.0]) => {

    // Create positionBuffer

    const positionBuffer = gl.createBuffer();

    // Select positionBuffer

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Send to WebGL

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    // Create textureCoordBuffer
    const textureCoordBuffer = gl.createBuffer();
    // Select textureCoordBuffer
    gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates),
                  gl.STATIC_DRAW);

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    // send to WebGL
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array(indices), gl.STATIC_DRAW);

        //Create and select Normals for each vertex (centre point)
        const normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
      
        //Send to WebGL
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals),
                      gl.STATIC_DRAW);

    return {
      position: positionBuffer,
      normal: normalBuffer,
      textureCoord: textureCoordBuffer,
      indices: indexBuffer,
    };
  },
  loadTexture: (gl, url) => {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    //Blue pixel until image has loaded
    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    const pixel = new Uint8Array([0, 0, 255, 255]);  // opaque blue
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                  width, height, border, srcFormat, srcType,
                  pixel);

    const image = new Image();
    image.onload = function() {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                    srcFormat, srcType, image);

      // Power of 2 size means that Mipmap can be used
      if (maths.isPowerOf2(image.width) && maths.isPowerOf2(image.height)) {
        gl.generateMipmap(gl.TEXTURE_2D);
      } else {
        // not a power of 2
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
          // Prevents s-coordinate wrapping (repeating).
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          // Prevents t-coordinate wrapping (repeating).
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      }
    };
    image.src = url;

    return texture;
  },
  clearScreen(gl, color) {
    gl.clearColor(...color);  // Clear to black, fully opaque
    gl.clearDepth(1.0);                 // Clear everything
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

    // Clear the canvas before we start drawing on it.

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  },
  drawBuffers: (gl, programInfo, buffers, vLength, texture, rotate = [0.0, [0, 0, 0], [0, 0, 0]], translate = [-0.0, 0.0, -6.0]) => {

    // Create a perspective matrix

    const fieldOfView = 45 * Math.PI / 180;   // in radians
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();

    mat4.perspective(projectionMatrix,
                    fieldOfView,
                    aspect,
                    zNear,
                    zFar);

    // Set the drawing position to the "identity" point, which is
    // the center of the scene.
    const modelViewMatrix = mat4.create();
    
    mat4.translate(modelViewMatrix,     // destination matrix
                  modelViewMatrix,     // matrix to translate
                  translate);  // amount to translate
    

    mat4.translate(modelViewMatrix, modelViewMatrix, [rotate[2][0], rotate[2][1], rotate[2][2]]);
    mat4.rotate(modelViewMatrix, modelViewMatrix, rotate[0], rotate[1]);
    mat4.translate(modelViewMatrix, modelViewMatrix, [-rotate[2][0], -rotate[2][1], -rotate[2][2]]);


    // Tell WebGL how to pull out the positions from the position
    // buffer into the vertexPosition attribute.
    {
      const numComponents = 3;  // pull out 2 values per iteration
      const type = gl.FLOAT;    // the data in the buffer is 32bit floats
      const normalize = false;  // don't normalize
      const stride = 0;         // how many bytes to get from one set of values to the next
                                // 0 = use type and numComponents above
      const offset = 0;         // how many bytes inside the buffer to start from
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
      gl.vertexAttribPointer(
          programInfo.attribLocations.vertexPosition,
          numComponents,
          type,
          normalize,
          stride,
          offset);
      gl.enableVertexAttribArray(
          programInfo.attribLocations.vertexPosition);
    }

    // tell WebGL how to pull out the texture coordinates from buffer
    {
      const num = 2; // every coordinate composed of 2 values
      const type = gl.FLOAT; // the data in the buffer is 32 bit float
      const normalize = false; // don't normalize
      const stride = 0; // how many bytes to get from one set to the next
      const offset = 0; // how many bytes inside the buffer to start from
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
      gl.vertexAttribPointer(programInfo.attribLocations.textureCoord, num, type, normalize, stride, offset);
      gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);
    }

    // Tell WebGL how to pull out the normals from
    // the normal buffer into the vertexNormal attribute.
    {
      const numComponents = 3;
      const type = gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal);
      gl.vertexAttribPointer(
          programInfo.attribLocations.vertexNormal,
          numComponents,
          type,
          normalize,
          stride,
          offset);
      gl.enableVertexAttribArray(
          programInfo.attribLocations.vertexNormal);
    }

    // Normal matrix - transform normals
    const normalMatrix = mat4.create();
    mat4.invert(normalMatrix, modelViewMatrix);
    mat4.transpose(normalMatrix, normalMatrix);



    // Tell WebGL which indices to use to index the vertices
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

    // Tell WebGL to use our program when drawing

    gl.useProgram(programInfo.program);

    // Set the shader uniforms

    gl.uniformMatrix4fv(
        programInfo.uniformLocations.projectionMatrix,
        false,
        projectionMatrix);
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.modelViewMatrix,
        false,
        modelViewMatrix);
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.normalMatrix,
        false,
        normalMatrix);

    // Tell WebGL we want to affect texture unit 0
    gl.activeTexture(gl.TEXTURE0);

    // Bind the texture to texture unit 0
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Tell the shader we bound the texture to texture unit 0
    gl.uniform1i(programInfo.uniformLocations.uSampler, 0);
    
    /*{
      const offset = 0;
      const vertexCount = 4;
      gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
    }*/

    {
      const vertexCount = vLength;
      const type = gl.UNSIGNED_SHORT;
      const offset = 0;
      gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }
  },
}

function glFromCanvas(canvas, onload, settings={
  lighting: {
    ambient: [0.3, 0.3, 0.3],
    directional: [1, 1, 1],
    directionalVector: [0.85, 0.8, 0.75],
  },
}) {
  try {
    this.loaded = false;
    this.element = canvas;
    this.gl = canvas.getContext("webgl");
    if(this.gl != null) {
        this.loaded = true;
    } else {
        this.error = "GL Not Loaded";
    }
    //GLSL Vertex Shader
    this.shaders = {
      vsSource: `
          attribute vec4 aVertexPosition;
          attribute vec3 aVertexNormal;
          attribute vec2 aTextureCoord;
    
          uniform mat4 uNormalMatrix;
          uniform mat4 uModelViewMatrix;
          uniform mat4 uProjectionMatrix;
    
          varying highp vec2 vTextureCoord;
          varying highp vec3 vLighting;
    
          void main(void) {
            gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
            vTextureCoord = aTextureCoord;
    
            // Apply lighting effect
    
            highp vec3 ambientLight = vec3(` + settings.lighting.ambient.join(", ") + `);
            highp vec3 directionalLightColor = vec3(` + settings.lighting.directional.join(", ") + `);
            highp vec3 directionalVector = normalize(vec3(` + settings.lighting.directionalVector.join(", ") + `));
    
            highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);
    
            highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
            vLighting = ambientLight + (directionalLightColor * directional);
          }
        `,
      fsSource: `
          varying highp vec2 vTextureCoord;
          varying highp vec3 vLighting;
        
          uniform sampler2D uSampler;
        
          void main(void) {
            highp vec4 texelColor = texture2D(uSampler, vTextureCoord);
        
            gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a); //Add lighting
          }
        `,
    };
    const shaderProgram = glConstants.initShaderProgram(this.gl, this.shaders.vsSource, this.shaders.fsSource);
    this.shaders.programInfo = {
      program: shaderProgram,
      attribLocations: {
        vertexPosition: this.gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
        vertexNormal: this.gl.getAttribLocation(shaderProgram, 'aVertexNormal'),
        textureCoord: this.gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
      },
      uniformLocations: {
        projectionMatrix: this.gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
        modelViewMatrix: this.gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
        normalMatrix: this.gl.getUniformLocation(shaderProgram, 'uNormalMatrix'),
        uSampler: this.gl.getUniformLocation(shaderProgram, 'uSampler'),
      },
    }

    this.bufferData = { // Use defaults
      positions: [],
      textureCoordinates: [],
      indices: [],
      vertexNormals: [],
    }

    this.loaded = true;

    this.do = {
      clearBuffers: function(thisgl) {
        thisgl.bufferData = { // Use defaults
          positions: [],
          textureCoordinates: [],
          indices: [],
          vertexNormals: [],
        };
        this.buffers = undefined;
      },

      addShape: function(thisgl, shape) {
        let soFar = thisgl.bufferData.positions.length;
        thisgl.bufferData.positions.push(...shape.positions);
        thisgl.bufferData.textureCoordinates.push(...shape.textureCoordinates);
        thisgl.bufferData.vertexNormals.push(...shape.vertexNormals);
        let tempIndices = [];
        shape.indices.forEach(function(item) {
          tempIndices.push(item+soFar);
        });
        thisgl.bufferData.indices.push(...tempIndices);
      },

      loadBuffers: function(thisgl) {
        thisgl.bufferData.vertexLength = thisgl.bufferData.indices.length;
        thisgl.buffers = glConstants.initBuffers(thisgl.gl, thisgl.bufferData.positions, thisgl.bufferData.textureCoordinates, thisgl.bufferData.indices, thisgl.bufferData.vertexNormals);
      },

      loadTexture: function(thisgl, filename) {
        thisgl.texture = glConstants.loadTexture(thisgl.gl, filename);
      },
      draw: function(thisgl, rotate=[0.0, [0.0, 0.0, 0.0], [0.0, 0.0, 0.0]], translate=[-0.0, 0.0, -6.0]) {
        glConstants.drawBuffers(thisgl.gl, thisgl.shaders.programInfo, thisgl.buffers, thisgl.bufferData.vertexLength, thisgl.texture, rotate, translate);
      },
      clearScreen(thisgl, color=[0.0, 0.0, 0.0, 1.0]) { // solid black
        glConstants.clearScreen(thisgl.gl, color);
      },
    }

    onload(this);
  }
  catch(err) {
    this.error = err;
  }
}

const shapes = {
  Cuboid: function(x, y, z, width, height, depth) {
    this.positions = [
      x, y,  z+depth,
      x+width, y,  z+depth,
      x+width,  y+height,  z+depth,
      x,  y+height,  z+depth,
    
      // Back face
      x, y, z,
      x,  y+height, z,
      x+width,  y+height, z,
      x+width, y, z,
    
      // Top face
      x,  y+height, z,
      x,  y+height,  z+depth,
      x+width,  y+height,  z+depth,
      x+width,  y+height, z,
    
      // Bottom face
      x, y, z,
       x+width, y, z,
       x+width, y,  z+depth,
      x, y,  y+height,
    
      // Right face
       x+width, y, z,
       x+width,  y+height, z,
       x+width,  y+height,  z+depth,
       x+width, y,  z+depth,
    
      // Left face
      x, y, z,
      x, y,  z+depth,
      x,  y+height,  z+depth,
      x,  y+height, z,
    ]; 
    this.textureCoordinates = [
      // Front
      0.0,  0.0,
      1.0,  0.0,
      1.0,  1.0,
      0.0,  1.0,
      // Back
      0.0,  0.0,
      1.0,  0.0,
      1.0,  1.0,
      0.0,  1.0,
      // Top
      0.0,  0.0,
      1.0,  0.0,
      1.0,  1.0,
      0.0,  1.0,
      // Bottom
      0.0,  0.0,
      1.0,  0.0,
      1.0,  1.0,
      0.0,  1.0,
      // Right
      0.0,  0.0,
      1.0,  0.0,
      1.0,  1.0,
      0.0,  1.0,
      // Left
      0.0,  0.0,
      1.0,  0.0,
      1.0,  1.0,
      0.0,  1.0,
    ]; 
    this.indices = [
      0,  1,  2,      0,  2,  3,    // front
      4,  5,  6,      4,  6,  7,    // back
      8,  9,  10,     8,  10, 11,   // top
      12, 13, 14,     12, 14, 15,   // bottom
      16, 17, 18,     16, 18, 19,   // right
      20, 21, 22,     20, 22, 23,   // left
    ]; 
    this.vertexNormals = [
      // Front
      x+(width/2),  y+(height/2),  z+depth,
      x+(width/2),  y+(height/2),  z+depth,
      x+(width/2),  y+(height/2),  z+depth,
      x+(width/2),  y+(height/2),  z+depth,
  
      // Back
      x+(width/2),  y+(height/2), z,
      x+(width/2),  y+(height/2), z,
      x+(width/2),  y+(height/2), z,
      x+(width/2),  y+(height/2), z,
  
      // Top
      x+(width/2),  y+height,  z+(depth/2),
      x+(width/2),  y+height,  z+(depth/2),
      x+(width/2),  y+height,  z+(depth/2),
      x+(width/2),  y+height,  z+(depth/2),
  
      // Bottom
      x+(width/2), y,  z+(depth/2),
      x+(width/2), y,  z+(depth/2),
      x+(width/2), y,  z+(depth/2),
      x+(width/2), y,  z+(depth/2),
  
      // Right
      x+width,  y+(height/2),  z+(depth/2),
      x+width,  y+(height/2),  z+(depth/2),
      x+width,  y+(height/2),  z+(depth/2),
      x+width,  y+(height/2),  z+(depth/2),
  
      // Left
      x,  y+(height/2),  z+(depth/2),
      x,  y+(height/2),  z+(depth/2),
      x,  y+(height/2),  z+(depth/2),
      x,  y+(height/2),  z+(depth/2)]
  },
}