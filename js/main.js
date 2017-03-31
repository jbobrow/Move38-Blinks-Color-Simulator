var gl;

var colors = [
  {r: 1.0, g: 0.0, b: 0.0, a: 1.0},         // RGB LED 1
  {r: 1.0, g: 1.0, b: 0.0, a: 1.0},         // RGB LED 2
  {r: 0.0, g: 1.0, b: 0.0, a: 1.0},         // RGB LED 3
  {r: 0.0, g: 1.0, b: 1.0, a: 1.0},         // RGB LED 4
  {r: 0.0, g: 0.0, b: 1.0, a: 1.0},         // RGB LED 5
  {r: 1.0, g: 0.0, b: 1.0, a: 1.0},         // RGB LED 6
];

var vertexDimLevel = 0.2;
var faceDimLevel = 0.4;

function getColorAtVertex(id) {
  var color;

  switch(id) {
    case 0:
      color = getAdditiveColor(colors, 0.6);
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
      color = getColorDimmed(colors[0], faceDimLevel);
      break;
    case 8:
      color = getAdditiveColor([colors[0],colors[1]], vertexDimLevel);
      break;
    case 9:
      color = getColorDimmed(colors[1], faceDimLevel);
      break;
    case 10:
      color = getAdditiveColor([colors[1],colors[2]], vertexDimLevel);
      break;
    case 11:
      color = getColorDimmed(colors[2], faceDimLevel);
      break;
    case 12:
      color = getAdditiveColor([colors[2],colors[3]], vertexDimLevel);
      break;
    case 13:
      color = getColorDimmed(colors[3], faceDimLevel);
      break;
    case 14:
      color = getAdditiveColor([colors[3],colors[4]], vertexDimLevel);
      break;
    case 15:
      color = getColorDimmed(colors[4], faceDimLevel);
      break;
    case 16:
      color = getAdditiveColor([colors[4],colors[5]], vertexDimLevel);
      break;
    case 17:
      color = getColorDimmed(colors[5], faceDimLevel);
      break;
    case 18:
      color = getAdditiveColor([colors[5],colors[0]], vertexDimLevel);
      break;
  }
  // console.log(color);
  return color;
}

function getColorDimmed(color, alpha) {
  return {r:color.r, g:color.g, b:color.b, a:color.a*alpha};
}

function getAdditiveColor(colors, percent) {
  var r = 0;
  var g = 0;
  var b = 0;
  var a = 0;

  for(var i=0; i<colors.length; i++) {
    r += colors[i].r * percent;
    g += colors[i].g * percent;
    b += colors[i].b * percent;
    a += colors[i].a * percent;
  }

  r = r > 1.0 ? 1.0: r;
  g = g > 1.0 ? 1.0: g;
  b = b > 1.0 ? 1.0: b;
  a = a > 1.0 ? 1.0: a;

  return {r:r, g:g, b:b, a:a};
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

function getArrayWithColors(ids) {
  var colorArray = [];
  for(var i=0; i<ids.length; i++){
    colorArray.push(getColorAtVertex(ids[i]).r);
    colorArray.push(getColorAtVertex(ids[i]).g);
    colorArray.push(getColorAtVertex(ids[i]).b);
    colorArray.push(getColorAtVertex(ids[i]).a);
  }
  return colorArray;
}

function getArrayWithPoints(ids) {
  var pointArray = [];
  for(var i=0; i<ids.length; i++){
    pointArray.push(points[ids[i]].x);
    pointArray.push(points[ids[i]].y);
    pointArray.push(points[ids[i]].z);
  }
  return pointArray;
}

var centerHeight = 0.5; // center of the Blink
var innerHeight = 0.3;  // 6 LEDs in the inner ring

var points = [
  {x: 0, y:0, z:centerHeight},                                               // 0 - center
  {x: 0, y:1, z:innerHeight},                                               // 1 - inner ring
  {x: Math.cos(Math.PI/6), y: Math.sin(Math.PI/6), z:innerHeight},          // 2
  {x: Math.cos(-Math.PI/6), y: Math.sin(-Math.PI/6), z:innerHeight},        // 3
  {x: 0, y:-1, z:innerHeight},                                              // 4
  {x: Math.cos(-5*Math.PI/6), y: Math.sin(-5*Math.PI/6), z:innerHeight},    // 5
  {x: Math.cos(5*Math.PI/6), y: Math.sin(5*Math.PI/6), z:innerHeight},      // 6
  {x: 0, y:2*Math.sin(Math.PI/3), z:0},                                     // 7 - outer ring
  {x: 2*Math.cos(Math.PI/3), y:2*Math.sin(Math.PI/3), z:0},                 // 8
  {x: Math.cos(Math.PI/3)+1, y:Math.sin(Math.PI/3), z:0},                   // 9
  {x: 2, y:0, z:0},                                                         // 10
  {x: Math.cos(Math.PI/3)+1, y:Math.sin(-Math.PI/3), z:0},                  // 11
  {x: 2*Math.cos(-Math.PI/3), y:2*Math.sin(-Math.PI/3), z:0},               // 12
  {x: 0, y:2*Math.sin(-Math.PI/3), z:0},                                    // 13
  {x: 2*Math.cos(-2*Math.PI/3), y:2*Math.sin(-2*Math.PI/3), z:0},           // 14
  {x: Math.cos(-2*Math.PI/3)-1, y:Math.sin(-2*Math.PI/3), z:0},             // 15
  {x: -2, y:0, z:0},                                                        // 16
  {x: Math.cos(2*Math.PI/3)-1, y:Math.sin(2*Math.PI/3), z:0},               // 17
  {x: 2*Math.cos(2*Math.PI/3), y:2*Math.sin(2*Math.PI/3), z:0}              // 18
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

    // vertices order
    var arrayOfIndices =
    [ 0,  1,  2,
      2,  1,  8,
      8,  1,  7,
      2,  8,  9,
      2,  9,  10,
      2,  10, 3,
      0,  2,  3,
      3,  10, 11,
      3,  11, 12,
      3,  12, 4,
      4,  12, 13,
      3,  4,  0,
      4,  5,  0,
      4,  14, 5,
      4,  13, 14,
      14, 15, 5,
      15, 16, 5,
      5,  16,  6,
      6,  0,  5,
      6,  16, 17,
      6,  17, 18,
      18, 7,  1,
      1,  6,  18,
      1,  0,  6];

    triangleVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
    var vertices = getArrayWithPoints(arrayOfIndices);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    triangleVertexPositionBuffer.itemSize = 3;
    triangleVertexPositionBuffer.numItems = arrayOfIndices.length;

    triangleVertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);
    var vertex_colors = getArrayWithColors(arrayOfIndices);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertex_colors), gl.STATIC_DRAW);
    triangleVertexColorBuffer.itemSize = 4;
    triangleVertexColorBuffer.numItems = arrayOfIndices.length;
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

function initDatGui() {
  // create settings w/ dat.gui
  var settings = new Settings();

  function Settings(){
    this.color_all = '#ff25ff';  // Nick's favorite color
    this.color_1 = '#ff0000';
    this.color_2 = '#ffff00';
    this.color_3 = '#00ff00';
    this.color_4 = '#00ffff';
    this.color_5 = '#0000ff';
    this.color_6 = '#ff00ff';
  };

  var gui = new dat.GUI();

  var f0 = gui.addFolder('Beginner');
  var color_all_control = f0.addColor(settings, 'color_all');
  f0.closed = true;

  var f1 = gui.addFolder('Advanced');
  var color_1_control = f1.addColor(settings, 'color_1');
  var color_2_control = f1.addColor(settings, 'color_2');
  var color_3_control = f1.addColor(settings, 'color_3');
  var color_4_control = f1.addColor(settings, 'color_4');
  var color_5_control = f1.addColor(settings, 'color_5');
  var color_6_control = f1.addColor(settings, 'color_6');
  f1.closed = false;

  color_all_control.onChange(function(value) {
    // Fires on every change, drag, keypress, etc.
    var c = hexToRgbA(settings.color_all);
    colors[0] = c;
    colors[1] = c;
    colors[2] = c;
    colors[3] = c;
    colors[4] = c;
    colors[5] = c;
    initBuffers();  // this seems like a really heavy way to do this, perhaps we just refresh the color part
  });

  color_1_control.onChange(function(value) {
    // Fires on every change, drag, keypress, etc.
    colors[0] = hexToRgbA(settings.color_1);
    initBuffers();  // this seems like a really heavy way to do this, perhaps we just refresh the color part
  });

  color_2_control.onChange(function(value) {
    // Fires on every change, drag, keypress, etc.
    colors[1] = hexToRgbA(settings.color_2);
    initBuffers();  // this seems like a really heavy way to do this, perhaps we just refresh the color part
  });

  color_3_control.onChange(function(value) {
    // Fires on every change, drag, keypress, etc.
    colors[2] = hexToRgbA(settings.color_3);
    initBuffers();  // this seems like a really heavy way to do this, perhaps we just refresh the color part
  });

  color_4_control.onChange(function(value) {
    // Fires on every change, drag, keypress, etc.
    colors[3] = hexToRgbA(settings.color_4);
    initBuffers();  // this seems like a really heavy way to do this, perhaps we just refresh the color part
  });

  color_5_control.onChange(function(value) {
    // Fires on every change, drag, keypress, etc.
    colors[4] = hexToRgbA(settings.color_5);
    initBuffers();  // this seems like a really heavy way to do this, perhaps we just refresh the color part
  });

  color_6_control.onChange(function(value) {
    // Fires on every change, drag, keypress, etc.
    colors[5] = hexToRgbA(settings.color_6);
    initBuffers();  // this seems like a really heavy way to do this, perhaps we just refresh the color part
  });
}

var lastTime = 0;

function animate() {
    // var timeNow = new Date().getTime();
    // if (lastTime != 0) {
    //     var elapsed = timeNow - lastTime;
    //     // do something time based here
    // }
    // lastTime = timeNow;
}


function tick() {
    requestAnimFrame(tick);
    drawScene();
    animate();
}

function webGLStart() {
    var canvas = document.getElementById("lesson02-canvas");
    initGL(canvas);
    initShaders();
    initBuffers();
    initDatGui();

    gl.clearColor(1.0, 1.0, 1.0, 1.0);  // set background to white
    gl.enable(gl.DEPTH_TEST);

    //drawScene();
    tick();
}


// Convenience function
// with the help of: http://stackoverflow.com/questions/21646738/convert-hex-to-rgba
function hexToRgbA(hex){
    var c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        //return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',1)';
        var r = ((c>>16)&255) / 255.0;
        var g = ((c>>8)&255) / 255.0;
        var b = (c&255) / 255.0;
        return {r:r, g:g, b:b, a:1.0}
    }
    throw new Error('Bad Hex');
}

/*  returned value: (String)
rgba(251,175,255,1)
*/
