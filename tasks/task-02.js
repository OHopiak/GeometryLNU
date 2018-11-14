const productReducer = (acc, cur) => x => acc(x) * cur(x);
const sumReducer = (acc, cur) => x => acc(x) + cur(x);
const composeReducer = (acc, cur) => x => acc(cur(x));
const sum = (a, b) => a + b;
const dot = (v1, v2) => v1.map((val, key) => val * v2[key]).reduce(sum);
const transpose = mtx => mtx.map((row, i) => row.map((_, j) => mtx[j][i]));
const useMtx = (mtx, vec) => mtx.map(row => dot(row, vec));
const matMul = (m1, m2) => {
	const tm2 = transpose(m2);
	return m1.map(row => row.map((_, j) => dot(row, tm2[j])));
};

const magicMatrix = [
	[-0.5, 1, -0.5, 0],
	[1.5, -2.5, 0, 1],
	[-1.5, 2, 0.5, 0],
	[0.5, -0.5, 0, 0]
];

const parabolaCoeficients = (p, i) => {
	const choice = range(-1, 2, -1);
	const { x: a, y: b, z: c } = new Matrix3x3(
		...choice.map(
			j => new Point(...choice.map(pow => Math.pow(p[j + i].x, pow)))
		)
	).solve(new Point(...choice.map(j => p[j + i].y)));
	return {a,b,c};
};

const smoothPara = (p, i) => {
	const coef = parabolaCoeficients(p, i-2);
	const { x: a, y: b, z: c } = new Matrix3x3(
		new Point(p[1 + i].x * p[1 + i].x, p[1 + i].x, 1),
		new Point(p[i].x * p[i].x, p[i].x, 1),
		new Point(2 * p[i].x, 1, 0)
	).solve(new Point(p[1 + i].y, p[i].y, 2 * coef.a * p[i].x + coef.b));
	return parabola(-a, -b, -c);
};

/**
 * Реалізувати алгоритм  параболічної  інтерполяції.
 * Передбачити інтерактивний ввід та обробку інформації.
 * Показати на кожному етапі побудову складових парабол і
 * усереднення їх. Дослідити виконання граничних умов в точках
 * з’єднання. Показати вплив зміни параметрів в кінцевих точках.
 *
 * http://old.exponenta.ru/educat/systemat/hanova/interp/glob/glob1.asp
 */
class Task2 extends Task {
	constructor() {
		super();
		this.interpolation.bind(this);
		this.createSlider.bind(this);
	}

	generatePoints(from, to, number, rand = true) {
		if (to < from) throw new Error("From can not be bigger than to");
		if (number <= 1) throw new Error("The number must be 2 or higher");
		const step = (to - from) / (number - 1);
		const coef = (step / number) * 2;
		const mapper = rand
			? x => new Point(x, random(-100, 100))
			: x => new Point(x, coef * sin(x / coef));
		return range(to + step, from, step).map(mapper);
	}

	/**
	 * Многочлен Лагранжа
	 */
	interpolationOld() {
		const points = this.points;
		const choice = range(points.length);
		return choice
			.map(n => {
				const axis = points[n];
				const basis = choice
					.filter(i => i !== n)
					.map(i => x => (x - points[i].x) / (axis.x - points[i].x))
					.reduce(productReducer);
				return x => -basis(x) * axis.y;
			})
			.reduce(sumReducer);
	}

	interpolation() {
		const points = this.points;
		const from = -300.0;
		const to = 300.0;
		const step = (to - from) / (points.length - 1);
		const btw = (x, from, to) => x >= from && x < to;
		const pointMtx = i =>
			["x", "y"].map(key => points.slice(i, i + 4).map(point => point[key]));

		const x2t = i => {
			const offset = from + step * (i + 1);
			return x => (x - offset) / step;
		};

		const interp = i => {
			const mtxRes = matMul(pointMtx(i), magicMatrix);
			const f = t => useMtx(mtxRes, [t * t * t, t * t, t, 1])[1];
			const argMap = x2t(i);
			return x => -f(argMap(x));
		};

		const paraAt = (i) => {
			const {a,b,c} = parabolaCoeficients(points, i);
			return parabola(-a, -b, -c);
		};
						
		// const funcs = [
		// 	() => paraAt(0),
		// 	() => interp(0),
		// 	() => paraAt(1),
		// 	() => smoothPara(points, 3), 
		// 	() => this.points.length <= 6 ? smoothPara(points, 4) : paraAt(4),
		// 	() => smoothPara(points, 5),
		// ];

		const funcs = [
			() => paraAt(0),
			() => points.length < 4 ? paraAt(0) : interp(0),
			() => paraAt(1),
			() => smoothPara(points, 3), 
			() => points.length < 7 ? smoothPara(points, 4): paraAt(4),
			() => points.length < 8 ? smoothPara(points, 5): interp(4),
			() => paraAt(5),
			() => smoothPara(points, 7), 
			() => points.length < 11 ? smoothPara(points, 8): paraAt(8),
			() => points.length < 12 ? smoothPara(points, 9): interp(8),
			() => paraAt(9),
			() => smoothPara(points, 11), 
		];


		return points
			.slice(0, points.length - 1)
			.map((_, i) => funcs[i])
			.map((f, i) => x =>
				btw(x, from + step * i, from + step * (i + 1)) ? f()(x) : 0
			)
			.reduce(sumReducer);
	}

	/**
	 * for simplicity points will be sorted by x
	 */
	setup() {
		this.extraPoints = [];
		const defaultSize = 4;
		this.createSlider(3, 8, defaultSize, e => this.reset(e.target.value));
		this.reset(defaultSize);
	}

	reset(size) {
		this.points = this.generatePoints(-300, 300, size, true);
		this.graph = new Graph(this.interpolation());
	}

	draw() {
		background(255);
		drawGrid(20);
		this.points.forEach(p => p.draw());
		this.extraPoints.forEach(p => p.draw());
		this.graph.draw();
	}

	closestPoint(points, center) {
		let currentPoint = points[0];
		let shortestDistance = Infinity;
		points.forEach(p => {
			const currentDistance = abs(p.x - center.x);
			if (shortestDistance > currentDistance) {
				currentPoint = p;
				shortestDistance = currentDistance;
			}
		});
		return currentPoint;
	}

	mousePressed() {
		const center = getMouse();
		if (center.isVisible())
			this.chosenPoint = this.closestPoint(this.points, center);
	}

	mouseDragged() {
		const center = getMouse();
		if (this.chosenPoint && center.isVisible()) this.chosenPoint.y = center.y;
	}
}
