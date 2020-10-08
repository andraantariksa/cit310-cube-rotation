const canvas = document.querySelector("#canvas");
const canvasContext = canvas.getContext("2d");

var v = [];
var vw = [];
var vr = [];
var vs = [];
var edge = [];
var wt = [];
var vt = [];
var st = [];
var angle = 0;
var theta = 45.0;
var phi = 45.0;
var rotationSpeed = 1.0;
var state = "stop";
var transformation_acc = [];

setPoint(0, -1, -1, -1, 1);
setPoint(1, -1, 1, -1, 1);
setPoint(2, 1, -1, -1, 1);
setPoint(3, 1, 1, -1, 1);
setPoint(4, -1, -1, 1, 1);
setPoint(5, -1, 1, 1, 1);
setPoint(6, 1, -1, 1, 1);
setPoint(7, 1, 1, 1, 1);

setLine(0, 4, 6);
setLine(1, 6, 7);
setLine(2, 7, 5);
setLine(3, 5, 4);
setLine(4, 0, 2);
setLine(5, 2, 3);
setLine(6, 3, 1);
setLine(7, 1, 0);
setLine(8, 4, 0);
setLine(9, 5, 1);
setLine(10, 6, 2);
setLine(11, 7, 3);

setMatrixCol(wt, 0, 1, 0, 0, 0);
setMatrixCol(wt, 1, 0, 1, 0, 0);
setMatrixCol(wt, 2, 0, 0, 1, 0);
setMatrixCol(wt, 3, 0, 0, 0, 1);

setMatrixCol(vt, 0, 1, 0, 0, 0);
setMatrixCol(vt, 1, 0, 1, 0, 0);
setMatrixCol(vt, 2, 0, 0, 0, 0);
setMatrixCol(vt, 3, 0, 0, 0, 1);

// setMatrixCol(vt, 0, cos(phi), sin(phi) * sin(theta) , 0, 0);
// setMatrixCol(vt, 1, 0       , cos(theta)            , 0, 0);
// setMatrixCol(vt, 2, sin(phi), -cos(phi) * sin(theta), 0, 0);
// setMatrixCol(vt, 3, 0       , 0                     , 0, 1);

setMatrixCol(st, 0, 50, 0, 0, 0);
setMatrixCol(st, 1, 0, -50, 0, 0);
setMatrixCol(st, 2, 0, 0, 0, 0);
setMatrixCol(st, 3, 200, 200, 0, 1);

mainLoop();

function setPoint(idx, a, b, c, d) {
  v[idx] = [a, b, c, d];
}

function setLine(idx, v1, v2) {
  edge[idx] = { p1: v1, p2: v2 };
}

function setMatrixCol(m, idx, a, b, c, d) {
  m[idx] = [a, b, c, d];
}

function sin(deg) {
  return Math.sin(deg / 180.0 * Math.PI);
}

function cos(deg) {
  return Math.cos(deg / 180.0 * Math.PI);
}

// https://stackoverflow.com/questions/27205018/multiply-2-matrices-in-javascript
function matrixMultiply(a, b) {
  var aNumRows = a.length, aNumCols = a[0].length,
    bNumRows = b.length, bNumCols = b[0].length,
    m = new Array(aNumRows);
  for (var r = 0; r < aNumRows; ++r) {
    m[r] = new Array(bNumCols);
    for (var c = 0; c < bNumCols; ++c) {
      m[r][c] = 0;
      for (var i = 0; i < aNumCols; ++i) {
        m[r][c] += a[r][i] * b[i][c];
      }
    }
  }
  return m;
}

for (var i = 4; i < 12; i++) {
  var p1 = vs[edge[i].p1];
  var p2 = vs[edge[i].p2];
  draw(p1[1], p1[0], p2[1], p2[0]);
}

for (var i = 0; i < 4; i++) {
  var p1 = vs[edge[i].p1];
  var p2 = vs[edge[i].p2];
  canvasContext.strokeStyle = "red";
  draw(p1[1], p1[0], p2[1], p2[0]);
}

document.addEventListener('keydown', logKey);

function logKey(e) {
  console.log(e.code);
}

function transform() {
  // vw = matrixMultiply(v, wt);
  // vr = matrixMultiply(vw, vt);
  // vs = matrixMultiply(vr, st);
  transformation_acc = wt;
  transformation_acc = matrixMultiply(transformation_acc, vt);
  transformation_acc = matrixMultiply(transformation_acc, st);
  vs = matrixMultiply(v, transformation_acc);
}

function drawCube() {
  for (var i = 4; i < 12; i++) {
    const p1 = vs[edge[i].p1];
    const p2 = vs[edge[i].p2];
    canvasContext.strokeStyle = "black";
    draw(p1[1], p1[0], p2[1], p2[0]);
  }

  for (var i = 0; i < 4; i++) {
    const p1 = vs[edge[i].p1];
    const p2 = vs[edge[i].p2];
    canvasContext.strokeStyle = "red";
    draw(p1[1], p1[0], p2[1], p2[0]);
  }
}

function getForeshorts() {
  const foreshorts = [];
  for (var i = 0; i < 3; i++) {
    foreshorts.push(Math.sqrt(
      vt[i][0] * vt[i][0] +
      vt[i][1] * vt[i][1] +
      vt[i][2] * vt[i][2]
    ));
  }
  return foreshorts;
}

function updateForeshorts() {
  const fx = document.querySelector("#fx");
  const fy = document.querySelector("#fy");
  const fz = document.querySelector("#fz");

  const newForeshorts = getForeshorts();
  fx.value = newForeshorts[0];
  fy.value = newForeshorts[1];
  fz.value = newForeshorts[2];
}

function draw(x1, y1, x2, y2) {
  canvasContext.beginPath();
  canvasContext.lineTo(x1, y1);
  canvasContext.lineTo(x2, y2);
  canvasContext.stroke();
}

function clearCanvas() {
  canvasContext.clearRect(0, 0, canvas.height, canvas.width)
}

function mainLoop() {
  clearCanvas();

  if (state === "rotate") {
    const angleX = document.querySelector("#x-rotate").value;
    const angleY = document.querySelector("#y-rotate").value;
    const angleZ = document.querySelector("#z-rotate").value;

    var tempMatrix = [];
    // Rotate on X
    setMatrixCol(vt, 0, 1, 0, 0, 0);
    setMatrixCol(vt, 1, 0, cos(angleX), 0, 0);
    setMatrixCol(vt, 2, 0, -sin(angleX), 0, 0);
    setMatrixCol(vt, 3, 0, 0, 0, 1);
    // Rotate on Y
    setMatrixCol(tempMatrix, 0, cos(angleY), 0, 0, 0);
    setMatrixCol(tempMatrix, 1, 0, 1, 0, 0);
    setMatrixCol(tempMatrix, 2, sin(angleY), 0, 0, 0);
    setMatrixCol(tempMatrix, 3, 0, 0, 0, 1);

    vt = matrixMultiply(vt, tempMatrix);
    // Rotate on Z
    setMatrixCol(tempMatrix, 0, cos(angleZ), sin(angleZ), 0, 0);
    setMatrixCol(tempMatrix, 1, -sin(angleZ), cos(angleZ), 0, 0);
    setMatrixCol(tempMatrix, 2, 0, 0, 0, 0);
    setMatrixCol(tempMatrix, 3, 0, 0, 0, 1);

    vt = matrixMultiply(vt, tempMatrix);

    updateForeshorts();
    state = "stop";
  } else if (state === "rotateX") {
    angle += rotationSpeed;

    setMatrixCol(vt, 0, 1, 0, 0, 0);
    setMatrixCol(vt, 1, 0, cos(angle), 0, 0);
    setMatrixCol(vt, 2, 0, -sin(angle), 0, 0);
    setMatrixCol(vt, 3, 0, 0, 0, 1);

    updateForeshorts();
  } else if (state === "rotateY") {
    angle += rotationSpeed;

    setMatrixCol(vt, 0, cos(angle), 0, 0, 0);
    setMatrixCol(vt, 1, 0, 1, 0, 0);
    setMatrixCol(vt, 2, sin(angle), 0, 0, 0);
    setMatrixCol(vt, 3, 0, 0, 0, 1);

    updateForeshorts();
  } else if (state === "rotateZ") {
    angle += rotationSpeed;

    setMatrixCol(vt, 0, cos(angle), sin(angle), 0, 0);
    setMatrixCol(vt, 1, -sin(angle), cos(angle), 0, 0);
    setMatrixCol(vt, 2, 0, 0, 0, 0);
    setMatrixCol(vt, 3, 0, 0, 0, 1);

    updateForeshorts();
  } else if (state === "reset") {
    setMatrixCol(vt, 0, 1, 0, 0, 0);
    setMatrixCol(vt, 1, 0, 1, 0, 0);
    setMatrixCol(vt, 2, 0, 0, 0, 0);
    setMatrixCol(vt, 3, 0, 0, 0, 1);

    updateForeshorts();
    state = "stop";
  } else if (state === "axonometric") {
    setMatrixCol(vt, 0, cos(phi), sin(phi) * sin(theta), 0, 0);
    setMatrixCol(vt, 1, 0, cos(theta), 0, 0);
    setMatrixCol(vt, 2, sin(phi), -cos(phi) * sin(theta), 0, 0);
    setMatrixCol(vt, 3, 0, 0, 0, 1);

    updateForeshorts();
    state = "stop";
  } else if (state === "stop") {
    // Do nothing
  } else {
    console.error("Unknown state")
  }

  transform();
  drawCube();

  window.requestAnimationFrame(mainLoop);
}

function updateRotationSpeed() {
  rotationSpeed = parseFloat(document.querySelector("#rotation-speed").value);
}

function updatePhiTheta() {
  phi = parseFloat(document.querySelector("#phi").value);
  theta = parseFloat(document.querySelector("#theta").value);
}

function cubeAxonometric() {
  updatePhiTheta();
  state = "axonometric";
}

function cubeRotateX() {
  updateRotationSpeed();
  state = "rotateX";
}

function cubeRotateY() {
  updateRotationSpeed();
  state = "rotateY";
}
function cubeRotateZ() {
  updateRotationSpeed();
  state = "rotateZ";
}

function cubeStop() {
  state = "stop";
}

function cubeRotate() {
  state = "rotate";
}

function cubeReset() {
  state = "reset";
}
