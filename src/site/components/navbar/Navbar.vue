<style lang="scss" scoped>
	@import '../../styles/colors.scss';
	nav.navbar {
		background: transparent;
		box-shadow: none;

		.navbar-brand {
			width: 100%;
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
				<i class="icon-ecommerce-safebox"/> {{ config.serviceName }}
			</router-link>

			<!--
			<template v-if="loggedIn">
				<router-link
					to="/dashboard/uploads"
					class="navbar-item no-active"
					exact><i class="hidden"/>Uploads</router-link>

				<router-link
					to="/dashboard/albums"
					class="navbar-item no-active"
					exact><i class="hidden"/>Albums</router-link>

				<router-link
					to="/dashboard/tags"
					class="navbar-item no-active"
					exact><i class="hidden"/>Tags</router-link>

				<router-link
					to="/dashboard/settings"
					class="navbar-item no-active"
					exact><i class="hidden"/>Settings</router-link>
			</template>
			-->

			<div class="spacer" />

			<router-link v-if="!loggedIn"
				class="navbar-item"
				to="/login"><i class="hidden"/>Login</router-link>

			<router-link v-else
				to="/dashboard"
				class="navbar-item no-active"
				exact><i class="hidden"/>Dashboard</router-link>
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
		user() {
			return this.$store.state.user;
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
