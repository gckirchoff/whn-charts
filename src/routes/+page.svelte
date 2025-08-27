<script lang="ts">
	import ChronicIllnessComparisons from '$lib/ChronicIllnessComparisons/ChronicIllnessComparisons.svelte';
</script>

<ChronicIllnessComparisons src="disease-prevalence-data.csv" compareMode="to rare baseline" />

<ChronicIllnessComparisons src="disease-prevalence-data.csv" compareMode="to each other" />
