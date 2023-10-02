<script lang="ts">
	import { dataImg } from '$lib/data/brandImg';
	import type { Brand } from '../../types';
	import Card from './Card.svelte';
	export let brands: Brand[];
</script>

<div class="list">
	<div class="content">
		{#each brands as brand}
			<Card let:CardImg>
				<CardImg route={brand.name} url_img={brand.url_img} />
			</Card>
		{/each}
	</div>
</div>

<style>
	.content {
		margin: 50px;
		margin-top: 100px;
		display: grid;
		column-gap: 30px;
		row-gap: 30px;
		grid-template-rows: repeat(2, 1fr);
		grid-template-columns: auto auto auto;
	}
</style>
