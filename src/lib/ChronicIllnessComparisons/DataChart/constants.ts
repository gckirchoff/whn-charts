import type { PrevalenceData } from '../constants';

export interface DataChartProps {
	data: PrevalenceData[];
	xProperty: keyof PrevalenceData;
	yProperty?: keyof PrevalenceData;
}

export const margin = {
	top: 50,
	bottom: 200,
	left: 50,
	right: 50
};

const rareIllnessUpperPopulationLimit = 200000;
const americaPopulation = 340110988;
export const rarityThreshold = rareIllnessUpperPopulationLimit / americaPopulation;

// this number can be negative to get darker or positive to fade lighter
export const fadeAmount = 55
