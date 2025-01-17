alert("BASIC PAINT UNDO CLEAR!");
window.onload = () => {
    init();
}

var c;
var ctx;
var x, y, l, t, w, h;
var undoStack = [];
var currentLine = [];

function init() {
    w = 0.95 * window.innerWidth;
    h = 0.83 * window.innerHeight;
    c = document.getElementById("main");
    ctx = c.getContext("2d");

    c.width = w;
    c.height = h;

    var rect = c.getBoundingClientRect();
    l = rect.left;
    t = rect.top;

    ctx.lineWidth = 3;
    ctx.strokeStyle = "black";
    ctx.fillStyle = "black";

    // Add event listeners for touch events
    c.addEventListener("touchstart", startDrawing);
    c.addEventListener("touchmove", draw);
    c.addEventListener("touchend", endDrawing);

    // Add event listeners for mouse events
    c.addEventListener("mousedown", startDrawing);
    c.addEventListener("mousemove", draw);
    c.addEventListener("mouseup", endDrawing);
}

function startDrawing(e) {
    e.preventDefault();
    currentLine = [ctx.strokeStyle];
    if (e.touches) {
        x = e.touches[0].clientX - l;
        y = e.touches[0].clientY - t;
    } else {
        x = e.clientX - l;
        y = e.clientY - t;
    }
}

function draw(e) {
    e.preventDefault();
    if (e.buttons !== 1 && !e.touches) return; // Only draw when the mouse is pressed or touch is active
    ctx.beginPath();
    ctx.moveTo(x, y);
    if (e.touches) {
        x = e.touches[0].clientX - l;
        y = e.touches[0].clientY - t;
    } else {
        x = e.clientX - l;
        y = e.clientY - t;
    }
    ctx.lineTo(x, y);
    ctx.stroke();
    currentLine.push([x, y]);
}

function endDrawing(e) {
    e.preventDefault();
    if (currentLine.length === 1) {
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, 2 * Math.PI);
        ctx.fill();
        currentLine.push([x, y]);
    }
    undoStack.push(currentLine);
}

function colorSelect(color, box) {
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    var boxes = document.getElementsByClassName("color-box");
    for (var i = 0; i < boxes.length; i++) {
        boxes[i].style.width = "35px";
        boxes[i].style.height = "35px";
    }
    boxes[box].style.width = "50px";
    boxes[box].style.height = "50px";
}

function undo() {
    ctx.save();
    undoStack.pop();
    ctx.clearRect(0, 0, w, h);
    undoStack.forEach((cl) => {
        if (cl.length === 2) {
            ctx.fillStyle = cl[0];
            ctx.beginPath();
            ctx.arc(cl[1][0], cl[1][1], 2, 0, 2 * Math.PI);
            ctx.fill();
        } else {
            ctx.beginPath();
            cl.forEach((s, i) => {
                if (i === 0) {
                    ctx.strokeStyle = s;
                } else if (i === 1) {
                    ctx.moveTo(s[0], s[1]);
                    ctx.lineTo(s[2], s[3]);
                } else {
                    ctx.lineTo(s[0], s[1]);
                    ctx.lineTo(s[2], s[3]);
                }
            });
            ctx.stroke();
        }
    });
    ctx.restore();
}

function clearCanvas() {
    ctx.clearRect(0, 0, w, h);
    undoStack = [];
}
