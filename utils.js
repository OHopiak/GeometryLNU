const range = (to, start = 0, step = 1) => {
	return Array.from(
		{ length: Math.floor((to - start) / step) },
		(x, i) => start + i * step
	)
};

function drawGrid(grid) {
	push();
	strokeWeight(0.5);
	stroke(0);
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

const rotateWithCenter = (center, angle) => {
	const mtx = new Rotation2D(angle);
	const translate = mtx.dot(center).sub(center);
	return point => mtx.dot(point).sub(translate);
};

const getMouse = () => new Point(mouseX - width / 2, mouseY - height / 2);

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
	isVisible(){
		return this.x < width/2 && this.x > -width/2 && this.y < height/2 && this.y > -height/2;
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

	draw() {
		strokeWeight(1);
		for (let i = -width / 2; i <= width / 2; i++) {
			const fx0 = this.f(i);
			const fx1 = this.f(i + 1);
			if (min(fx0, fx1) <= height / 2) line(i, -fx0, i + 1, -fx1);
		}
	}
}

class Task {
	constructor() {
		this.setup.bind(this);
		this.draw.bind(this);
		this.mousePressed.bind(this);
		this.mouseReleased.bind(this);
		this.mouseDragged.bind(this);
		this.mouseClicked.bind(this);
		this.mouseMoved.bind(this);
		this.cleanup.bind(this);
	}
	setup() {}
	draw() {}
	mousePressed() {}
	mouseReleased() {}
	mouseDragged() {}
	mouseClicked() {}
	mouseMoved() {}
	cleanup() {}
}
