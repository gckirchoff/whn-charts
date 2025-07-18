<script lang="ts">
	import { scaleBand, scaleLinear, scaleLog, extent, schemeSet1, scaleOrdinal } from 'd3';

	import type { DataChartProps } from './constants';
	import { margin } from './constants';

	let { data, xProperty = 'illness', yProperty = 'adultPrevalence' }: DataChartProps = $props();

	let chartWidth = $state(500);
	let chartHeight = $state(500);
	let innerChartWidth = $derived(chartWidth - margin.left - margin.right);
	let innerChartHeight = $derived(chartHeight - margin.top - margin.bottom);

	let xScale = $derived(
		scaleBand()
			.domain(data.map((row) => row[xProperty] as string))
			.range([0, innerChartWidth])
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

<div bind:clientWidth={chartWidth} bind:clientHeight={chartHeight}>
	<svg width={chartWidth} height={chartHeight}>
		<g style="transform:translate({margin.left}px, {margin.top}px)">
			<g style="transform:translate(0, {innerChartHeight}px)">
				<line x1="0" y1="0" x2={innerChartWidth} y2="0" stroke="black" stroke-width="4px" />
				{#each xTicks as tick}
					<text x={(xScale(tick) ?? 0) + xScale.bandwidth() / 2} y={20} text-anchor="middle">
						{tick}
					</text>
				{/each}
			</g>
			<g>
				<line x1="0" y1="0" x2="0" y2={innerChartHeight} stroke="black" stroke-width="4px" />
				{#each yTicks as tick}
					<text x="-35px" y={yScale(tick)}>{tick}</text>
				{/each}
			</g>
			{#each data as row (row[xProperty])}
				<rect
					x={(xScale(String(row[xProperty])) ?? 0) + 20}
					y = {yScale(+row[yProperty]) - 2}
					width = {xScale.bandwidth() - 40}
					height = {innerChartHeight - yScale(+row[yProperty])}
					fill = {colorPattern(String(row[xProperty]))}
				/>
				<text
					x = {(xScale(String(row[xProperty])) ?? 0) + xScale.bandwidth() / 2}
					y = {yScale(+row[yProperty]) - 5}
					text-anchor = "middle"
					font-size = "16"
					font-weight = "Bold"
					font-family = "Arial">
					{parseFloat((+row[yProperty]).toFixed(6))}
				</text>
			{/each}
		</g>
	</svg>
</div>

<style>
	svg {
		background-color: rgba(99, 24, 24, 0.622);
	}

	div {
		height: 100%;
	}
</style>
