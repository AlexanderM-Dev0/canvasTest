/** Helper method to output an error message to the screen */
function showError(errorText) {
  const errorBoxDiv = document.getElementById('error-box');
  const errorSpan = document.createElement('p');
  errorSpan.innerText = errorText;
  errorBoxDiv.appendChild(errorSpan);
  console.error(errorText);
}

function helloTriangle() 
{
    /** @type {HTMLCanvasElement} */
    const canvas = document.getElementById('demo-canvas');

    const gl = canvas.getContext('webgl2');

   

    const triangleVertices = 
    [
        0.0, 0.5,
        
        -0.5, -0.5,

        0.5, -0.5
    ];
    const traingleVerticesCpuBuffer = new Float32Array(triangleVertices);

    const triangleGeoBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleGeoBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, traingleVerticesCpuBuffer, gl.STATIC_DRAW);

    const vertexShaderSourceCode = `#version 300 es
    precision mediump float;

    in vec2 vertexPosition;

    void main()
    {
        gl_Position = vec4(vertexPosition.x, vertexPosition.y, 0.0, 1.0);
    }`;
    
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSourceCode);
    gl.compileShader(vertexShader);

    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        const errorMessage = gl.getShaderInfoLog(vertexShader);
        showError(`Failed to compile vertex shader: ${errorMessage}`);
        return;
    }

    const fragmentShaderSourceCode = `#version 300 es
    precision mediump float;

    out vec4 outputColor;

    void main() {
        outputColor = vec4(0.294, 0.0, 0.51, 1.0);
    }`;

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSourceCode);
    gl.compileShader(fragmentShader);

    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        const errorMessage = gl.getShaderInfoLog(fragmentShader);
        showError(`Failed to compile fragmentShader shader: ${errorMessage}`);
        return;
    }


    const triangleShaderProgram = gl.createProgram();
    gl.attachShader(triangleShaderProgram, vertexShader);
    gl.attachShader(triangleShaderProgram, fragmentShader);
    gl.linkProgram(triangleShaderProgram);

    if (!gl.getProgramParameter(triangleShaderProgram, gl.LINK_STATUS)) {
        const errorMessage = gl.getProgramInfoLog(triangleShaderProgram);
        showError(`Failed to link GPU program: ${errorMessage}`);
        return;
  }
  
  const vertexPositionAttribLocation = gl.getAttribLocation(triangleShaderProgram, 'vertexPosition');
  if (vertexPositionAttribLocation < 0) {
    showError(`Failed to get attribute location for vertexPosition`);
    return;
  }

  //Output Merger
  canvas.width = canvas.clientWidth;        //Must be above the clear
  canvas.height = canvas.clientHeight;
  gl.clearColor(0.08, 0.08, 0.08, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);   //Clears the buffer completely

  //Rasterizer
  gl.viewport(0, 0, canvas.width, canvas.height);

  //Set GPU Program
  gl.useProgram(triangleShaderProgram);
  gl.enableVertexAttribArray(vertexPositionAttribLocation);

  // Input Assembler
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleGeoBuffer);
  gl.vertexAttribPointer(
    /* index: which attribute to use */
     vertexPositionAttribLocation,
     /* size: how many components in that attribute*/ 
     2,
     /* type: what is the type in the buffer itself */
     gl.FLOAT, 
     /* Normalized: determines the conversion between ints and floats*/
     false,
     /* stride: how many bytes to move foward in the buffer to find the same attribute for the next vertex */
     2 * Float32Array.BYTES_PER_ELEMENT,
     /* offset: how many bytes should the input assembler skip into the buffer when reading attribs*/
     0
  );
  
  // Draw Call
  gl.drawArrays(gl.TRIANGLES, 0, 3);

}

try {
  helloTriangle();
} catch (e) {
  showError(`Uncaught JavaScript exception: ${e}`);
}