<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';
	export let form;
	let loading = false;
</script>

<main class="container">
	<article class="grid">
		<div class="form-panel">
			<hgroup>
				<h1>Registro</h1>
			</hgroup>
			<form
				method="POST"
				class="register-form"
				use:enhance={() => {
					loading = true;
					return ({ update }) => {
						loading = false;
						update();
					};
				}}
			>
				<div class="inputs">
					<input
						type="text"
						name="username"
						placeholder="Usuario"
						aria-label="User"
						autocomplete="username"
						value={form?.data?.user ?? ''}
						class={form?.errors?.user ? 'input-error' : 'input'}
					/>
					{#if form?.errors?.user}
						<span class="error">{form?.errors?.user[0]}</span>
					{/if}
					<input
						type="password"
						name="password"
						placeholder="Password"
						aria-label="Password"
						autocomplete="current-password"
						class={form?.errors?.password || form?.errors?.confirmPassword
							? 'input-error'
							: 'input'}
						value={form?.data?.password ?? ''}
					/>
					{#if form?.errors?.password}
						<span class="error">{form?.errors?.password[0]}</span>
					{/if}
					<input
						type="password"
						name="confirmPassword"
						placeholder="Confirm Password"
						aria-label="confirm Password"
						value={form?.data?.confirmPassword ?? ''}
						class="{form?.errors?.confirmPassword ? 'input-error' : 'input'} {form?.message
							? 'message-error'
							: ''}"
					/>
					{#if form?.errors?.confirmPassword}
						<span class="error">{form?.errors?.confirmPassword[0]}</span>
					{/if}
					{#if form?.message}
						<span class="error">{form?.message}</span>
					{/if}
				</div>
				<button type="submit" class="contrast submit-btn" typeof="submit" aria-busy={loading}
					>Registrar</button
				>
			</form>
		</div>
		<div id="logo" />
	</article>
</main>

<style lang="scss">
	article {
		height: 70%;
	}
	.inputs {
		input {
			margin-bottom: 1rem;
		}
	}
	.container {
		height: calc(100vh - 80px);
		.grid {
			margin-top: 60px;
		}
	}
	#logo {
		background-image: url('../../../static/logo.jpg');
		background-position: center;
		background-size: cover;
	}

	.error {
		font-size: small;
		color: red;
		position: relative;
		display: inline-block;
		height: 2rem;
		margin: 0;
	}
	.input-error {
		--spacing: 0;
		border: red solid 2px;
		margin-bottom: 0rem;
	}
</style>
