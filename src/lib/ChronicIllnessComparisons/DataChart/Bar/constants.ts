import type { SVGAttributes } from 'svelte/elements';

export type BarProps = SVGAttributes<SVGPathElement> & {
	x: number;
	y: number;
	width: number;
	height: number;
	gradient?: boolean;
	animate?: boolean;
};

export const radius = 10;
export const fadeAmount = 55;
