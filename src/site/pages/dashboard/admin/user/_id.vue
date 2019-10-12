<style lang="scss" scoped>
	.underline { text-decoration: underline; }
</style>
<template>
	<section class="hero is-fullheight dashboard">
		<div class="hero-body">
			<div class="container">
				<div class="columns">
					<div class="column is-narrow">
						<Sidebar />
					</div>
					<div class="column">
						<h2 class="subtitle">User details</h2>
						<hr>

						<b-field label="User Id"
							horizontal>
							<span>{{ user.id }}</span>
						</b-field>

						<b-field label="Username"
							horizontal>
							<span>{{ user.username }}</span>
						</b-field>

						<b-field label="Enabled"
							horizontal>
							<span>{{ user.enabled }}</span>
						</b-field>

						<b-field label="Registered"
							horizontal>
							<span><timeago :since="user.createdAt" /></span>
						</b-field>

						<b-field label="Files"
							horizontal>
							<span>{{ files.length }}</span>
						</b-field>

						<div class="mb2 mt2 text-center">
							<button class="button is-danger"
								@click="promptDisableUser">Disable user</button>
						</div>

						<Grid v-if="files.length"
							:files="files" />
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script>
import Sidebar from '~/components/sidebar/Sidebar.vue';
import Grid from '~/components/grid/Grid.vue';

export default {
	components: {
		Sidebar,
		Grid
	},
	middleware: ['auth', 'admin'],
	data() {
		return {
			options: {},
			files: null,
			user: null
		};
	},
	async asyncData({ $axios, route }) {
		try {
			const response = await $axios.$get(`/admin/users/${route.params.id}`);
			return {
				files: response.files ? response.files : null,
				user: response.user ? response.user : null
			};
		} catch (error) {
			console.error(error);
			return {
				files: null,
				user: null
			};
		}
	},
	methods: {
		promptDisableUser() {
			this.$buefy.dialog.confirm({
				message: 'Are you sure you want to disable the account of the user that uploaded this file?',
				onConfirm: () => this.disableUser()
			});
		},
		async disableUser() {
			const response = await this.$axios.$post('admin/users/disable', {
				id: this.user.id
			});
			this.$buefy.toast.open(response.message);
		}
	}
};
</script>
