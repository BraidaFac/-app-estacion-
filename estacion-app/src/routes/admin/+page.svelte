<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';
</script>

<div class="container">
	<a role="button" href="admin/brand">Marcas</a>
	<a role="button" href="admin/category">Categorias</a>
	<a role="button" href="admin/product">Articulos</a>
	<a role="button" href="files">Excel</a>
</div>

<style lang="scss">
	div {
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-items: center;
		height: 40vh;
		a {
			width: 200px;
			height: 50px;
			background-color: #3f3f3f;
			color: #fff;
			text-decoration: none;
			display: flex;
			justify-content: center;
			align-items: center;
			border-radius: 10px;
			transition: all 0.3s ease-in-out;
			&:hover {
				background-color: #fff;
				color: #000;
				border: 1px solid #000;
			}
		}
	}
</style>
