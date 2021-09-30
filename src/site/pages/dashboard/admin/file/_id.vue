<style lang="scss" scoped>
	.underline { text-decoration: underline; }
</style>
<template>
	<section class="section is-fullheight dashboard">
		<div class="container">
			<div class="columns">
				<div class="column is-narrow">
					<Sidebar />
				</div>
				<div class="column">
					<h2 class="subtitle">
						File details
					</h2>
					<hr>

					<div class="columns">
						<div class="column is-6">
							<b-field
								label="ID"
								horizontal>
								<span>{{ admin.file.id }}</span>
							</b-field>

							<b-field
								label="Name"
								horizontal>
								<span>{{ admin.file.name }}</span>
							</b-field>

							<b-field
								label="Original Name"
								horizontal>
								<span>{{ admin.file.original }}</span>
							</b-field>

							<b-field
								label="IP"
								horizontal>
								<span class="underline">{{ admin.file.ip }}</span>
							</b-field>

							<b-field
								label="Link"
								horizontal>
								<a
									:href="admin.file.url"
									target="_blank">{{ admin.file.url }}</a>
							</b-field>

							<b-field
								label="Size"
								horizontal>
								<span>{{ formatBytes(admin.file.size) }}</span>
							</b-field>

							<b-field
								label="Hash"
								horizontal>
								<span>{{ admin.file.hash }}</span>
							</b-field>

							<b-field
								label="Uploaded"
								horizontal>
								<span><timeago :since="admin.file.createdAt" /></span>
							</b-field>
						</div>
						<div class="column is-6" v-if="admin.file.userId">
							<b-field
								label="User Id"
								horizontal>
								<span>{{ admin.user.id }}</span>
							</b-field>

							<b-field
								label="Username"
								horizontal>
								<span>{{ admin.user.username }}</span>
							</b-field>

							<b-field
								label="Enabled"
								horizontal>
								<span>{{ admin.user.enabled }}</span>
							</b-field>

							<b-field
								label="Registered"
								horizontal>
								<span><timeago :since="admin.user.createdAt" /></span>
							</b-field>

							<b-field
								label="Files"
								horizontal>
								<span>
									<nuxt-link :to="`/dashboard/admin/user/${admin.user.id}`">{{ admin.user.fileCount }}</nuxt-link>
								</span>
							</b-field>
						</div>
					</div>

					<div class="mb2 mt2 text-center">
						<b-button
							type="is-danger"
							@click="promptBanIP">
							Ban IP
						</b-button>
						<b-button
							v-if="admin.user.id !== auth.user.id && admin.file.userId"
							type="is-danger"
							@click="promptDisableUser">
							Disable user
						</b-button>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script>
import { mapState } from 'vuex';
import Sidebar from '~/components/sidebar/Sidebar.vue';

export default {
	components: {
		Sidebar
	},
	middleware: ['auth', 'admin'],
	computed: mapState(['admin', 'auth']),
	async asyncData({ app, params }) {
		await app.store.dispatch('admin/fetchFile', params.id);
	},
	methods: {
		promptDisableUser() {
			this.$buefy.dialog.confirm({
				type: 'is-danger',
				message: 'Are you sure you want to disable the account of the user that uploaded this file?',
				onConfirm: () => this.disableUser()
			});
		},
		disableUser() {
			this.$handler.executeAction('admin/disableUser', this.user.id);
		},
		promptBanIP() {
			this.$buefy.dialog.confirm({
				type: 'is-danger',
				message: 'Are you sure you want to ban the IP this file was uploaded from?',
				onConfirm: () => this.banIP()
			});
		},
		banIP() {
			this.$handler.executeAction('admin/banIP', this.file.ip);
		},
		formatBytes(bytes, decimals = 2) {
			if (bytes === 0) return '0 Bytes';

			const k = 1024;
			const dm = decimals < 0 ? 0 : decimals;
			const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

			const i = Math.floor(Math.log(bytes) / Math.log(k));

			// eslint-disable-next-line no-mixed-operators
			return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
		}
	}
};
</script>
