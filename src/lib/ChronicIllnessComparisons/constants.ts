import type { RawCsv } from '$lib/constants';

export type Mode = 'compare to each other' | 'compare to rare baseline';

export interface ChronicIlnessComparisonsProps {
	src: string;
	mode?: Mode;
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
