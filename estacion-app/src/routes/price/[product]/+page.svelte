<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
	import type { Price } from '@prisma/client';
	const prices = data.prices;
	const product = data.product;
</script>

<div class="list">
	<h1>{`Articulo:  ${product?.id}`}</h1>
	<table class="t-price" role="grid">
		<thead>
			<tr>
				<th scope="col">Precio</th>
				<th scope="col">Fecha Desde</th>
			</tr>
		</thead>
		<tbody>
			{#each prices as price (price.id)}
				<tr>
					<td>${price.price}</td>
					<td>{`${price.date.getDay()}/${price.date.getMonth()}/${price.date.getFullYear()}`}</td>
				</tr>
			{/each}
		</tbody>
	</table>
	<a role="button" href="/price">Volver a la lista</a>
</div>

<style lang="scss">
	.list {
		margin-top: 50px;
		display: flex;
		justify-content: center;
		flex-direction: column;
		align-items: center;
		.t-price {
			width: 60%;
			th {
				text-align: center;
				color: rgb(159, 16, 16);
			}
			td {
				text-align: center;
			}
		}
	}
</style>
