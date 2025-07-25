import type { RawCsv } from '$lib/constants';

export interface ChronicIlnessComparisonsProps {
	src: string;
}

export interface PrevalenceData {
	illness: string;
	adultPrevalence: number;
	isRareInAdults: boolean;
	adultPrevalenceSource: string;
	relativeSearchInterest: number;
}

export type CsvPrevalenceData = RawCsv<PrevalenceData>;
