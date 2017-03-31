var gl;

var points = [
  {x: 0, y:0},                                               // 0 - center
  {x: 0, y:1},                                               // 1 - inner ring
  {x: Math.cos(Math.PI/6), y: Math.sin(Math.PI/6)},          // 2
  {x: Math.cos(-Math.PI/6), y: Math.sin(-Math.PI/6)},        // 3
  {x: 0, y:-1},                                              // 4
  {x: Math.cos(-5*Math.PI/6), y: Math.sin(-5*Math.PI/6)},    // 5
  {x: Math.cos(5*Math.PI/6), y: Math.sin(5*Math.PI/6)},      // 6
  {x: 0, y:2*Math.sin(Math.PI/3)},                           // 7 - outer ring
  {x: 2*Math.cos(Math.PI/3), y:2*Math.sin(Math.PI/3)},       // 8
  {x: Math.cos(Math.PI/3)+1, y:Math.sin(Math.PI/3)},         // 9
  {x: 2, y:0},                                               // 10
  {x: Math.cos(Math.PI/3)+1, y:Math.sin(-Math.PI/3)},        // 11
  {x: 2*Math.cos(-Math.PI/3), y:2*Math.sin(-Math.PI/3)},     // 12
  {x: 0, y:2*Math.sin(-Math.PI/3)},                          // 13
  {x: 2*Math.cos(-2*Math.PI/3), y:2*Math.sin(-2*Math.PI/3)}, // 14
  {x: Math.cos(-2*Math.PI/3)-1, y:Math.sin(-2*Math.PI/3)},   // 15
  {x: -2, y:0},                                              // 16
  {x: Math.cos(2*Math.PI/3)-1, y:Math.sin(2*Math.PI/3)},     // 17
  {x: 2*Math.cos(2*Math.PI/3), y:2*Math.sin(2*Math.PI/3)}    // 18
];

function initGL(canvas) {
    try {
        gl = canvas.getContext("experimental-webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    } catch (e) {
    }
    if (!gl) {
        alert("Could not initialise WebGL, sorry :-(");
    }
}


function getShader(gl, id) {
    var shaderScript = document.getElementById(id);
    if (!shaderScript) {
        return null;
    }

    var str = "";
    var k = shaderScript.firstChild;
    while (k) {
        if (k.nodeType == 3) {
            str += k.textContent;
        }
        k = k.nextSibling;
    }

    var shader;
    if (shaderScript.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}


var shaderProgram;

function initShaders() {
    var fragmentShader = getShader(gl, "shader-fs");
    var vertexShader = getShader(gl, "shader-vs");

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }

    gl.useProgram(shaderProgram);

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
    gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
}


var mvMatrix = mat4.create();
var pMatrix = mat4.create();

function setMatrixUniforms() {
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
}


var triangleVertexPositionBuffer;
var triangleVertexColorBuffer;

function initBuffers() {
    triangleVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
    var vertices = [
        points[0].x,  points[0].y,  0.0, // start first triangle
        points[1].x,  points[1].y,  0.0,
        points[2].x,  points[2].y,  0.0,
        points[2].x,  points[2].y,  0.0, // start second triangle
        points[1].x,  points[1].y,  0.0,
        points[8].x,  points[8].y,  0.0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    triangleVertexPositionBuffer.itemSize = 3;
    triangleVertexPositionBuffer.numItems = 6;

    triangleVertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);
    var colors = [
        1.0, 0.0, 0.0, 1.0, // color first triangle
        0.0, 1.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        1.0, 1.0, 0.0, 1.0, // color second triangle
        0.0, 1.0, 1.0, 1.0,
        1.0, 0.0, 1.0, 1.0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    triangleVertexColorBuffer.itemSize = 4;
    triangleVertexColorBuffer.numItems = 3;
}



function drawScene() {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);

    mat4.identity(mvMatrix);

    mat4.translate(mvMatrix, [0.0, 0.0, -5.0]);
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, triangleVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, triangleVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

    setMatrixUniforms();
    gl.drawArrays(gl.TRIANGLES, 0, triangleVertexPositionBuffer.numItems);
}



function webGLStart() {
    var canvas = document.getElementById("lesson02-canvas");
    initGL(canvas);
    initShaders();
    initBuffers();

    gl.clearColor(1.0, 1.0, 1.0, 1.0);  // set background to white
    gl.enable(gl.DEPTH_TEST);

    drawScene();
}
