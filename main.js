const WIDTH = 640;
const HEIGHT = 480;

const task = new Task1();

function setup() {
    createCanvas(WIDTH, HEIGHT, WEBGL);
	task.setup();
}

function draw() {
    task.draw();
}
