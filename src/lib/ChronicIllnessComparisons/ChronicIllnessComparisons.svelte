<script lang="ts">
	import { onMount } from 'svelte';
	import DataChart from './DataChart/DataChart.svelte';

	import { csv } from 'd3-fetch';
	import {
		options,
		type ChronicIlnessComparisonsProps,
		type CsvPrevalenceData,
		type PrevalenceData
	} from './constants';
	import { isRare } from './logic';

	let { src }: ChronicIlnessComparisonsProps = $props();

	let xProperty = $state<keyof PrevalenceData>('illness');
	let yProperty = $state<keyof PrevalenceData>('adultPrevalence');
	let ratioYProperty = $state<keyof PrevalenceData>('relativeSearchInterest');
	let data = $state<PrevalenceData[]>([]);

	let ratioed = $state(false);
	let showRare = $state(false);

	onMount(async () => {
		const csvData = await csv<PrevalenceData>(src, (row) => {
			const typedRow = row as CsvPrevalenceData;
			return {
				...typedRow,
				adultPrevalence: Number(typedRow.adultPrevalence),
				relativeSearchInterest: Number(typedRow.relativeSearchInterest),
				isRareInAdults: typedRow.isRareInAdults === 'TRUE',
				isPreventable: typedRow.isPreventable === 'TRUE'
			};
		});
		data = csvData.sort((a, b) => (a.adultPrevalence > b.adultPrevalence ? 1 : -1));
	});

	const handleYPropertyChange = (
		event: Event & {
			currentTarget: EventTarget & HTMLSelectElement;
		}
	) => {
		const selectedValue = event.currentTarget.value;
		if (selectedValue === ratioYProperty) {
			const ratioYPropertyIndex = options.findIndex(({ value }) => value === ratioYProperty);
			const nextIndex = (ratioYPropertyIndex + 1) % options.length;
			ratioYProperty = options[nextIndex].value as keyof PrevalenceData;
		}
	};

	let processedData = $derived.by(() => {
		if (!ratioed || ratioYProperty === null) {
			return data.filter(({ adultPrevalence }) => (showRare ? true : !isRare(adultPrevalence)));
		}

		const adjustedData = data
			.filter(({ adultPrevalence }) => (showRare ? true : !isRare(adultPrevalence)))
			.map((row) => ({ ...row, adultPrevalence: row.adultPrevalence * 100 }));

		if (!ratioed || ratioYProperty === null) {
			return adjustedData;
		}

		return adjustedData.map((row) => ({
			...row,
			[yProperty]: Number(row[yProperty]) / Number(row[ratioYProperty])
		}));
	});
</script>

<div class="menu">
	<div class="inputs">
		<label>
			<select bind:value={yProperty} onchange={handleYPropertyChange}>
				{#each options as option}
					<option value={option.value}>{option.label}</option>
				{/each}
			</select>
		</label>
		<input type="checkbox" bind:checked={ratioed} />
		<p>as ratio{ratioed ? ' of' : ''}</p>
		{#if ratioed}
			<select bind:value={ratioYProperty}>
				{#each options as option}
					<option value={option.value}>{option.label}</option>
				{/each}
			</select>
		{/if}
	</div>
	<div class="inputs">
		<label>
			Show rare diseases:
			<input type="checkbox" bind:checked={showRare} />
		</label>
	</div>
</div>

<div style="height: 700px">
	<DataChart data={processedData} {xProperty} {yProperty} />
</div>

<style>
	.menu {
		display: flex;
		justify-content: space-between;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	}

	.inputs {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		align-items: center;
	}
</style>
