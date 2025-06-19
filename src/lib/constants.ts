export type RawCsv<T> = {
	[K in keyof T]: string;
};
