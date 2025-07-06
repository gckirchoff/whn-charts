<script lang="ts">
	import { onMount } from 'svelte';

	import { csv } from 'd3-fetch';
	import { scaleLinear } from 'd3-scale';
	import type {
		ChronicIlnessComparisonsProps,
		CsvPrevalenceData,
		PrevalenceData
	} from './constants';

	let { src }: ChronicIlnessComparisonsProps = $props();

	let data = $state<PrevalenceData[]>([]);

	onMount(async () => {
		data = await csv<PrevalenceData>(src, (row) => {
			const typedRow = row as CsvPrevalenceData;
			console.log('Hello', typedRow);
			return {
				...typedRow,
				adultPrevalence: Number(typedRow.adultPrevalence),
				isRareInAdults: typedRow.isRareInAdults === 'TRUE'
			};
		});
	});

	// $inspect(data);
</script>

<div>
	<ul>
		{#each data as illness}
			<li>
				the prevalence for {illness.illness} is {illness.adultPrevalence}% and is {illness.isRareInAdults
					? ''
					: 'not'} rare
			</li>
		{/each}
	</ul>
</div>
