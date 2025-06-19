<script lang="ts">
	import { onMount } from 'svelte';

	import { csv } from 'd3-fetch';
	import { scaleLinear } from 'd3-scale';
	import type { Student, CsvStudent, ChronicIlnessComparisonsProps } from './constants';

	let { src }: ChronicIlnessComparisonsProps = $props();

	let data = $state<Student[]>([]);

	onMount(async () => {
		data = await csv<Student>(src, (row) => {
			const typedRow = row as CsvStudent;

			return {
				...typedRow,
				age: +typedRow.age,
				height: +typedRow.height
			};
		});
	});

	// $inspect(data);
</script>

<div>
	<ul>
		{#each data as student}
			<li>{student.name} is {student.age} years old and {student.age}cm tall</li>
		{/each}
	</ul>
</div>
