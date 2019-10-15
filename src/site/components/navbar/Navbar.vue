<style lang="scss" scoped>
	@import '~/assets/styles/_colors.scss';
	nav.navbar {
		background: transparent;
		box-shadow: none;

		.navbar-brand {
			width: calc(100% - 2em);
			align-items: flex-start;
			padding: 1em;

			div.spacer { flex: 1 0 10px; }
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

<template>
	<nav :class="{ isWhite }"
		class="navbar is-transparent">
		<div class="navbar-brand">
			<router-link to="/"
				class="navbar-item no-active">
				<i class="icon-ecommerce-safebox" /> {{ config.serviceName }}
			</router-link>

			<div class="spacer" />

			<template v-if="loggedIn">
				<router-link
					to="/dashboard"
					class="navbar-item no-active"
					exact>
					<i class="hidden" />
					Uploads
				</router-link>
				<router-link
					to="/dashboard/albums"
					class="navbar-item no-active"
					exact>
					<i class="hidden" />
					Albums
				</router-link>
				<router-link
					to="/dashboard/account"
					class="navbar-item no-active"
					exact>
					<i class="hidden" />
					Account
				</router-link>
			</template>
			<template v-else>
				<router-link
					class="navbar-item"
					to="/login">
					<i class="hidden" />
					Login
				</router-link>
			</template>
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
			this.$emit('logout');
		}
	}
};
</script>
