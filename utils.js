const range = (to, start = 0, step = 1) => {
	return Array.from(
		{ length: Math.floor((to - start) / step) },
		(x, i) => start + i * step
	);
};

function drawGrid(grid, ortho = false) {
	push();
	strokeWeight(0.5);
	stroke(0);
	if (ortho) translate(0, 0, -1000);
	for (let i = -width; i < width; i += grid) {
		line(i, -height, i, height);
	}
	for (let i = -width; i < height; i += grid) {
		line(-width, i, width, i);
	}
	// just to make the grid look better
	line(-width / 2 + 1, -height, -width / 2 + 1, height);
	line(-width, height / 2 - 1, width, height / 2 - 1);

	pop();
}

function drawCustomGrid(grid, h, w, bgOffset = -1) {
	push();
	strokeWeight(0.5);
	stroke(0);
	for (let i = 0; i < w; i += grid) {
		line(i, 0, i, h);
	}
	for (let i = 0; i < h; i += grid) {
		line(0, i, w, i);
	}
	// just to make the grid look better
	// line(-width / 2 + 1, -height, -width / 2 + 1, height);
	// line(-width, height / 2 - 1, width, height / 2 - 1);
	translate(0, 0, bgOffset);
	fill(255);
	rect(1, 0, w, h - 1);

	pop();
}

const drawGrid3D = (gapSize, size, option = 0, drawGraph = () => "") => {
	const angle = millis() / 2000;
	const change = rotateY;
	push();
	translate(0, 0, -1000);
	rotateX(PI);
	rotateY(PI);
	rotateX(1 / sqrt(2));
	// rotateY(radians(-50));
	change(map(option, 0, 100, radians(0), radians(-100)));
	drawCustomGrid(gapSize, size, size, -1);
	rotateY(-HALF_PI);
	drawCustomGrid(gapSize, size, size, 1);
	rotateX(-HALF_PI);
	drawCustomGrid(gapSize, size, size, -1);
	translate(size / 2, size / 2, size / 2);
	rotateX(-HALF_PI);
	drawGraph();
	pop();
};

const rotateWithCenter = (center, angle) => {
	const mtx = new Rotation2D(angle);
	const translate = mtx.dot(center).sub(center);
	return point => mtx.dot(point).sub(translate);
};

const getMouse = () => new Point(mouseX - width / 2, mouseY - height / 2);

const optionsBox = (id = "options") => document.getElementById(id);
const removeOption = child => optionsBox().removeChild(child);

const createDropdown = (options, value, onChange, id) => {
	const dropdown = document.createElement("select");

	options.forEach(option => {
		const opt = document.createElement("option");
		opt.selected = option === value ? "selected" : "";
		opt.innerText = option;
		opt.value = option;
		dropdown.appendChild(opt);
	});
	dropdown.onchange = onChange;
	optionsBox(id).appendChild(dropdown);
	return dropdown;
};

const createSlider = (min, max, value, onChange, id) => {
	const slider = document.createElement("input");
	slider.type = "range";
	slider.min = min;
	slider.max = max;
	slider.value = value;
	slider.classList.add("slider");
	slider.onchange = onChange;
	slider.oninput = onChange;
	optionsBox(id).appendChild(slider);
	return slider;
};

class Drawable {
	constructor() {
		this.draw.bind(this);
	}

	draw() {}
}

class Point extends p5.Vector {
	constructor(x = 0, y = 0, z = 0) {
		super(x, y, z);
		this.draw.bind(this);
		this.isVisible.bind(this);
	}

	draw() {
		push();
		strokeWeight(25);
		point(this.x, this.y);
		strokeWeight(1);
		pop();
	}

	isVisible() {
		return (
			this.x < width / 2 &&
			this.x > -width / 2 &&
			this.y < height / 2 &&
			this.y > -height / 2
		);
	}
}

class Polygon extends Drawable {
	constructor(points) {
		super();
		this.points = points;
		this.rotate.bind(this);
		this.copy.bind(this);
	}

	draw() {
		this.points.reduce((previous, current) => {
			line(previous.x, previous.y, current.x, current.y);
			return current;
		});
	}

	rotate(center, angle) {
		const rotate = rotateWithCenter(center, angle);
		return new Polygon(this.points.map(rotate));
	}

	copy() {
		return new Polygon(this.points.map(point => point.copy()));
	}
}

class Square extends Polygon {
	constructor(origin, size) {
		super([
			new Point(origin.x, origin.y),
			new Point(origin.x + size, origin.y),
			new Point(origin.x + size, origin.y + size),
			new Point(origin.x, origin.y + size),
			new Point(origin.x, origin.y)
		]);
		this.origin = origin;
		this.size = size;
	}
}

class RightTriangle extends Polygon {
	constructor(origin, size) {
		super([
			new Point(origin.x, origin.y),
			new Point(origin.x + size, origin.y),
			new Point(origin.x + size / 2, origin.y - (size * sqrt(3)) / 2),
			new Point(origin.x, origin.y)
		]);
		this.origin = origin;
		this.size = size;
	}
}

class Graph extends Drawable {
	constructor(func) {
		super();
		this.f = func;
	}

	draw(weight = 1, width = 300, height = 300) {
		strokeWeight(weight);
		// for (let i = -width / 2; i <= width / 2; i++) {
		for (let i = -width; i <= width; i++) {
			const fx0 = this.f(i);
			const fx1 = this.f(i + 1);
			if (min(fx0, fx1) <= height) line(i, -fx0, i + 1, -fx1);
		}
	}
}

class Graph3D extends Drawable {
	constructor(func) {
		super();
		this.f = func;
		this.width = width;
		this.precompute.bind(this);
	}

	precompute(width = 300, height = 300, frequency = 5, scale = 0.01) {
		this.width = width;
		this.frequency = frequency;
		const xOff = 1;
		this.points = range(width, -width, frequency).map(z => {
			const g = this.f(z * scale);
			return range(width, -width, xOff).map(x => -g(x * scale) / scale);
		});
		this.lines = this.points.map(z =>
			z.map((y, i) => ({
				x1: i - width,
				x2: i - width + 1,
				y1: y,
				y2: z[i + 1]
			})).filter(l => !isNaN(l.y1 && l.y2) && Math.min(l.y1, l.y2) > -this.width)
		);

	}

	draw(weight = 1) {
		if (this.lines) {
			strokeWeight(weight);
			push();
			translate(0, 0, -this.width);
			this.lines.forEach(z => {
				translate(0, 0, this.frequency);
				z.forEach(l => {
					line(l.x1, l.y1, l.x2, l.y2);
				});
			});
			pop();
		}
	}
}

class Task {
	constructor() {
		this.sliders = [];
		this.dropdowns = [];

		this.setup.bind(this);
		this.draw.bind(this);
		this.mousePressed.bind(this);
		this.mouseReleased.bind(this);
		this.mouseDragged.bind(this);
		this.mouseClicked.bind(this);
		this.mouseMoved.bind(this);
		this.cleanup.bind(this);
		this.createSlider.bind(this);
		this.createDropdown.bind(this);
	}

	setup() {}

	draw() {}

	mousePressed() {}

	mouseReleased() {}

	mouseDragged() {}

	mouseClicked() {}

	mouseMoved() {}

	createSlider(min, max, value, onChange) {
		this.sliders.push(createSlider(min, max, value, onChange));
	}

	createDropdown(options, value, onChange) {
		this.dropdowns.push(createDropdown(options, value, onChange));
	}

	cleanup() {
		this.sliders.forEach(removeOption);
		this.dropdowns.forEach(removeOption);
	}
}
