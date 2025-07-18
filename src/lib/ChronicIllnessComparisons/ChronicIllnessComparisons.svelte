<script lang="ts">
	import { onMount } from 'svelte';
	import DataChart from './DataChart/DataChart.svelte';

	import { csv } from 'd3-fetch';
	import type {
		ChronicIlnessComparisonsProps,
		CsvPrevalenceData,
		PrevalenceData
	} from './constants';

	let { src }: ChronicIlnessComparisonsProps = $props();

	let xProperty = $state('illness');
	let yProperty = $state<keyof PrevalenceData>('adultPrevalence');
	let data = $state<PrevalenceData[]>([]);

	onMount(async () => {
		data = await csv<PrevalenceData>(src, (row) => {
			const typedRow = row as CsvPrevalenceData;
			console.log('Hello', typedRow);
			return {
				...typedRow,
				adultPrevalence: Number(typedRow.adultPrevalence),
				relativeSearchInterest: Number(typedRow.relativeSearchInterest),
				isRareInAdults: typedRow.isRareInAdults === 'TRUE'
			};
		});
	});
</script>

<div>
	<label>
		Dependent y variable
		<select bind:value={yProperty}>
			<option value="adultPrevalence"> adult prevalence </option>
			<option value="relativeSearchInterest"> relative search interest</option>
		</select>
	</label>
</div>

<div style="height: 500px">
	<DataChart {data} xProperty="illness" {yProperty} />
</div>
