const polygon = (x, y, radius, npoints) => {
	var angle = TWO_PI / npoints;
	beginShape();
	for (var a = 0; a < TWO_PI; a += angle) {
		var sx = x + cos(a) * radius;
		var sy = y + sin(a) * radius;
		vertex(sx, sy);
	}
	endShape(CLOSE);
};

const posOfArea = (x, y) => {
	let result = 1;
	if (x < 0 && y >= 0) result = 2;
	else if (x >= 0 && y >= 0) result = 3;
	else if (x < 0 && y < 0) result = 0;
	return result;
};

/**
 *
 */
class Task5 extends Task {
	setup() {
		this.initAsync.bind(this);
		this.initAsync();
	}
	initAsync() {
		this.speeds = [0.02, 0.04, 0.01, 0.03];
		this.angles = [0, 0, 0, 0];
		this.allowedToSpin = [true, true, true, true];
		this.intervals = this.speeds.map((speed, i) => {
			return setInterval(() => {
				if (this.allowedToSpin[i]) this.angles[i] += speed;
			}, 10);
		});
	}
	draw() {
		background(255);
		fill(255, 0, 0);

		push();
		translate(-width * 0.25, -height * 0.25);
		rotate(this.angles[0]);
		fill(255, 0, 0);
		polygon(0, 0, 82, 3);
		pop();

		push();
		translate(width * 0.25, -height * 0.25);
		rotate(this.angles[1]);
		fill(255, 255, 0);
		polygon(0, 0, 82, 4);
		pop();

		push();
		translate(-width * 0.25, height * 0.25);
		rotate(this.angles[2]);
		fill(255, 0, 255);
		polygon(0, 0, 82, 5);
		pop();

		push();
		translate(width * 0.25, height * 0.25);
		rotate(this.angles[3]);
		fill(0, 0, 255);
		polygon(0, 0, 82, 6);
		pop();
	}

	mousePressed() {
		const center = getMouse();
		if (center.isVisible()) {
			const i = posOfArea(center.x, center.y);
			this.allowedToSpin[i] = !this.allowedToSpin[i];
		}
	}
}
