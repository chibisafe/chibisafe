<template>
	<nav :class="{ isWhite }"
		class="navbar is-transparent">
		<div class="navbar-brand">
			<a role="button"
				class="navbar-burger burger"
				aria-label="menu"
				aria-expanded="false"
				data-target="navbarBasicExample">
				<span aria-hidden="true" />
				<span aria-hidden="true" />
				<span aria-hidden="true" />
			</a>
		</div>
		<div class="navbar-menu">
			<div class="navbar-end">
				<router-link
					to="/"
					class="navbar-item no-active"
					exact>
					Home
				</router-link>
				<router-link
					to="/"
					class="navbar-item no-active"
					exact>
					Docs
				</router-link>
				<template v-if="loggedIn">
					<router-link
						to="/dashboard"
						class="navbar-item no-active"
						exact>
						Uploads
					</router-link>
					<router-link
						to="/dashboard/albums"
						class="navbar-item no-active"
						exact>
						Albums
					</router-link>
					<router-link
						to="/dashboard/account"
						class="navbar-item no-active"
						exact>
						Account
					</router-link>
					<router-link
						to="/"
						class="navbar-item no-active"
						@click.native="logOut">
						Logout
					</router-link>
				</template>
				<template v-else>
					<router-link
						class="navbar-item"
						to="/login">
						Login
					</router-link>
				</template>
			</div>
		</div>
	</nav>
</template>

<script>
export default {
	props: {
		isWhite: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return { hamburger: false };
	},
	computed: {
		loggedIn() {
			return this.$store.state.loggedIn;
		},
		config() {
			return this.$store.state.config;
		}
	},
	methods: {
		logOut() {
			this.$store.dispatch('logout');
		}
	}
};
</script>
<style lang="scss" scoped>
	@import '~/assets/styles/_colors.scss';
	nav.navbar {
		background: transparent;
		box-shadow: none;
		.navbar-brand {
			a.burger {
				color: $defaultTextColor;
			}
		}
		.navbar-menu {
			height: 5rem;

			.navbar-end {
				padding-right: 2rem;
			}
			a.navbar-item {
				color: $defaultTextColor;
				font-size: 16px;
				font-weight: 700;
				text-decoration-style: solid;
			}
			a.navbar-item:hover, a.navbar-item.is-active, a.navbar-link:hover, a.navbar-link.is-active {
				text-decoration: underline;
				background: transparent;
			}

			i {
				font-size: 2em;
				&.hidden {
					width: 0px;
					height: 1.5em;
					pointer-events: none;
				}
			}
		}

		&.isWhite {
			.navbar-brand {
				a.navbar-item {
					color: white;
				}
			}
		}
	}
</style>
