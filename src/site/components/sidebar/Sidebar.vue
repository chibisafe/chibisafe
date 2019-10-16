<style lang="scss" scoped>
	@import '~/assets/styles/_colors.scss';
	.dashboard-menu {
		a {
			display: block;
			font-weight: 700;
			color: #868686;
			position: relative;
			padding-left: 40px;
			height: 35px;
			&:hover, &:first-child {
				color: $defaultTextColor;
			}

			i {
				position: absolute;
				font-size: 1.5em;
				top: -4px;
				left: 5px;
			}
		}

		hr { margin-top: 0.6em; }
	}
</style>
<template>
	<div class="dashboard-menu">
		<router-link to="/">
			<i class="icon-ecommerce-safebox" />Rahnserver
		</router-link>
		<hr>
		<router-link to="/dashboard">
			<i class="icon-com-pictures" />Files
		</router-link>
		<router-link to="/dashboard/albums">
			<i class="icon-interface-window" />Albums
		</router-link>
		<!--
		<router-link to="/dashboard/tags">
			<i class="icon-ecommerce-tag-c" />Tags
		</router-link>
		-->
		<hr>
		<router-link to="/dashboard/account">
			<i class="icon-ecommerce-tag-c" />Account
		</router-link>
		<template v-if="user && user.isAdmin">
			<hr>
			<router-link to="/dashboard/admin/users">
				<i class="icon-setting-gear-a" />Users
			</router-link>
			<router-link to="/dashboard/admin/settings">
				<i class="icon-setting-gear-a" />Server Settings (WIP)
			</router-link>
		</template>
	</div>
</template>
<script>
export default {
	computed: {
		user() {
			return this.$store.state.user;
		}
	}
};
</script>
