<script lang="ts">
	import { scaleBand, scaleLinear, scaleLog, extent, schemeSet1, scaleOrdinal } from 'd3';

	import type { DataChartProps } from './constants';
	import { margin } from './constants';
	import ChronicIllnessComparisons from '../ChronicIllnessComparisons.svelte';

	let { data, xProperty = 'illness', yProperty = 'adultPrevalence' }: DataChartProps = $props();

	let chartWidth = $state(500);
	let chartHeight = $state(500);
	let innerChartWidth = $derived(chartWidth - margin.left - margin.right);
	let innerChartHeight = $derived(chartHeight - margin.top - margin.bottom);

	let xScale = $derived(
		scaleBand()
			.domain(data.map((row) => row[xProperty] as string))
			.range([0, innerChartWidth])
			.padding(0.15)
	);
	let yScale = $derived(
		scaleLinear()
			.domain(extent(data, (row) => +row[yProperty]) as [number, number])
			.range([innerChartHeight, 0])
	);
	let yScaleLog = $derived(
		scaleLog()
			.domain(extent(data, (row) => +row[yProperty]) as [number, number])
			.range([innerChartHeight, 0])
	);

	let xTicks = $derived(xScale.domain());
	let yTicks = $derived(yScale.ticks());

	const colorPattern = scaleOrdinal(schemeSet1);
</script>

<div bind:clientWidth={chartWidth} bind:clientHeight={chartHeight}>
	<svg width={chartWidth} height={chartHeight}>
		<g style="transform:translate({margin.left}px, {margin.top}px)">
			<g style="transform:translate(0, {innerChartHeight}px)">
				<line x1="0" y1="0" x2={innerChartWidth} y2="0" stroke="black" stroke-width="5px" />
				{#each xTicks as tick}
					<text x={(xScale(tick) ?? 0) + xScale.bandwidth() / 2} y={20} text-anchor="middle">
						{tick}
					</text>
				{/each}
			</g>
			<g>
				<line x1="0" y1="0" x2="0" y2={innerChartHeight} stroke="black" stroke-width="5px" />
				{#each yTicks as tick}
					<text x="-35px" y={yScale(tick)}>{tick}</text>
				{/each}
			</g>
			{#each data as row (row[xProperty])}
				<rect
					x={xScale(String(row[xProperty])) ?? 0}
					y={yScale(+row[yProperty])}
					width={xScale.bandwidth()}
					height={innerChartHeight - yScale(+row[yProperty])}
					fill={colorPattern(String(row[xProperty]))}
				/>
				{@const value = parseFloat((+row[yProperty]).toFixed(6))}
				<text
					x={(xScale(String(row[xProperty])) ?? 0) + xScale.bandwidth() / 2}
					y={yScale(+row[yProperty]) - 5}
					text-anchor="middle"
					font-size="16"
					font-weight="Bold"
					font-family="Arial"
				>
					{value}{value > 0.006 ? '*' : ''}
				</text>
			{/each}
			<text x={innerChartWidth} y={innerChartHeight + 40} text-anchor="end">
				* denotes common illnesses
			</text>
		</g>
	</svg>
</div>

<style>
	div {
		height: 100%;
	}
</style>
