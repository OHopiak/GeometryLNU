const parabola = (a = 1, b = 0, c = 0) => x => a * x * x + b * x + c;
const parabola3D = (a = 1, b = 0, c = 1) => z => x => a * x * x + b * x * z + c * z * z;
const hemisphere = (radius = 1, coef = 1) => z => x => coef * sqrt(radius * radius - z * z - x * x);

/**
 *
 */
class Task3 extends Task {
	setup() {
		this.sliders = [];
		this.dropdowns = [];
		this.options = {
			angle: 50,
			zoom: 25,
		};

		this.functions = {
			y1: Task3.y1,
			y2: Task3.y2,
			parabola: () => () => parabola(),
			parabola3D,
			hemisphere,
		};


		Object.keys(this.options).forEach((key) => {
			this.createSlider(0, 100, this.options[key], e => {
				this.options[key] = e.target.value;
			});
		});
		this.createDropdown(Object.keys(this.functions), 'y1', e => {
			const funcName = e.target.options[e.target.selectedIndex].value;
			this.graph1 = new Graph3D(this.functions[funcName]())
		});
		this.createDropdown(Object.keys(this.functions), 'y2', e => {
			const funcName = e.target.options[e.target.selectedIndex].value;
			this.graph2 = new Graph3D(this.functions[funcName]())
		});

		this.graph1 = new Graph3D(this.functions.y1());
		this.graph2 = new Graph3D(this.functions.y2());
	}

	draw() {
		const {options, graph1, graph2} = this;
		background(255);
		const size = 300;
		perspective(map(options.zoom, 0, 100, 0.5, 0.1), width/height, 177, 17777);
		drawGrid3D(20, size, options.angle, () => {
			stroke(0, 0, 255);
			const scale = 0.05;
			const freq = 6;
			const limit = size/2;
			graph1.draw(1, limit, limit, freq, scale);
			stroke(255, 0, 0);
			graph2.draw(1, limit, limit, freq, scale);
			stroke(0);
		});
		// ortho(-width / 2, width / 2, -height / 2, height / 2, 0, 2000);
	}

	static y1() {
		return z => x => {
			let result = 0;
			if (x < -TWO_PI || x > TWO_PI || z < -TWO_PI || z > TWO_PI) {
				result = 0;
			}
			else {
				const R = sqrt(x * x + z * z);
				result = 8 * cos(1.2 * R);
			}
			return result;
		};
	}

	static y2() {
		return z => x => {
			let result = 0;
			if (x < -TWO_PI || x > TWO_PI || z < -TWO_PI || z > TWO_PI) {
				result = 0;
			}
			else {
				const R = sqrt(x * x + z * z);
				result = 16 * (sin(1.2 * R) + cos(1.5 * R)) / (R-1);
			}
			return result;
		};
	}

	createSlider(min, max, value, onChange) {
		const slider = document.createElement("input");
		slider.type = "range";
		slider.min = min;
		slider.max = max;
		slider.value = value;
		slider.classList.add("slider");
		slider.onchange = onChange;
		slider.oninput = onChange;
		document.getElementById("options").appendChild(slider);
		this.sliders.push(slider);
	}

	createDropdown(options, value, onChange) {
		const dropdown = document.createElement('select');
		options.forEach(option => {
			const opt = document.createElement('option');
			opt.selected = option === value ? "selected" : '';
			opt.innerText = option;
			opt.value = option;
			dropdown.appendChild(opt);
		});
		dropdown.onchange = onChange;
		// dropdown.oninput = onChange;
		document.getElementById("options").appendChild(dropdown);
		this.dropdowns.push(dropdown);
	}

	cleanup() {
		this.sliders.forEach(document.getElementById("options").removeChild);
		this.dropdowns.forEach(document.getElementById("options").removeChild);
	}
}
