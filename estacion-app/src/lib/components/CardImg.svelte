<script lang="ts">
	export let url_img: string;
	export let route: string;
</script>

<a href="/{route}">
	<img src={url_img} alt="" width="200" height="300" />
</a>

<style>
	a {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		height: 100%;
		justify-content: center;
	}
</style>
