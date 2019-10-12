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
						<h2 class="subtitle">File details</h2>
						<hr>

						<div class="columns">
							<div class="column is-6">
								<b-field label="ID"
									horizontal>
									<span>{{ file.id }}</span>
								</b-field>

								<b-field label="Name"
									horizontal>
									<span>{{ file.name }}</span>
								</b-field>

								<b-field label="Original Name"
									horizontal>
									<span>{{ file.original }}</span>
								</b-field>

								<b-field label="IP"
									horizontal>
									<span class="underline">{{ file.ip }}</span>
								</b-field>

								<b-field label="Link"
									horizontal>
									<a :href="file.url"
										target="_blank">{{ file.url }}</a>
								</b-field>

								<b-field label="Size"
									horizontal>
									<span>{{ formatBytes(file.size) }}</span>
								</b-field>

								<b-field label="Hash"
									horizontal>
									<span>{{ file.hash }}</span>
								</b-field>

								<b-field label="Uploaded"
									horizontal>
									<span><timeago :since="file.createdAt" /></span>
								</b-field>
							</div>
							<div class="column is-6">
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
									<span>
										<nuxt-link :to="`/dashboard/admin/user/${user.id}`">{{ user.fileCount }}</nuxt-link>
									</span>
								</b-field>
							</div>
						</div>

						<div class="mb2 mt2 text-center">
							<button class="button is-danger"
								@click="promptBanIP">Ban IP</button>
							<button class="button is-danger"
								@click="promptDisableUser">Disable user</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script>
import Sidebar from '~/components/sidebar/Sidebar.vue';

export default {
	components: {
		Sidebar
	},
	middleware: ['auth', 'admin'],
	data() {
		return {
			options: {},
			file: null,
			user: null
		};
	},
	async asyncData({ $axios, route }) {
		try {
			const response = await $axios.$get(`file/${route.params.id}`);
			return {
				file: response.file ? response.file : null,
				user: response.user ? response.user : null
			};
		} catch (error) {
			console.error(error);
			return {
				file: null,
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
		},
		promptBanIP() {
			this.$buefy.dialog.confirm({
				message: 'Are you sure you want to ban the IP this file was uploaded from?',
				onConfirm: () => this.banIP()
			});
		},
		async banIP() {
			const response = await this.$axios.$post('admin/ban/ip', {
				ip: this.file.ip
			});
			this.$buefy.toast.open(response.message);
		},
		formatBytes(bytes, decimals = 2) {
			if (bytes === 0) return '0 Bytes';

			const k = 1024;
			const dm = decimals < 0 ? 0 : decimals;
			const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

			const i = Math.floor(Math.log(bytes) / Math.log(k));

			return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
		}
	}
};
</script>
