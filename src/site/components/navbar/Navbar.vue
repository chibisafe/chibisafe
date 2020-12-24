<template>
	<b-navbar
		:class="{ isWhite }"
		transparent>
		<template slot="end">
			<b-navbar-item tag="div">
				<router-link
					to="/"
					class="navbar-item no-active"
					exact>
					Home
				</router-link>
			</b-navbar-item>
			<b-navbar-item tag="div">
				<router-link
					to="/faq"
					class="navbar-item no-active"
					exact>
					Docs
				</router-link>
			</b-navbar-item>
			<template v-if="loggedIn">
				<b-navbar-item tag="div">
					<router-link
						to="/dashboard"
						class="navbar-item no-active"
						exact>
						Uploads
					</router-link>
				</b-navbar-item>
				<b-navbar-item tag="div">
					<router-link
						to="/dashboard/albums"
						class="navbar-item no-active"
						exact>
						Albums
					</router-link>
				</b-navbar-item>
				<b-navbar-item tag="div">
					<router-link
						to="/dashboard/account"
						class="navbar-item no-active"
						exact>
						Account
					</router-link>
				</b-navbar-item>
				<b-navbar-item tag="div">
					<router-link
						to="/"
						class="navbar-item no-active"
						@click.native="logOut">
						Logout
					</router-link>
				</b-navbar-item>
			</template>
			<template v-else>
				<b-navbar-item tag="div">
					<router-link
						class="navbar-item"
						to="/login">
						Login
					</router-link>
				</b-navbar-item>
			</template>
		</template>
	</b-navbar>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
	props: {
		isWhite: {
			'type': Boolean,
			'default': false
		}
	},
	data() {
		return { hamburger: false };
	},
	computed: {
		...mapGetters({ loggedIn: 'auth/isLoggedIn' }),
		...mapState(['config'])
	},
	methods: {
		async logOut() {
			await this.$store.dispatch('auth/logout');
			this.$router.replace('/login');
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

	.no-active {
		text-decoration: none !important;
	}
</style>
