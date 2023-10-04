<script lang="ts">
	import CardImg from './CardImg.svelte';
</script>

<div class="card">
	<slot {CardImg} />
</div>

<style lang="scss">
	@import '../../../static/styles/scss/theme.scss';
	.card {
		width: 400px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		transition: $base-transition-speed;
		border-radius: $base-border-radius;
		background-color: white;
		cursor: pointer;
		color: $dark;

		margin-bottom: $base-box-padding;

		&:hover {
			box-shadow: 2px 6px 25px 20px rgba(rgb(248, 247, 247), 0.2);
		}
	}
</style>
