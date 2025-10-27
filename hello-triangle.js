/** Helper method to output an error message to the screen */
function showError(errorText) {
  const errorBoxDiv = document.getElementById('error-box');
  const errorSpan = document.createElement('p');
  errorSpan.innerText = errorText;
  errorBoxDiv.appendChild(errorSpan);
  console.error(errorText);
}

class vao  
{ 
  constructor(gl, newVertextArray, new_name)
  {
    //passed variables
    this.name = new_name;
    this.context = gl;
    this.vertexArray = newVertextArray;

    //calculated variables
    this.length = this.vertexArray.length;
  }
}




function helloTriangle() 
{
    /** @type {HTMLCanvasElement} */
    const canvas = document.getElementById('demo-canvas');

    const gl = canvas.getContext('webgl2');

    const vao_array = []; 

    const triangleVertices = 
    [
        //x, y, z,    r, g, b
        0.0, 0.5, 0.0,   1.0, 0.0, 0.0,
        
        -0.5, -0.5, 0.0, 0.0, 1.0, 0.0, 

        0.5, -0.5, 0.0,  0.0, 0.0, 1.0,
        0.7, -0.5, 0.0,  0.0, 0.0, 1.0,
    ];


    vao_array.push(new vao(gl, triangleVertices, "triangle_vao"));

  



    const traingleVerticesCpuBuffer = new Float32Array(triangleVertices);
    const triangleGeoBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleGeoBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, traingleVerticesCpuBuffer, gl.STATIC_DRAW);

    const vertexShaderSourceCode = `#version 300 es
    precision mediump float;

    in vec3 vertexPosition;

    in vec3 vertexColor;

    out vec3 fragmentColor;

    uniform float uScale;
    uniform vec3 uOffset;

    void main()
    {
        vec3 scaledPosition = uScale * vertexPosition;
        vec3 offsetPosition = scaledPosition + uOffset;

        gl_Position = vec4(offsetPosition, 1.0);
        fragmentColor =  vertexColor;
    }`;
    
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSourceCode);
    gl.compileShader(vertexShader);

    const fragmentShaderSourceCode = `#version 300 es
    precision mediump float;

    in vec3 fragmentColor;

    out vec4 outputColor;

    void main() {
        outputColor = vec4(fragmentColor, 1.0);
    }`;

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSourceCode);
    gl.compileShader(fragmentShader);
    

    const triangleShaderProgram = gl.createProgram();
    
    gl.attachShader(triangleShaderProgram, vertexShader);
    gl.attachShader(triangleShaderProgram, fragmentShader);
    gl.linkProgram(triangleShaderProgram);
  
  


  const vertexPositionAttribLocation = gl.getAttribLocation(triangleShaderProgram, 'vertexPosition');


  //Output Merger
  canvas.width = canvas.clientWidth;        //Must be above the clear
  canvas.height = canvas.clientHeight;
  gl.clearColor(0.08, 0.08, 0.08, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);   //Clears the buffer completely

  //Rasterizer
  gl.viewport(0, 0, canvas.width, canvas.height);

  //Set GPU Program
  gl.useProgram(triangleShaderProgram);

  const uScaleLocation = gl.getUniformLocation(triangleShaderProgram, "uScale");
  const uOffsetLocation = gl.getUniformLocation(triangleShaderProgram, "uOffset");

  gl.uniform1f(uScaleLocation, 1);
  gl.uniform3f(uOffsetLocation, 0.0, 0.0, 0.0);
  
  gl.enableVertexAttribArray(vertexPositionAttribLocation);

  // Input Assembler
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleGeoBuffer);
  gl.vertexAttribPointer(
    /* index: which attribute to use */
     vertexPositionAttribLocation,
     /* size: how many components in that attribute*/ 
     3,
     /* type: what is the type in the buffer itself */
     gl.FLOAT, 
     /* Normalized: determines the conversion between ints and floats*/
     false,
     /* stride: how many bytes to move foward in the buffer to find the same attribute for the next vertex */
     6 * Float32Array.BYTES_PER_ELEMENT,
     /* offset: how many bytes should the input assembler skip into the buffer when reading attribs*/
     0
  );
  const vertexColorAttribLocation = gl.getAttribLocation(triangleShaderProgram, 'vertexColor');
  gl.enableVertexAttribArray(vertexColorAttribLocation);
  gl.vertexAttribPointer(
    vertexColorAttribLocation,
    3,
    gl.FLOAT,
    false,
    6 * Float32Array.BYTES_PER_ELEMENT,
    3 * Float32Array.BYTES_PER_ELEMENT
  );

  // Draw Call
  gl.drawArrays(gl.TRIANGLES, 0, 3);

}



try {
  helloTriangle();
} catch (e) {
  showError(`Uncaught JavaScript exception: ${e}`);
}