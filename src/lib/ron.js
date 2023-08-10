import { createNoise2D } from "simplex-noise";
const n2d = createNoise2D();

function value() {
	return Math.random();
}

export function noise1D(x, freq = 1, amp = 1) {
	return amp * n2d(x * freq, 0);
}

export function noise2D(x, y, freq = 1, amp = 1) {
	return amp * n2d(x * freq, y * freq);
}


export function rangeFloor(min, max) {
	if (max === undefined) {
		max = min;
		min = 0;
	}

	if (typeof min !== "number" || typeof max !== "number") {
		throw new TypeError("Expected all arguments to be numbers");
	}

	return Math.floor(range(min, max));

}

export function range(min = 0, max = 1) {
	if (max === undefined) {
		max = min;
		min = 0;
	}

	if (typeof min !== "number" || typeof max !== "number") {
		throw new TypeError("Expected all arguments to be numbers");
	}

	return Math.random() * (max - min) + min;
}
export function pick(array) {
	if (array.length === 0) return undefined;
	return array[rangeFloor(0, array.length)];
}

export function shuffle(arr) {
	if (!Array.isArray(arr)) {
		throw new TypeError("Expected Array, got " + typeof arr);
	}

	var rand;
	var tmp;
	var len = arr.length;
	var ret = arr.slice();
	while (len) {
		rand = Math.floor(value() * len--);
		tmp = ret[len];
		ret[len] = ret[rand];
		ret[rand] = tmp;
	}
	return ret;
}

