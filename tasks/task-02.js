const productReducer = (acc, cur) => x => acc(x) * cur(x);
const sumReducer = (acc, cur) => x => acc(x) + cur(x);

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
	interpolation() {
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

	/**
	 * for simplicity points will be sorted by x
	 */
	setup() {
		const defaultSize = 7;
		this.createSlider(2, 12, defaultSize, e => {
			this.points = this.generatePoints(-300, 300, e.target.value, true);
			this.graph = new Graph(this.interpolation());
		});
		this.points = this.generatePoints(-300, 300, defaultSize, true);
		this.graph = new Graph(this.interpolation());
	}

	draw() {
		background(255);
		drawGrid(20);
		this.points.forEach(p => p.draw());
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
