<script lang="ts">
	import type { LayoutData } from './$types';

	export let data: LayoutData;
</script>

<nav class="navbar">
	<div class="logo">
		<a href="/"
			><img alt="logo" height="40px" width="40px" src="/logo.jpg" /><span> La estacion</span></a
		>
	</div>
	{#if data.user?.rol === 'ADMIN'}
		<a href="/admin">Acciones</a>
		<a class="go_back" href="./">Volver</a>
	{:else if data.user?.rol === 'USER'}
		<ul id="user_actions">
			<li><a href="/add">Nuevo articulo</a></li>
			<li><a href="/price">Actualizar precios</a></li>
		</ul>
	{/if}
	<div class="usr-menu">
		{#if data.user}
			<li>{data.user?.username}</li>
		{/if}
		<details class="menu" role="list">
			<summary aria-haspopup="listbox">
				<i class="fa-regular fa-user" />
			</summary>
			<ul role="listbox" class="listbox">
				{#if !data.user}
					<li>
						<a href="/register">Register</a>
					</li>
					<li>
						<a href="/login">Log in</a>
					</li>
				{:else}
					<form class="mb-0 listbox" method="POST">
						<button class="a" formaction="/logout" type="submit">
							<li class="shadow">LogOut</li>
						</button>
					</form>
				{/if}
			</ul>
		</details>
	</div>
</nav>
<div class="main">
	<slot />
</div>

<style lang="scss">
	.go_back {
		color: red;
	}
	.main {
		padding: 15px;
	}
	.navbar {
		width: 100%;
		height: 80px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
		// box-shadow: 0.0145rem 0.029rem 0.174rem rgba(27, 40, 50, 0.01698),0.0335rem 0.067rem 0.402rem rgba(27, 40, 50, 0.024),0.0625rem 0.125rem 0.75rem rgba(27, 40, 50, 0.03),0.1125rem 0.225rem 1.35rem rgba(27, 40, 50, 0.036),0.2085rem 0.417rem 2.502rem rgba(27, 40, 50, 0.04302),0.5rem 1rem 6rem rgba(27, 40, 50, 0.06),0 0 0 0.0625rem rgba(27, 40, 50, 0.015);
		.logo {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 60px;
			font-size: 1.2rem;
			font-weight: 600;
			padding-left: 2rem;
			a {
				margin-left: 5px;
				background-color: transparent;
				color: rgb(190, 13, 13);
			}
		}
		.opt-menu {
			width: max-width;
			display: flex;
			justify-content: flex-end;
			align-items: center;
			.menu {
				margin: 0;
				ul {
					right: 20%;
				}
			}
		}
		.usr-menu {
			width: max-width;
			height: 60px;
			display: flex;
			justify-content: flex-end;
			align-items: center;
			padding-right: 2rem;
			.menu {
				width: 3.5rem;
				margin: 0 0 0 30px;
				.listbox {
					left: -4.5rem;
					width: 8rem;
					form {
						margin: 0;
						display: flex;
						align-items: center;
						padding-bottom: 5px;
						button li {
							margin: 5px 0 0 0;
							top: 15px;
							width: 8rem;
							text-align: left;
						}
						button li:hover {
							background-color: hsl(205, 20%, 94%);
						}
					}
				}
			}
		}
	}
	.a {
		background: none;
		border: none;
		padding: 0;
		margin: 0;
		font: inherit;
		cursor: pointer;
		color: var(--dropdown-color);
		text-decoration: underline;
		width: 100%;
		text-decoration: none;
	}
	.a:hover,
	.a:focus {
		cursor: pointer;
		outline: none;
	}

	@media only screen and (max-width: 600px) {
		.navbar {
			display: flex;
			justify-content: space-between;
			#user_actions {
				display: none;
			}
			.logo {
				a {
					span {
						display: none;
					}
				}
			}
			.usr-menu {
				padding: 1px;
				.menu {
					.listbox {
						left: -4.5rem;
						width: 8rem;
						form {
							margin: 0;
							display: flex;
							align-items: center;
							padding-bottom: 5px;
							button li {
								margin: 5px 0 0 0;
								top: 15px;
								width: 8rem;
								text-align: left;
							}
							button li:hover {
								background-color: hsl(205, 20%, 94%);
							}
						}
					}
				}
			}
		}
	}
</style>
