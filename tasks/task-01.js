const rotateWithCenterUsingBuiltin = (center, angle) => {
	translate(center.x, center.y);
	rotate(angle);
	translate(-center.x, -center.y);
};


class Task1 extends Task {
	setup() {
		this.origin = new Point(0, -100);
		this.square = new Square(this.origin, 100);
		this.triangle = new RightTriangle(new Point(-200, 0), 100);
		this.center = new Point(100, 100);
		this.useBuiltin = false;
	}
	draw() {
		const { origin, square, triangle, center, useBuiltin } = this;
		background(255);
		drawGrid(20);
		if (mouseIsPressed) {
			center.x = mouseX - width / 2;
			center.y = mouseY - height / 2;
		}
		const angle = radians(millis() / 10);
		// const angle = radians(45);
		strokeWeight(2);
		stroke(0, 0, 255);
		square.draw();
		triangle.draw();
		stroke(255, 0, 0);
		if (useBuiltin) {
			rotateWithCenterUsingBuiltin(center, angle);
			square.draw();
			triangle.draw();
		} else {
			square.rotate(center, angle).draw();
			triangle.rotate(center, angle).draw();
		}
		stroke(0);
		center.draw();
	}
}
