let WIDTH = 640;
let HEIGHT = 480;
let task = null;
let number = 2;

/**
 *   http://sites.google.com/site/cabinetvps/
 *   1: 10,
 *   2: 9-10,
 *   3: 6.1,
 */
const TASKS = [new Task1(), new Task2(), new Task3(), new Task4()];

function reset() {
	if (task) task.cleanup();
	task = number >= 0 && number < TASKS.length ? TASKS[number] : TASKS[0];
	task.setup();
}

function createOptions() {
	const data = TASKS.map(
		(task, key) =>
			`<option value="${key}" ${
				number === key ? ' selected="selected"' : ""
				}>Task ${key + 1}</option>`
	);
	const select = document.createElement("select");
	select.innerHTML = data.join("");
	select.onchange = function () {
		number = this.value;
		reset();
	};
	const wrapper = document.createElement("div");
	wrapper.appendChild(select);
	document.getElementById('select-task').appendChild(wrapper);
}

function setup() {
	const canvas = createCanvas(WIDTH, HEIGHT, WEBGL);
	canvas.parent('canvas');
	reset();
	createOptions();
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
