<script lang="ts">
	import { onMount } from 'svelte';
	import DataChart from './DataChart/DataChart.svelte';

	import { csv } from 'd3-fetch';
	import {
		adultLcPrevalenceSourceOptions,
		options,
		type ChronicIlnessComparisonsProps,
		type CsvPrevalenceData,
		type PrevalenceData
	} from './constants';
	import { isRare } from './logic';

	let { src, compareMode = 'to each other' }: ChronicIlnessComparisonsProps = $props();

	let hasMounted = $state(false);
	let xProperty = $state<keyof PrevalenceData>('illness');
	let yProperty = $state<keyof PrevalenceData>('adultPrevalence');
	let ratioYProperty = $state<keyof PrevalenceData>('relativeSearchInterest');
	let data = $state<PrevalenceData[]>([]);
	let allData = $derived(Array.from(new Set(data.map((d) => d.illness))));

	let ratioed = $state(false);

	let showRare = $derived(compareMode === 'to rare baseline');

	let ratio1 = $derived(options.find((o) => o.value === yProperty)?.label);
	let ratio2 = $derived(options.find((o) => o.value === ratioYProperty)?.label);

	onMount(async () => {
		const csvData = await csv<PrevalenceData>(src, (row) => {
			const typedRow = row as CsvPrevalenceData;
			return {
				...typedRow,
				adultPrevalence: Number(typedRow.adultPrevalence),
				relativeSearchInterest: Number(typedRow.relativeSearchInterest),
				funding: Number(typedRow.funding) / 1000000,
				isRareInAdults: typedRow.isRareInAdults === 'TRUE',
				isPreventable: typedRow.isPreventable === 'TRUE',
				ratioValue: null
			};
		});
		data = csvData;
		hasMounted = true;
	});

	const handleYPropertyChange = (
		event: Event & {
			currentTarget: EventTarget & HTMLSelectElement;
		}
	) => {
		const selectedValue = event.currentTarget.value as keyof PrevalenceData;
		const shouldFlipValues = selectedValue === ratioYProperty;
		if (shouldFlipValues) {
			ratioYProperty = yProperty;
		}
		yProperty = selectedValue;
	};

	const handleRatioYPropertyChange = (
		event: Event & {
			currentTarget: EventTarget & HTMLSelectElement;
		}
	) => {
		const selectedValue = event.currentTarget.value as keyof PrevalenceData;
		const shouldFlipValues = selectedValue === yProperty;
		if (shouldFlipValues) {
			yProperty = ratioYProperty;
		}
		ratioYProperty = selectedValue;
	};

	let longCovidPrevalenceSource = $state(1);

	let selectedLcOption = $derived(
		adultLcPrevalenceSourceOptions.find(({ value }) => longCovidPrevalenceSource === value)!
	);

	let processedData = $derived.by(() => {
		const adjustedData = data
			.filter(({ adultPrevalence, illness }) =>
				showRare ? true : !isRare(adultPrevalence) && illness !== 'Color Blindness'
			)
			.map((row) => {
				const isLongCovidRow = row.illness === 'Long COVID';
				const adultPrevalence = isLongCovidRow
					? selectedLcOption.adultPrevalence
					: row.adultPrevalence;
				const adultPrevalenceSource = isLongCovidRow
					? selectedLcOption.href
					: row.adultPrevalenceSource;
				return { ...row, adultPrevalence, adultPrevalenceSource, ratioValue: null };
			});
		if (!ratioed || ratioYProperty === null) {
			return adjustedData;
		}

		return adjustedData.map((row) => ({
			...row,
			ratioValue: Number(row[yProperty]) / Number(row[ratioYProperty])
		}));
	});
</script>

<div class="menu">
	<div class="control-section">
		<h3>Long COVID Prevalence (<a href={selectedLcOption.href} target="_blank">src</a>)</h3>
		<select bind:value={longCovidPrevalenceSource}>
			{#each adultLcPrevalenceSourceOptions as { value, label }}
				<option {value}>{label}</option>
			{/each}
		</select>
	</div>

	{#if compareMode === 'to each other'}
		<div class="control-section">
			<h3>Metric</h3>
			<select value={yProperty} onchange={handleYPropertyChange}>
				{#each options as option}
					<option value={option.value}>{option.label}</option>
				{/each}
			</select>
		</div>

		<div class="control-section">
			<h3>Display</h3>
			<div class="ratio-wrapper">
				<label class="toggle">
					<input type="checkbox" bind:checked={ratioed} />
					View as ratio
					<span class="of-text" class:visible={ratioed}> of</span>
				</label>
				<select
					value={ratioYProperty}
					onchange={handleRatioYPropertyChange}
					class:visible={ratioed}
				>
					{#each options as option}
						<option value={option.value}>{option.label}</option>
					{/each}
				</select>
			</div>
		</div>
	{/if}
</div>

{#if hasMounted}
	<div style="height: 700px">
		<DataChart
			data={processedData}
			{xProperty}
			{yProperty}
			{showRare}
			{allData}
			{compareMode}
			{ratioed}
			{ratioYProperty}
		/>
	</div>
{/if}

<style>
	.menu {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		column-gap: 2rem;
		border-radius: 12px;
		font-family: Tahoma, Geneva, Verdana, sans-serif;
		margin-bottom: 1rem;
	}

	.control-section h3 {
		font-size: 0.9rem;
		font-weight: 600;
		margin-bottom: 0.5rem;
	}

	.control-section > select {
		width: 100%;
		min-width: 120px;
		max-width: 100%;
	}

	.ratio-wrapper {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 0.4rem;
		min-height: 2rem;
	}

	.of-text,
	.ratio-wrapper select {
		visibility: hidden;
	}

	.visible,
	select.visible {
		visibility: visible;
	}

	label {
		user-select: none;
		cursor: pointer;
	}

	select {
		padding: 0.4rem 0.6rem;
		border-radius: 6px;
		border: 1px solid #ccc;
		font-size: 0.9rem;
		min-width: 0;
	}

	select,
	input {
		cursor: pointer;
	}
</style>
