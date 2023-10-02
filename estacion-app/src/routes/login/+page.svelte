<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import { enhance } from '$app/forms';
	export let form: ActionData;
	let loading = false;
</script>

<main class="container">
	<article class="grid">
		<div class="form-panel">
			<hgroup>
				<h1>Login</h1>
			</hgroup>
			<form
				method="POST"
				use:enhance={() => {
					loading = true;
					return ({ update }) => {
						loading = false;
						update();
					};
				}}
			>
				<input
					value={form?.user ?? ''}
					type="text"
					name="username"
					placeholder="Username"
					aria-label="Username"
					required
				/>

				<input
					type="password"
					name="password"
					placeholder="Password"
					aria-label="Password"
					autocomplete="current-password"
					required
				/>
				{#if form?.message === 'AUTH_INVALID_KEY_ID' || form?.message === 'AUTH_INVALID_PASSWORD'}
					<span class="error">Credenciales incorrectas</span>
				{/if}
				<button type="submit" class="contrast" typeof="submit" aria-busy={loading}>Log in</button>
			</form>

			<p>No tienes una cuenta <a href="/register">Registrarse</a></p>
		</div>
		<div id="logo" />
	</article>
</main>

<style lang="scss">
	.container {
		height: calc(100vh - 80px);
		.grid {
			margin-top: 60px;
		}
	}
	.error {
		font-size: small;
		color: red;
	}
	#logo {
		background-image: url('logo.jpg');
		background-position: center;
		background-size: contain;
	}
</style>
