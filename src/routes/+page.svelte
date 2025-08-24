<script lang="ts">
	import ChronicIllnessComparisons from '$lib/ChronicIllnessComparisons/ChronicIllnessComparisons.svelte';
</script>

<ChronicIllnessComparisons src="disease-prevalence-data.csv" mode="compare to rare baseline" />

<ChronicIllnessComparisons src="disease-prevalence-data.csv" mode="compare to each other" />
