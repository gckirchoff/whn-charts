<script lang="ts">
	import { fade } from 'svelte/transition';
	import { schemeCategory10, scaleOrdinal, scaleBand, scaleLinear, scaleLog, extent } from 'd3';

	import type { PrevalenceData } from '../constants';
	import type { DataChartProps } from './constants';
	import { margin, rarityThreshold, yLabelMap } from './constants';
	import Bar from './Bar/Bar.svelte';
	import Tooltip, { HoveredData } from './Tooltip';
	import { clamp, formatNumber } from '../logic';

	let {
		data,
		xProperty = 'illness',
		yProperty = 'adultPrevalence',
		showRare,
		allData,
		compareMode,
		ratioed,
		ratioYProperty
	}: DataChartProps = $props();

	let chartWidth = $state(500);
	let chartHeight = $state(500);
	let innerChartWidth = $derived(chartWidth - margin.left - margin.right);
	let innerChartHeight = $derived(chartHeight - margin.top - margin.bottom);

	let usedData = $derived(
		compareMode === 'to each other'
			? data
			: data.map((d) => ({ ...d, adultPrevalence: d.adultPrevalence / rarityThreshold }))
	);

	let hoveredData = new HoveredData();

	let xScale = $derived(
		scaleBand()
			.domain(
				data
					.sort((a, b) => (a.adultPrevalence > b.adultPrevalence ? 1 : -1))
					.map((row) => row[xProperty] as string)
			)
			.range([0, innerChartWidth])
			.padding(0.15)
	);

	let yScale = $derived.by(() => {
		const scale = compareMode === 'to each other' ? scaleLinear : scaleLog;
		const domain =
			compareMode === 'to each other'
				? (extent(usedData, (row) => +row[yProperty]) as [number, number])
				: ([0.075, 1000] as [number, number]);

		return scale().domain(domain).range([innerChartHeight, 0]);
	});

	let colorScale = $derived(scaleOrdinal<string, string>().domain(allData).range(schemeCategory10));

	let xTicks = $derived(xScale.domain());
	let yTicks = $derived(compareMode === 'to each other' ? yScale.ticks() : [0.1, 1, 10, 100]);

	let y0 = $derived(compareMode === 'to each other' ? innerChartHeight : yScale(1));

	let yLabel = $derived.by(() => {
		if (compareMode === 'to rare baseline') {
			return 'Prevalence Compared to Rare Baseline';
		}
		if (ratioed) {
			return `${yLabelMap[yProperty]} / ${yLabelMap[ratioYProperty]}`;
		}
		return yLabelMap[yProperty];
	});
</script>

<div
	class="main"
	onmouseleave={hoveredData.unset}
	bind:clientWidth={chartWidth}
	bind:clientHeight={chartHeight}
	role="application"
>
	<svg width={chartWidth} height={chartHeight}>
		<g style="transform: translate({margin.left}px, {margin.top}px)">
			<!-- AxisX -->
			<g style="transform: translate(0, {innerChartHeight}px)">
				<line x1="0" y1="0" x2={innerChartWidth} y2="0" />
				{#each xTicks as tick (tick)}
					<g
						style="transform: translate({(xScale(tick) ?? 0) +
							xScale.bandwidth() / 2 -
							5}px, 0) rotate(35deg) translate(0, 20px); transition: all 500ms ease;"
					>
						<text
							text-anchor="start"
							font-size={clamp(xScale.bandwidth() / 4, 11, 18)}
							onmouseenter={() =>
								hoveredData.set(usedData.find((d) => d.illness === tick) as PrevalenceData)}
							role="application"
						>
							{tick}
						</text>
					</g>
				{/each}
			</g>
			<!-- AxisY -->
			<text
				class="label"
				style="transform: translate(-65px, {innerChartHeight / 2}px) rotate(-90deg)"
				text-anchor="middle"
				fill="black">{yLabel}</text
			>
			<g>
				{#each yTicks as tick}
					<text x="-10px" y={yScale(tick)} class="tick" text-anchor="end">
						{tick}{compareMode === 'to each other' ? '' : 'x'}
					</text>
				{/each}
			</g>
			<!-- chart -->
			{#each usedData as row, i (row.illness)}
				<Bar
					x={xScale(String(row[xProperty])) ?? 0}
					y={innerChartHeight}
					width={xScale.bandwidth()}
					height={innerChartHeight}
					fill="#cccccc40"
					filter="drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.4))"
				/>
			{/each}

			{#each usedData as row, i (row.illness)}
				{@const y = yScale(+row[yProperty])}
				{@const value =
					yProperty === 'adultPrevalence' && ratioYProperty === 'funding'
						? `${formatNumber(+row[yProperty])}`
						: `${formatNumber(+row[yProperty])}${compareMode === 'to each other' ? '' : 'x'}`}
				<Bar
					x={xScale(String(row[xProperty])) ?? 0}
					y={y0}
					height={compareMode === 'to each other' ? innerChartHeight - y : yScale(1) - y}
					width={xScale.bandwidth()}
					fill={colorScale(row.illness)}
					onmouseenter={() => hoveredData.set(row)}
					gradient={true}
					animate={true}
				/>
				{#key `${showRare}-${value}`}
					<text
						in:fade={{ delay: 300 }}
						x={(xScale(String(row[xProperty])) ?? 0) + xScale.bandwidth() / 2}
						y={y + (y <= y0 ? -10 : 13)}
						text-anchor="middle"
						dominant-baseline="middle"
						font-family="Arial"
						fill="black"
						font-size={clamp(xScale.bandwidth() / 4.5, 8, 18)}
					>
						{value}
					</text>
				{/key}
			{/each}
			{#if compareMode === 'to rare baseline'}
				<text
					x={(xScale('Post Polio Syndrome') ?? 0) + xScale.bandwidth() * 0.5}
					y={yScale(1) - 10}
					font-size={xScale.bandwidth() / 4}
					text-anchor="middle"
					fill="red">Rare Disease Threshold</text
				>
				<line
					x1={0}
					y1={yScale(1)}
					x2={innerChartWidth}
					y2={yScale(1)}
					stroke="red"
					stroke-width={2}
				/>
			{/if}
		</g>
	</svg>
	{#if hoveredData.current}
		<Tooltip
			data={hoveredData.current}
			xAccessorScaled={(d) => xScale(d.illness) ?? 0}
			yAccessorScaled={(d) => yScale(+d[yProperty]) ?? 0}
			width={innerChartWidth}
			{yProperty}
		/>
	{/if}
</div>

<style>
	div {
		position: relative;
		height: 100%;
	}

	.main {
		border-bottom-right-radius: 20px;
		border-bottom-left-radius: 20px;
	}

	text {
		font-family: Tahoma;
		user-select: none;
		cursor: default;
	}

	.label {
		font-size: 16px;
	}

	.tick {
		font-size: 14px;
	}
</style>
