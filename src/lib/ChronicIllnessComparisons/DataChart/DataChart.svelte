<script lang="ts">
	import {
		schemeCategory10,
		schemeObservable10,
		scaleOrdinal,
		scaleBand,
		scaleLinear,
		scaleLog,
		extent,
		schemeGreys,
		max,
		randomWeibull
	} from 'd3';

	import type { DataChartProps } from './constants';
	import { margin, rarityThreshold, fadeAmount } from './constants';
	import ChronicIllnessComparisons from '../ChronicIllnessComparisons.svelte';
	import { fade } from 'svelte/transition';
	import { LightenDarkenColor } from './logic';

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
	// let yScaleLog = $derived(
	// 	scaleLog()
	// 		.domain(extent(data, (row) => +row[yProperty]) as [number, number])
	// 		.range([innerChartHeight, 0])
	// );
	let colorScale = $derived(
		scaleOrdinal<string, string>()
			.domain([...new Set(data.map(({ illness }) => illness))])
			.range(schemeCategory10)
	);
	let xTicks = $derived(xScale.domain());
	let yTicks = $derived(yScale.ticks());
</script>

<div bind:clientWidth={chartWidth} bind:clientHeight={chartHeight} id="main">
	<svg width={chartWidth} height={chartHeight}>
		<g style="transform:translate({margin.left}px, {margin.top}px)">
			<g style="transform:translate(0, {innerChartHeight}px)">
				<line x1="0" y1="0" x2={innerChartWidth} y2="0" /> /**stroke="black" stroke-width="1px" */
				{#each xTicks as tick}
					<g
						style="transform: translate({(xScale(tick) ?? 0) +
							xScale.bandwidth() / 2 -
							5}px, 0) rotate(35deg) translate(0, 20px);"
					>
						<text text-anchor="start" font-family="Tahoma" font-size={xScale.bandwidth() / 4}>
							{tick}
						</text>
					</g>
				{/each}
			</g>
			<g>
				{#each yTicks as tick}
					<text x="-35px" y={yScale(tick)} font-family="Tahoma">{tick}</text>
				{/each}
			</g>
			{#each data as row, i (row[xProperty])}
				{@const radius = 10}
				{@const maximum = Math.max(...data.map(row => +row[yProperty]))}
				<defs>
					<linearGradient id="gradient-{i}" x1="0%" y1="0%" x2="0%" y2="100%">
					<stop offset="0%" stop-color={colorScale(row.illness)}/>
					<stop offset="100%" stop-color={LightenDarkenColor(colorScale(row.illness), fadeAmount)} />
					</linearGradient>
				</defs>
				<path
					d={`M ${xScale(String(row[xProperty])) ?? 0}, ${yScale(maximum) + (innerChartHeight - yScale(maximum))}
						v ${-(innerChartHeight - yScale(maximum)) + radius}
						a ${radius},${radius} 0 0 1 ${radius},${-radius}
						h ${xScale.bandwidth() - 2 * radius}
						a ${radius},${radius} 0 0 1 ${radius},${radius}
						v ${innerChartHeight - yScale(maximum) - radius}`}
					fill="#cccccc40"
					filter="drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.4))"
				/>
				{#if innerChartHeight - yScale(+row[yProperty]) > 5}
					<path
						d={`M ${xScale(String(row[xProperty])) ?? 0}, ${yScale(+row[yProperty]) + (innerChartHeight - yScale(+row[yProperty]))}
						v ${-(innerChartHeight - yScale(+row[yProperty])) + radius}
						a ${radius},${radius} 0 0 1 ${radius},${-radius}
						h ${xScale.bandwidth() - 2 * radius}
						a ${radius},${radius} 0 0 1 ${radius},${radius}
						v ${innerChartHeight - yScale(+row[yProperty]) - radius}`}
						fill='url(#gradient-{i})'
					/>
				{:else}
					<rect
						x={xScale(String(row[xProperty])) ?? 0}
						y={yScale(+row[yProperty])}
						width={xScale.bandwidth()}
						height={innerChartHeight - yScale(+row[yProperty])}
						fill='url(#gradient-{i})'
					/>
				{/if}
				{@const value = parseFloat((+row[yProperty]).toFixed(6))}
				{#key value}
					<text
						in:fade={{ delay: 300 }}
						x={(xScale(String(row[xProperty])) ?? 0) + xScale.bandwidth() / 2}
						y={yScale(+row[yProperty]) - 5}
						text-anchor="middle"
						font-weight="Bold"
						font-family="Arial"
						fill="black"
						font-size={xScale.bandwidth() / 4.5}
					>
						{value}{row.adultPrevalence < rarityThreshold ? '*' : ''}
					</text>
				{/key}
			{/each}
			<!-- <text x={innerChartWidth} y={innerChartHeight + 135} text-anchor="end" font-family='Tahoma'>
				* denotes common illnesses
			</text> -->
			<!-- <text x={innerChartWidth} y={-30} text-anchor="end" font-family='Tahoma'> : non-preventable </text>
			<text x={innerChartWidth} y={-10} text-anchor="end" font-family='Tahoma'> : preventable </text>
			<rect x={innerChartWidth - 152} y={-42} width={25} height={16} fill={'url(#nonPreventableGradient)'} />
			<rect x={innerChartWidth - 120} y={-22} width={25} height={16} fill={'url(#preventableGradient)'} /> -->
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

	path {
		transition: all 500ms ease;
	}
</style>
