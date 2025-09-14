<script lang="ts">
	import { fly } from 'svelte/transition';
	import type { TooltipProps } from './constants';
	import { formatNumber, roundTo } from '$lib/ChronicIllnessComparisons/logic';
	import { sourceMap, yLabelMap } from '../constants';

	let { data, xAccessorScaled, yAccessorScaled, width, yProperty }: TooltipProps = $props();

	const xNudge = 5;
	const yNudge = 15;

	let tooltipWidth = $state(0);

	let x = $derived(xAccessorScaled(data));
	let y = $derived(yAccessorScaled(data));

	let isOverflowingRight = $derived(x + tooltipWidth + xNudge > width);
	let xPosition = $derived(isOverflowingRight ? x - tooltipWidth / 2 - xNudge : x + xNudge);
	let yPosition = $derived(y + yNudge);

	let source = $derived.by(() => {
		const sourceProperty = sourceMap[yProperty];
		if (!sourceProperty) {
			return '';
		}
		return data[sourceProperty] as string;
	});
</script>

<div
	class="tooltip"
	style="left: {xPosition}px; top: {yPosition}px; --max-width: {width}px"
	bind:clientWidth={tooltipWidth}
	in:fly={{ y: -20 }}
	out:fly={{ y: 20 }}
>
	<h3>{data.illness}</h3>
	<h4>
		{yLabelMap[yProperty]}
		<a href={source} target="_blank">
			{formatNumber(+data[yProperty])}
		</a>
	</h4>
</div>

<style>
	.tooltip {
		position: absolute;
		background: white;
		color: var(--clr-text-on-surface-500);
		max-width: min(50%, var(--max-width));
		padding: 8px 6px;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		gap: 4px;
		box-shadow:
			rgba(0, 0, 0, 0.1) 0 2px 4px,
			rgba(0, 0, 0, 0.08) 0 6px 12px;
		border-radius: 6px;
		font-family: Tahoma, Geneva, Verdana, sans-serif;
		transition:
			top 300ms ease,
			left 300ms ease;
	}

	h3,
	h4,
	a {
		padding: 0;
		margin: 0;
	}
</style>
