import type { RawCsv } from '$lib/constants';

export interface ChronicIlnessComparisonsProps {
	src: string;
}

export interface Student {
	name: string;
	age: number;
	height: number;
}

export type CsvStudent = RawCsv<Student>;
