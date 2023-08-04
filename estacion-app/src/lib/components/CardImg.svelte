<script lang="ts">
	export let src: string;
	export let name: string;
</script>

<a href="/{name}">
	<img {src} alt="" width="200" height="300" />
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
