const MinorX = [["b", "c"], ["a", "c"], ["a", "b"]];
const MinorY = [["y", "z"], ["x", "z"], ["x", "y"]];
const Rows2x2 = ["a", "b"];
const Cols2x2 = ["x", "y"];
const Rows3x3 = ["a", "b", "c"];
const Cols3x3 = ["x", "y", "z"];


class Matrix {
	constructor() {
		this.transpose.bind(this);
		this.dot.bind(this);
		this.mul.bind(this);
		this.det.bind(this);
		this.inverse.bind(this);
		this.minor.bind(this);
		this.adjugate.bind(this);
	}
	transpose() {}
	dot() {}
	mul() {}
	det() {}
	inverse() {}
	minor() {}
	adjugate() {}
}

class Matrix2x2 extends Matrix {
	constructor(a, b) {
		super();
		this.a = new Point(a.x, a.y);
		this.b = new Point(b.x, b.y);
	}
	transpose() {
		return new Matrix2x2(new Point(a.x, b.x), new Point(a.y, b.y));
	}
	dot(vec) {
		return new Point(this.a.dot(vec), this.b.dot(vec));
	}
	det() {
		const { a, b } = this;
		return a.x * b.y - a.y * b.x;
	}
	inverse(){
		const D = this.det();
		return new Matrix(
			new Point( b.y/D, -a.y/D),
			new Point( -b.x/D, a.x/D),
		);
	}
	mul(mtx) {
		const trns = mtx.transpose();
		return new Matrix2x2(
			...Rows2x2.map(x => new Point(...Rows2x2.map(y => this[x].dot(trns[y]))))
		);
	}

	static identity() {
		return new Matrix2x2(new Point(1, 0), new Point(0, 1));
	}
}

class Matrix3x3 extends Matrix {
	constructor(a, b, c) {
		super();
		this.a = new Point(a.x, a.y, a.z);
		this.b = new Point(b.x, b.y, b.z);
		this.c = new Point(c.x, c.y, c.z);
	}
	transpose() {
		const { a, b, c } = this;
		return new Matrix3x3(
			new Point(a.x, b.x, c.x),
			new Point(a.y, b.y, c.y),
			new Point(a.z, b.z, c.z)
		);
	}
	dot(vec) {
		return new Point(...Rows3x3.map(i => this[i].dot(vec)));
	}
	mul(mtx) {
		const trns = mtx.transpose();
		return new Matrix3x3(
			...Rows3x3.map(x => new Point(...Rows3x3.map(y => this[x].dot(trns[y]))))
		);
	}
	det() {
		const { a, b, c } = this;
		return (
			a.x * b.y * c.z -
			a.x * b.z * c.y -
			a.y * b.x * c.z +
			a.y * b.z * c.x +
			a.z * b.x * c.y -
			a.z * b.y * c.x
		);
	}
	minor(x, y) {
		const xs = MinorX[x];
		const ys = MinorY[y];
		return new Matrix2x2(
			...range(2).map(x => new Point(...range(2).map(y => this[xs[x]][ys[y]])))
		);
	}
	adjugate() {
		const trns = this.transpose();
		const rows = range(3).map(
			x =>
				new Point(
					...range(3).map(y => Math.pow(-1, x + y) * trns.minor(x, y).det())
				)
		);
		return new Matrix3x3(...rows);
	}
	inverse() {
		const det = this.det();
		return det ? this.adjugate().mul(Matrix3x3.scale(1 / det)) : null;
	}
	solve(vec){
		return this.inverse().dot(vec)
	}
	static scale(coef) {
		return new Matrix3x3(
			new Point(coef, 0, 0),
			new Point(0, coef, 0),
			new Point(0, 0, coef)
		);
	}
	static identity() {
		return this.scale(1);
	}
}

class MatrixNxN extends Matrix {
	constructor(rawMtx){
		super();
		this.mtx = math.matrix(rawMtx);
	}
}

class Rotation2D extends Matrix2x2 {
	constructor(angle) {
		const sinA = sin(angle);
		const cosA = cos(angle);
		super(new Point(cosA, -sinA), new Point(sinA, cosA));
	}
}

const parabola = (a = 1, b = 0, c = 0) => x => a * x * x + b * x + c;
