import { format } from 'd3';
import { rarityThreshold } from './DataChart/constants';

export const isRare = (prevalence: number) => prevalence < rarityThreshold;

export const roundTo = (num: number, precision: number) => {
	const factor = Math.pow(10, precision);
	return Math.round(num * factor) / factor;
};

export const formatNumber = (num: number) => {
	const formattedNum = num > 1 ? format('.2s')(num).replace('G', 'B') : String(roundTo(num, 5));
	if (formattedNum === '0') {
		return `~0`;
	}
	return formattedNum;
};
