export type RawCsv<T> = {
	[K in keyof T]: string;
};

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

export const adultLcPrevalenceSourceOptions = [
	{
		label: '5% (Al Ali et al)',
		href: 'www.nih.gov/study/123543345',
		value: 1,
		adultPrevalence: 0.05
	},
	{
		label: '15% (Statistics Canada)',
		href: 'www.statcan.ca/article/12345',
		value: 2,
		adultPrevalence: 0.15
	}
];
