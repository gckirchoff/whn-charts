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
	let allData = $derived(Array.from(new Set(data.map((d) => d.illness))));

	let ratioed = $state(false);
	let showRare = $state(false);

	let ratio1 = $derived(options.find((o) => o.value === yProperty)?.label);
	let ratio2 = $derived(options.find((o) => o.value === ratioYProperty)?.label);

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
	</div>
	<div class="inputs">
		<div class="checkbox-wrapper-6">
			<input class="tgl tgl-light" id="cb1-7" type="checkbox" bind:checked={ratioed} />
			<label class="tgl-btn" for="cb1-7"></label>
		</div>
		<p>view as {ratioed ? 'ratio of ' + ratio1 + ' /' : ratio1 + ' / ' + ratio2 + ' ratio'}</p>
		{#if ratioed}
			<select bind:value={ratioYProperty}>
				{#each options as option}
					<option value={option.value} disabled={option.value === yProperty}>{option.label}</option>
				{/each}
			</select>
		{/if}
	</div>
	<div class="inputs" id="rare">
		<p>Show rare diseases:</p>
		<div class="checkbox-wrapper-6">
			<input class="tgl tgl-light" id="cb1-6" type="checkbox" bind:checked={showRare} />
			<label class="tgl-btn" for="cb1-6"></label>
		</div>
	</div>
</div>

<div style="height: 700px">
	<DataChart data={processedData} {xProperty} {yProperty} {showRare} {allData} />
</div>

<style>
	.menu {
		display: flex;
		justify-content: space-between;
		font-family: Tahoma, Geneva, Verdana, sans-serif;
		padding: 10px;
		background-color: #f9f9f9;
		border-top-left-radius: 20px;
		border-top-right-radius: 20px;
		justify-content: space-around;
	}

	.inputs {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		align-items: center;
		font-family: Tahoma, Geneva, Verdana, sans-serif;
	}

	select {
		font-size: 12pt;
		font-family: Tahoma, Geneva, Verdana, sans-serif;
		cursor: pointer;
	}

	#rare {
		justify-content: center;
		flex-direction: column;
		gap: 0px;
	}

	.checkbox-wrapper-6 .tgl {
		display: none;
	}
	.checkbox-wrapper-6 .tgl,
	.checkbox-wrapper-6 .tgl:after,
	.checkbox-wrapper-6 .tgl:before,
	.checkbox-wrapper-6 .tgl + .tgl-btn {
		box-sizing: border-box;
	}
	.checkbox-wrapper-6 .tgl::-moz-selection,
	.checkbox-wrapper-6 .tgl:after::-moz-selection,
	.checkbox-wrapper-6 .tgl:before::-moz-selection,
	.checkbox-wrapper-6 .tgl + .tgl-btn::-moz-selection,
	.checkbox-wrapper-6 .tgl::selection,
	.checkbox-wrapper-6 .tgl:after::selection,
	.checkbox-wrapper-6 .tgl:before::selection,
	.checkbox-wrapper-6 .tgl + .tgl-btn::selection {
		background: none;
	}
	.checkbox-wrapper-6 .tgl + .tgl-btn {
		outline: 0;
		display: block;
		width: 2em;
		height: 1em;
		position: relative;
		cursor: pointer;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}
	.checkbox-wrapper-6 .tgl + .tgl-btn:after,
	.checkbox-wrapper-6 .tgl + .tgl-btn:before {
		position: relative;
		display: block;
		content: '';
		width: 50%;
		height: 100%;
	}
	.checkbox-wrapper-6 .tgl + .tgl-btn:after {
		left: 0;
	}
	.checkbox-wrapper-6 .tgl + .tgl-btn:before {
		display: none;
	}
	.checkbox-wrapper-6 .tgl:checked + .tgl-btn:after {
		left: 50%;
	}

	.checkbox-wrapper-6 .tgl-light + .tgl-btn {
		background: #d8292a;
		border-radius: 2em;
		padding: 2px;
		transition: all 0.4s ease;
	}
	.checkbox-wrapper-6 .tgl-light + .tgl-btn:after {
		border-radius: 50%;
		background: #fff;
		transition: all 0.2s ease;
	}
	.checkbox-wrapper-6 .tgl-light:checked + .tgl-btn {
		background: #2da12d;
	}
</style>
