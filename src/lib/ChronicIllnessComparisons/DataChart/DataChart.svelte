<script lang="ts">
	import { scaleBand, scaleLinear, scaleLog, extent, schemeGreys, max } from 'd3';

	import type { DataChartProps } from './constants';
	import { margin, rarityThreshold } from './constants';
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
</script>

<div bind:clientWidth={chartWidth} bind:clientHeight={chartHeight} id="main">
	<svg width={chartWidth} height={chartHeight}>
		<defs>
			<linearGradient id='preventableGradient' x1="0" y1="0" x2="0" y2="1">
			<stop offset="0%" stop-color='#c1e096' />
			<stop offset="100%" stop-color='#089744' />
			</linearGradient>
			
			<linearGradient id='nonPreventableGradient' x1="0" y1="0" x2="0" y2="1">
			<stop offset="0%" stop-color='#faa445' />
			<stop offset="100%" stop-color='#ee1d7f' />
			</linearGradient>
		</defs>
		<g style="transform:translate({margin.left}px, {margin.top}px)">
			<g style="transform:translate(0, {innerChartHeight}px)">
				<line x1="0" y1="0" x2={innerChartWidth} y2="0"/> /**stroke="black" stroke-width="1px" */
				{#each xTicks as tick}
					<g
						style="transform: translate({(xScale(tick) ?? 0) +
							(xScale.bandwidth() / 2) - 5}px, 0) rotate(35deg) translate(0, 20px);"
					>
						<text text-anchor="start" font-family='Tahoma' font-size={xScale.bandwidth() / 4}>
							{tick}
						</text>
					</g>
				{/each}
			</g>
			<g>
				<line x1="0" y1="0" x2="0" y2={innerChartHeight} stroke="#cccccc" stroke-width="1px" />
				{#each yTicks as tick}
					<text x="-35px" y={yScale(tick)} font-family='Tahoma'>{tick}</text>
				{/each}
			</g>
			{#each data as row (row[xProperty])}
				{@const radius = 10}
				{@const maximum = Math.max(...data.map(row => +row[yProperty]))}
				<path
					d={`M ${xScale(String(row[xProperty])) ?? 0}, ${yScale(maximum) + (innerChartHeight - yScale(maximum))}
						v ${-(innerChartHeight - yScale(maximum)) + radius}
						a ${radius},${radius} 0 0 1 ${radius},${-radius}
						h ${(xScale.bandwidth()) - 2 * radius}
						a ${radius},${radius} 0 0 1 ${radius},${radius}
						v ${(innerChartHeight - yScale(maximum)) - radius}`}
					fill="#cccccc40"
					filter="drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.4))"
				/>
				{#if (innerChartHeight - yScale(+row[yProperty])) > 5}
				<path
					d={`M ${xScale(String(row[xProperty])) ?? 0}, ${yScale(+row[yProperty]) + (innerChartHeight - yScale(+row[yProperty]))}
						v ${-(innerChartHeight - yScale(+row[yProperty])) + radius}
						a ${radius},${radius} 0 0 1 ${radius},${-radius}
						h ${(xScale.bandwidth()) - 2 * radius}
						a ${radius},${radius} 0 0 1 ${radius},${radius}
						v ${(innerChartHeight - yScale(+row[yProperty])) - radius}`}
					fill={row.isPreventable ? 'url(#preventableGradient)' : 'url(#nonPreventableGradient)'}
				/>
				{:else}
				<rect
					x={xScale(String(row[xProperty])) ?? 0}
					y={yScale(+row[yProperty])}
					width={xScale.bandwidth()}
					height={innerChartHeight - yScale(+row[yProperty])}
					fill={row.isPreventable ? 'url(#preventableGradient)' : 'url(#nonPreventableGradient)'}
				/>
				{/if}
				{@const value = parseFloat((+row[yProperty]).toFixed(6))}
				<text
					x={(xScale(String(row[xProperty])) ?? 0) + xScale.bandwidth() / 2}
					y={yScale(+row[yProperty]) - 5}
					text-anchor="middle"
					font-weight="Bold"
					font-family="Arial"
					fill={row.isPreventable ? '#089744' : '#ee1d7f'}
					font-size={xScale.bandwidth() / 4.5}
				>
					{value}{row.adultPrevalence < rarityThreshold ? '*' : ''}
				</text>
			{/each}
			<text x={innerChartWidth} y={innerChartHeight + 135} text-anchor="end" font-family='Tahoma'>
				* denotes common illnesses
			</text>
			<text x={innerChartWidth} y={-30} text-anchor="end" font-family='Tahoma'> : non-preventable </text>
			<text x={innerChartWidth} y={-10} text-anchor="end" font-family='Tahoma'> : preventable </text>
			<rect x={innerChartWidth - 140} y={-42} width={25} height={16} fill={'url(#nonPreventableGradient)'} />
			<rect x={innerChartWidth - 110} y={-22} width={25} height={16} fill={'url(#preventableGradient)'} />
		</g>
	</svg>
</div>

<style>
	div {
		height: 100%;
	}

	#main {
		background-color: #f9f9f9;
		border-radius: 20px;
	}
</style>
