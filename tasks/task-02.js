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
		const choice = range(this.points.length);
		const product = (acc, cur) => x => acc(x) * cur(x);
		const sum = (acc, cur) => x => acc(x) + cur(x);
		return choice
			.map(n => {
				const axis = this.points[n];
				const basis = choice
					.filter(i => i != n)
					.map(i => {
						return x => (x - this.points[i].x) / (axis.x - this.points[i].x);
					})
					.reduce(product);
				return x => -basis(x) * axis.y;
			})
			.reduce(sum);
	}

	/**
	 * for simplicity points will be sorted by x
	 */
	setup() {
		this.defaultSize = 7;
		this.createSlider();
		this.points = this.generatePoints(-300, 300, this.defaultSize, true);
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

	createSlider() {
		this.slider = document.createElement("input");
		this.slider.type = "range";
		this.slider.min = 2;
		this.slider.max = 12;
		this.slider.value = this.defaultSize;
		this.slider.id = "task2-slider";
		this.slider.classList.add("slider");
		this.slider.onchange = () => {
			this.points = this.generatePoints(-300, 300, this.slider.value, true);
			this.graph = new Graph(this.interpolation());
		};
		document.getElementById("options").appendChild(this.slider);
	}
	cleanup() {
		document.getElementById("options").removeChild(this.slider);
	}
}
