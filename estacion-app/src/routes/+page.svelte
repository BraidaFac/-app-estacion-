<script lang="ts">
	import CardList from '$lib/components/CardList.svelte';
	import HeaderList from '$lib/components/HeaderList.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
</script>

{#if data.user}
	<CardList let:HeaderList />
{/if}
