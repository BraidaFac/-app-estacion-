<script lang="ts">
	import { dataImg } from '$lib/data/brandImg';
	import Card from './Card.svelte';
	import HeaderList from './HeaderList.svelte';
</script>

<div class="list">
	<div class="header">
		<slot {HeaderList} />
	</div>
	<div class="content">
		{#each dataImg as img}
			<Card let:CardImg>
				<CardImg {...img} />
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
