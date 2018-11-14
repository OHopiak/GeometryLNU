let WIDTH = 640;
let HEIGHT = 480;
let task = null;
let defaultTaskName = "Task 2";

/**
 *   http://sites.google.com/site/cabinetvps/
 *   1: 10,
 *   2: 9-10,
 *   3: 6.1,
 */
const TASKS = {
	["Task 1"]: new Task1(),
	["Task 2"]: new Task2(),
	["Task 3"]: new Task3(),
	["Task 4"]: new Task4(),
	["Task 5"]: new Task5(),
};

function reset(number) {
	if (task) task.cleanup();
	task = TASKS[number] ? TASKS[number] : TASKS["Task 1"];
	task.setup();
}

function setup() {
	const canvas = createCanvas(WIDTH, HEIGHT, WEBGL);
	canvas.parent("canvas");
	createDropdown(
		Object.keys(TASKS),
		defaultTaskName,
		e => reset(e.target.value),
		"select-task"
	);
	reset(defaultTaskName);
}

function draw() {
	task.draw();
}

function mousePressed() {
	task.mousePressed();
}

function mouseReleased() {
	task.mouseReleased();
}

function mouseDragged() {
	task.mouseDragged();
}

function mouseClicked() {
	task.mouseClicked();
}

function mouseMoved() {
	task.mouseMoved();
}
