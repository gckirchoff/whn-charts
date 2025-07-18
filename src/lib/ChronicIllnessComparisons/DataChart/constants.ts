import type { PrevalenceData } from '../constants';

export interface DataChartProps {
	data: PrevalenceData[];
	xProperty: keyof PrevalenceData;
	yProperty?: keyof PrevalenceData;
}

export const margin = {
	top: 50,
	bottom: 50,
	left: 50,
	right: 50
};
