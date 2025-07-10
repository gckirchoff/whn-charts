<script lang="ts">
	import { onMount } from 'svelte';
	import { scaleSqrt, scaleBand, scaleLinear } from 'd3-scale';
	import type {
		ChronicIlnessComparisonsProps,
		CsvPrevalenceData,
		PrevalenceData
	} from '../constants';

	const margin = {
		top: 50,
		bottom: 50,
		left: 50,
		right: 50
	};

	let chartWidth = $state(500);
	let chartHeight = $state(500);
	let innerChartWidth = $derived(chartWidth - margin.left - margin.right);
	let innerChartHeight = $derived(chartHeight - margin.top - margin.bottom);

	const colorPattern = {
		/// fill this when needed
	};
</script>

<!-- <div>
    <label>
        Independent x variable
        <select bind:value={xVariable}>
            <option value= (something) ></option>
            <option value= (something) ></option>
            etc...
        </select>
    </label>
    <label>
        Dependent y variable
        <select bind:value={yVariable}>
            <option value= (something) ></option>
            <option value= (something) ></option>
            etc...
        </select>
    </label>
</div> -->

<div bind:clientWidth={chartWidth}>
	<svg width={chartWidth} height={chartHeight}>
		<g style="transform:translate({margin.left}px, {margin.top}px)">
			<g style="transform:translate(0, {innerChartHeight}px)">
				<line x1="0" y1="0" x2={innerChartWidth} y2="0" stroke="black" stroke-width="4px" />
			</g>
			<g>
				<line x1="0" y1="0" x2="0" y2={innerChartHeight} stroke="black" stroke-width="4px" />
			</g>
		</g>
	</svg>
</div>

<style>
	svg {
		background-color: rgba(99, 24, 24, 0.622);
	}
</style>
