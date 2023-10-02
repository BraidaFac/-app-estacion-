<script lang="ts">
	import CardList from '$lib/components/CardList.svelte';
	import type { Brand } from '../types';
	import type { PageData } from './$types';
	export let data: PageData;
	const brands = data.brands as Brand[];
</script>

{#if data.user}
	<CardList {brands} />
{/if}
