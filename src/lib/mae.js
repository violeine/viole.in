export function lerp(min, max, t) {
	return min * (1 - t) + max * t;
}

export const range = (n) => new Array(n).fill(0).map((_, i) => i);


