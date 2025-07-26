<script lang="ts">
	import { scaleBand, scaleLinear, scaleLog, extent } from 'd3';

	import type { DataChartProps } from './constants';
	import { margin, rarityThreshold } from './constants';
	import ChronicIllnessComparisons from '../ChronicIllnessComparisons.svelte';

	let { data, xProperty = 'illness', yProperty = 'adultPrevalence' }: DataChartProps = $props();

	let chartWidth = $state(500);
	let chartHeight = $state(500);
	let innerChartWidth = $derived(chartWidth - margin.left - margin.right);
	let innerChartHeight = $derived(chartHeight - margin.top - margin.bottom);

	let preventableColor = 'DarkGreen';
	let nonPreventableColor = 'DarkRed';

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
</script>

<div bind:clientWidth={chartWidth} bind:clientHeight={chartHeight}>
	<svg width={chartWidth} height={chartHeight}>
		<g style="transform:translate({margin.left}px, {margin.top}px)">
			<g style="transform:translate(0, {innerChartHeight}px)">
				<line x1="0" y1="0" x2={innerChartWidth} y2="0" stroke="black" stroke-width="1px" />
				{#each xTicks as tick}
					<g
						style="transform: translate({(xScale(tick) ?? 0) +
							xScale.bandwidth() / 2}px, 0) rotate(35deg) translate(0, 25px);"
					>
						<text text-anchor="start">
							{tick}
						</text>
					</g>
				{/each}
			</g>
			<g>
				<line x1="0" y1="0" x2="0" y2={innerChartHeight} stroke="black" stroke-width="1px" />
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
					fill={row.isPreventable ? preventableColor : nonPreventableColor}
				/>
				{@const value = parseFloat((+row[yProperty]).toFixed(6))}
				<text
					x={(xScale(String(row[xProperty])) ?? 0) + xScale.bandwidth() / 2}
					y={yScale(+row[yProperty]) - 5}
					text-anchor="middle"
					font-size="15"
					font-weight="Bold"
					font-family="Arial"
					fill={row.isPreventable ? preventableColor : nonPreventableColor}
				>
					{value}{row.adultPrevalence > rarityThreshold ? '*' : ''}
				</text>
			{/each}
			<text x={innerChartWidth} y={innerChartHeight + 135} text-anchor="end">
				* denotes common illnesses
			</text>
			<text x={innerChartWidth} y={0} text-anchor="end"> : non-preventable </text>
			<text x={innerChartWidth} y={20} text-anchor="end"> : preventable </text>
			<rect x={innerChartWidth - 140} y={-12} width={25} height={16} fill={nonPreventableColor} />
			<rect x={innerChartWidth - 110} y={8} width={25} height={16} fill={preventableColor} />
		</g>
	</svg>
</div>

<style>
	div {
		height: 100%;
	}
</style>
