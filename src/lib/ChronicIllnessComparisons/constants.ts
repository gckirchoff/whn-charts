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
		label: '14% (YaleMedicine), 2024',
		href: 'https://www.yalemedicine.org/news/long-covid-keeps-people-out-of-work-and-hurts-the-economy',
		value: 1,
		adultPrevalence: 0.14
	},
	{
		label: '8% Cidrap UMN, 2024',
		href: 'https://www.cidrap.umn.edu/covid-19/about-8-us-adults-have-ever-had-long-covid-survey-finds',
		value: 2,
		adultPrevalence: 0.08
	},
	{
		label: '14% (Plos One), 2023',
		href: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10621843',
		value: 3,
		adultPrevalence: 0.14
	},
	{
		label: '7% (CDC), 2025',
		href: 'https://www.cdc.gov/long-covid/php/scientific-approach/index.html',
		value: 4,
		adultPrevalence: 0.07
	}
];
