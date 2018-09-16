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
    line(-width/2+1, -height, -width/2+1, height);    
	line(-width, height/2-1, width, height/2-1);    

	pop();
}

const rotateWithCenter = (center, angle) => {
	const sinA = sin(angle);
	const cosA = cos(angle);
	const xRow = new Point(cosA, -sinA);
	const yRow = new Point(sinA, cosA);
	const translate = new Point(
		center.dot(xRow) - center.x,
		center.dot(yRow) - center.y
	);
	return point =>
		new Point(point.dot(xRow) - translate.x, point.dot(yRow) - translate.y);
};

class Point extends p5.Vector {
	constructor(x, y) {
		super(x, y);
		this.draw.bind(this);
	}
	draw() {
		push();
		strokeWeight(25);
		point(this.x, this.y);
		strokeWeight(1);
		pop();
	}
}

class Polygon {
	constructor(points) {
		this.points = points;
		this.draw.bind(this);
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
			new Point(origin.x + size / 2, origin.y - size * sqrt(3)/2),
			new Point(origin.x, origin.y)
		]);
		this.origin = origin;
		this.size = size;
	}
}

class Task {
    constructor(){
        this.setup.bind(this);
        this.draw.bind(this);
    }
    setup(){}
    draw(){}
}
