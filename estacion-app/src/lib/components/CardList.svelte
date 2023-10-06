<script lang="ts">
	import type { Brand } from '../../types';
	import Card from './Card.svelte';
	export let brands: Brand[];
</script>

<div class="content">
	{#each brands as brand}
		<Card let:CardImg>
			<CardImg route={brand.name} url_img={brand.url_img} />
		</Card>
	{/each}
</div>

<style lang="scss">
	.content {
		margin: 50px;
		margin-top: 100px;
		display: grid;
		column-gap: 30px;
		row-gap: 30px;
		grid-template-rows: repeat(2, 1fr);
		grid-template-columns: auto auto auto;
	}

	@media (max-width: 600px) {
		.content {
			margin: 50px;
			margin-top: 50px;
			display: flex;
			flex-direction: column;
			align-items: center;
		}
	}
</style>
