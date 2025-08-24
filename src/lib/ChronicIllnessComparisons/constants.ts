import type { RawCsv } from '$lib/constants';

export type CompareMode = 'to each other' | 'to rare baseline';

export interface ChronicIlnessComparisonsProps {
	src: string;
	compareMode?: CompareMode;
}

export interface PrevalenceData {
	illness: string;
	adultPrevalence: number;
	isRareInAdults: boolean;
	adultPrevalenceSource: string;
	relativeSearchInterest: number;
	isPreventable: boolean;
}

export type CsvPrevalenceData = RawCsv<PrevalenceData>;

export const options = [
	{
		value: 'adultPrevalence',
		label: 'Prevalence'
	},
	{
		value: 'relativeSearchInterest',
		label: 'Search Interest'
	}
];
