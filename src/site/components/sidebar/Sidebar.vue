<template>
	<b-menu class="dashboard-menu">
		<b-menu-list label="Menu">
			<b-menu-item
				class="item"
				icon="information-outline"
				label="Dashboard"
				tag="nuxt-link"
				to="/dashboard"
				exact />
			<b-menu-item
				class="item"
				icon="image-multiple-outline"
				label="Albums"
				tag="nuxt-link"
				to="/dashboard/albums"
				exact />
			<b-menu-item
				class="item"
				icon="tag-outline"
				label="Tags"
				tag="nuxt-link"
				to="/dashboard/tags"
				exact />
			<b-menu-item v-if="user && user.isAdmin" icon="menu" expanded>
				<template slot="label" slot-scope="props">
					Administration
					<b-icon class="is-pulled-right" :icon="props.expanded ? 'menu-down' : 'menu-up'" />
				</template>
				<b-menu-item icon="account" label="Users" tag="nuxt-link" to="/dashboard/admin/users" exact />
				<b-menu-item icon="cog-outline" label="Settings" tag="nuxt-link" to="/dashboard/admin/settings" exact />
			</b-menu-item>
			<b-menu-item
				class="item"
				icon="account-cog-outline"
				label="My account"
				tag="nuxt-link"
				to="/dashboard/account"
				exact />
		</b-menu-list>
		<b-menu-list label="Actions">
			<b-menu-item icon="exit-to-app" label="Logout" tag="nuxt-link" to="/logout" exact />
		</b-menu-list>
	</b-menu>
</template>
<script>
import { mapState } from 'vuex';

export default {
	computed: mapState({
		user: state => state.auth.user
	}),
	methods: {
		isRouteActive(id) {
			if (this.$route.path.includes(id)) {
				return true;
			}
			return false;
		}
	}
};

</script>
<style lang="scss" scoped>
	@import '~/assets/styles/_colors.scss';
	.dashboard-menu {
		::v-deep a:hover {
			cursor: pointer;
			text-decoration: none;
		}

		::v-deep .icon {
			margin-right: 0.5rem;
		}

		::v-deep .icon.is-pulled-right {
			margin-right: 0;
		}

		hr { margin-top: 0.6em; }
	}
</style>
