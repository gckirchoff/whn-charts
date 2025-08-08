<script lang="ts">
	import { onMount } from 'svelte';
	import DataChart from './DataChart/DataChart.svelte';

	import { csv } from 'd3-fetch';
	import type {
		ChronicIlnessComparisonsProps,
		CsvPrevalenceData,
		PrevalenceData
	} from './constants';
	import { rarityThreshold } from './DataChart/constants';

	let { src }: ChronicIlnessComparisonsProps = $props();

	let xProperty = $state<keyof PrevalenceData>('illness');
	let yProperty = $state<keyof PrevalenceData>('adultPrevalence');
	let data = $state<PrevalenceData[]>([]);

	let ratioed = $state(false);
	const isRare = (prevalence: number) => prevalence < rarityThreshold;


	let ratioData = $derived(() => {
		if (!ratioed) return data;
		return data.map((row) => {
			let prev = row.adultPrevalence;
			let search = row.relativeSearchInterest;

			if (yProperty === 'adultPrevalence') {
				return {
					...row,
					adultPrevalence: ((prev * 100) / search).toFixed(4),
				};
			} else {
				return {
					...row,
					relativeSearchInterest: (search / (prev * 100)).toFixed(4),
				};
			}
		});
	});

	onMount(async () => {
		const csvData = await csv<PrevalenceData>(src, (row) => {
			const typedRow = row as CsvPrevalenceData;
			console.log('Hello', typedRow);
			return {
				...typedRow,
				adultPrevalence: Number(typedRow.adultPrevalence),
				relativeSearchInterest: Number(typedRow.relativeSearchInterest),
				isRareInAdults: typedRow.isRareInAdults === 'TRUE',
				isPreventable: typedRow.isPreventable === 'TRUE',
			};
		});
		data = csvData
			.filter(({ adultPrevalence }) => !isRare(adultPrevalence))
			.map((row) => ({ ...row, adultPrevalence: row.adultPrevalence * 100 }))
			.sort((a, b) => (a.adultPrevalence > b.adultPrevalence ? 1 : -1));
	});
</script>

<div id="menu">
	<div>
		<label>
			Dependent y variable:
			<select bind:value={yProperty}>
				<option value="adultPrevalence"> adult prevalence </option>
				<option value="relativeSearchInterest"> relative search interest</option>
			</select>
		</label>
	</div>

	<div>
		{#if yProperty === 'adultPrevalence'}
			<label for="prev/search">View as Prevelance : Search Ratio?</label>
			<input type="checkbox" id="prev/search" name="prev/search" value="p/s" bind:checked={ratioed}>
		{:else if yProperty === 'relativeSearchInterest'}
			<label for="search/prev">View as Search : Prevelance Ratio?</label>
			<input type="checkbox" id="search/prev" name="search/prev" value="s/p" bind:checked={ratioed}>
		{/if}
	</div>
</div>
	
<div style="height: 700px">
	<DataChart data={ratioData()} {xProperty} yProperty={yProperty} />
</div>

<style>
	#menu {
		display: flex;
		justify-content: space-between;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	}
</style>