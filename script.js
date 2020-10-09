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
var thetaInput = 45.0;
var phiInput = 45.0;
var rotationSpeedInput = 30.0;
var rotationAngleInput = 0.0;
var state = "stop";
var timePrevious = Date.now();

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

setMatrixRow(wt, 0, 1, 0, 0, 0);
setMatrixRow(wt, 1, 0, 1, 0, 0);
setMatrixRow(wt, 2, 0, 0, 1, 0);
setMatrixRow(wt, 3, 0, 0, 0, 1);

setMatrixRow(vt, 0, 1, 0, 0, 0);
setMatrixRow(vt, 1, 0, 1, 0, 0);
setMatrixRow(vt, 2, 0, 0, 0, 0);
setMatrixRow(vt, 3, 0, 0, 0, 1);

setMatrixRow(st, 0, 50, 0, 0, 0);
setMatrixRow(st, 1, 0, -50, 0, 0);
setMatrixRow(st, 2, 0, 0, 1, 0);
setMatrixRow(st, 3, 200, 200, 0, 1);

mainLoop();

function setPoint(idx, a, b, c, d) {
  v[idx] = [a, b, c, d];
}

function setLine(idx, v1, v2) {
  edge[idx] = { p1: v1, p2: v2 };
}

function setMatrixRow(m, idx, a, b, c, d) {
  m[idx] = [a, b, c, d];
}

function sin(deg) {
  return Math.sin(deg * Math.PI / 180.0);
}

function cos(deg) {
  return Math.cos(deg* Math.PI / 180.0 );
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

function transform() {
  vw = matrixMultiply(v, wt);
  vr = matrixMultiply(vw, vt);
  vs = matrixMultiply(vr, st);
}

function drawCube() {
  for (var i = 4; i < 12; i++) {
    const p1 = vs[edge[i].p1];
    const p2 = vs[edge[i].p2];
    canvasContext.strokeStyle = "black";
    draw(p1[0], p1[1], p2[0], p2[1]);
  }

  for (var i = 0; i < 4; i++) {
    const p1 = vs[edge[i].p1];
    const p2 = vs[edge[i].p2];
    canvasContext.strokeStyle = "red";
    draw(p1[0], p1[1], p2[0], p2[1]);
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
  const now = Date.now();

  const deltaTime = (now - timePrevious) / 1000.0;
  timePrevious = now;

  clearCanvas();

  if (state === "rotateX") {
    setMatrixRow(wt, 0, 1, 0, 0, 0);
    setMatrixRow(wt, 1, 0, cos(rotationAngleInput), sin(rotationAngleInput), 0);
    setMatrixRow(wt, 2, 0, -sin(rotationAngleInput), cos(rotationAngleInput), 0);
    setMatrixRow(wt, 3, 0, 0, 0, 1);

    state = "stop";
  } else if (state === "rotateY") {
    setMatrixRow(wt, 0, cos(rotationAngleInput), 0, -sin(rotationAngleInput), 0);
    setMatrixRow(wt, 1, 0, 1, 0, 0);
    setMatrixRow(wt, 2, sin(rotationAngleInput), 0, cos(rotationAngleInput), 0);
    setMatrixRow(wt, 3, 0, 0, 0, 1);

    state = "stop";
  } else if (state === "rotateZ") {
    setMatrixRow(wt, 0, cos(rotationAngleInput), sin(rotationAngleInput), 0, 0);
    setMatrixRow(wt, 1, -sin(rotationAngleInput), cos(rotationAngleInput), 0, 0);
    setMatrixRow(wt, 2, 0, 0, 0, 0);
    setMatrixRow(wt, 3, 0, 0, 0, 1);

    state = "stop";
  } else if (state === "animateRotateX") {
    angle += rotationSpeedInput * deltaTime;

    setMatrixRow(wt, 0, 1, 0, 0, 0);
    setMatrixRow(wt, 1, 0, cos(angle), sin(angle), 0);
    setMatrixRow(wt, 2, 0, -sin(angle), cos(angle), 0);
    setMatrixRow(wt, 3, 0, 0, 0, 1);
  } else if (state === "animateRotateY") {
    angle += rotationSpeedInput * deltaTime;

    setMatrixRow(wt, 0, cos(angle), 0, -sin(angle), 0);
    setMatrixRow(wt, 1, 0, 1, 0, 0);
    setMatrixRow(wt, 2, sin(angle), 0, cos(angle), 0);
    setMatrixRow(wt, 3, 0, 0, 0, 1);
  } else if (state === "animateRotateZ") {
    angle += rotationSpeedInput * deltaTime;

    setMatrixRow(wt, 0, cos(angle), sin(angle), 0, 0);
    setMatrixRow(wt, 1, -sin(angle), cos(angle), 0, 0);
    setMatrixRow(wt, 2, 0, 0, 0, 0);
    setMatrixRow(wt, 3, 0, 0, 0, 1);
  } else if (state === "reset") {
    setMatrixRow(wt, 0, 1, 0, 0, 0);
    setMatrixRow(wt, 1, 0, 1, 0, 0);
    setMatrixRow(wt, 2, 0, 0, 1, 0);
    setMatrixRow(wt, 3, 0, 0, 0, 1);

    state = "stop";
  } else if (state === "axonometric") {
    setMatrixRow(wt, 0, cos(phiInput), sin(phiInput) * sin(thetaInput), 0, 0);
    setMatrixRow(wt, 1, 0, cos(thetaInput), 0, 0);
    setMatrixRow(wt, 2, sin(phiInput), -cos(phiInput) * sin(thetaInput), 0, 0);
    setMatrixRow(wt, 3, 0, 0, 0, 1);

    state = "stop";
  } else if (state === "stop") {
    // Do nothing
    setMatrixRow(wt, 0, 1, 0, 0, 0);
    setMatrixRow(wt, 1, 0, 1, 0, 0);
    setMatrixRow(wt, 2, 0, 0, 1, 0);
    setMatrixRow(wt, 3, 0, 0, 0, 1);
  } else {
    console.error("Unknown state")
  }

  transform();
  updateForeshorts();
  drawCube();

  window.requestAnimationFrame(mainLoop);
}

function updateRotationSpeed() {
  rotationSpeedInput = parseFloat(document.querySelector("#rotation-speed").value);
}

function updatePhiTheta() {
  phiInput = parseFloat(document.querySelector("#phi").value);
  thetaInput = parseFloat(document.querySelector("#theta").value);
}

function cubeAxonometric() {
  updatePhiTheta();
  state = "axonometric";
}

function cubeAnimateRotateX() {
  updateRotationSpeed();
  state = "animateRotateX";
}

function cubeAnimateRotateY() {
  updateRotationSpeed();
  state = "animateRotateY";
}
function cubeAnimateRotateZ() {
  updateRotationSpeed();
  state = "animateRotateZ";
}

function cubeStop() {
  state = "stop";
}

function updateRotationAngleInput() {
  rotationAngleInput = document.querySelector("#rotate-angle").value;
}

function cubeRotateX() {
  updateRotationAngleInput();
  state = "rotateX";
}

function cubeRotateY() {
  updateRotationAngleInput();
  state = "rotateY";
}

function cubeRotateZ() {
  updateRotationAngleInput();
  state = "rotateZ";
}

function cubeReset() {
  state = "reset";
}
