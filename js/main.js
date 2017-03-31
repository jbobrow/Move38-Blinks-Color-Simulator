var gl;

var colors = [
  {r: 1.0, g: 0.0, b: 0.0, a: 1.0},         // RGB LED 1
  {r: 1.0, g: 1.0, b: 0.0, a: 1.0},         // RGB LED 2
  {r: 0.0, g: 1.0, b: 0.0, a: 1.0},         // RGB LED 3
  {r: 0.0, g: 1.0, b: 1.0, a: 1.0},         // RGB LED 4
  {r: 0.0, g: 0.0, b: 1.0, a: 1.0},         // RGB LED 5
  {r: 1.0, g: 0.0, b: 1.0, a: 1.0},         // RGB LED 6
];

function getColorAtVertex(id) {
  var color;

  switch(id) {
    case 0:
      color = getAverageColor(colors);
      break;
    case 1:
      color = colors[0];
      break;
    case 2:
      color = colors[1];
      break;
    case 3:
      color = colors[2];
      break;
    case 4:
      color = colors[3];
      break;
    case 5:
      color = colors[4];
      break;
    case 6:
      color = colors[5];
      break;
    case 7:
      color = getColorDimmed(colors[0], 0.6);
      break;
    case 8:
      color = getColorDimmed(getAverageColor([colors[0],colors[1]]), 0.4);
      break;
  }
  console.log(color);
  return color;
}

function getColorDimmed(color, alpha) {
  return {r:color.r, g:color.g, b:color.b, a:color.a*alpha};
}

function getAverageColor(colors) {

  var r = 0;
  var g = 0;
  var b = 0;
  var a = 0;

  for(var i=0; i<colors.length; i++) {
    r += colors[i].r;
    g += colors[i].g;
    b += colors[i].b;
    a += colors[i].a;
  }

  r /= colors.length;
  g /= colors.length;
  b /= colors.length;
  a /= colors.length;

  return {r:r, g:g, b:b, a:a};
}

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
        points[8].x,  points[8].y,  0.0, // start third triangle
        points[1].x,  points[1].y,  0.0,
        points[7].x,  points[7].y,  0.0,
	];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    triangleVertexPositionBuffer.itemSize = 3;
    triangleVertexPositionBuffer.numItems = 9;

    triangleVertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);
    var vertex_colors = [
        getColorAtVertex(0).r, getColorAtVertex(0).g, getColorAtVertex(0).b, getColorAtVertex(0).a, // color first triangle
        getColorAtVertex(1).r, getColorAtVertex(1).g, getColorAtVertex(1).b, getColorAtVertex(1).a,
        getColorAtVertex(2).r, getColorAtVertex(2).g, getColorAtVertex(2).b, getColorAtVertex(2).a,
        getColorAtVertex(2).r, getColorAtVertex(2).g, getColorAtVertex(2).b, getColorAtVertex(2).a, // color second triangle
        getColorAtVertex(1).r, getColorAtVertex(1).g, getColorAtVertex(1).b, getColorAtVertex(1).a,
        getColorAtVertex(8).r, getColorAtVertex(8).g, getColorAtVertex(8).b, getColorAtVertex(8).a,
        getColorAtVertex(8).r, getColorAtVertex(8).g, getColorAtVertex(8).b, getColorAtVertex(8).a, // color third triangle
        getColorAtVertex(1).r, getColorAtVertex(1).g, getColorAtVertex(1).b, getColorAtVertex(1).a,
        getColorAtVertex(7).r, getColorAtVertex(7).g, getColorAtVertex(7).b, getColorAtVertex(7).a,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertex_colors), gl.STATIC_DRAW);
    triangleVertexColorBuffer.itemSize = 4;
    triangleVertexColorBuffer.numItems = 9;
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
