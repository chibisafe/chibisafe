<template>
	<section class="hero is-fullheight dashboard">
		<div class="hero-body">
			<div class="container">
				<div class="columns">
					<div class="column is-narrow">
						<Sidebar />
					</div>
					<div class="column">
						<h2 class="subtitle">Account settings</h2>
						<hr>

						<b-field label="Username"
							message="Nothing to do here"
							horizontal>
							<b-input v-model="user.username"
								expanded
								disabled />
						</b-field>

						<b-field label="Current password"
							message="If you want to change your password input the current one here"
							horizontal>
							<b-input v-model="user.password"
								type="password"
								expanded />
						</b-field>

						<b-field label="New password"
							message="Your new password"
							horizontal>
							<b-input v-model="user.newPassword"
								type="password"
								expanded />
						</b-field>

						<b-field label="New password again"
							message="Your new password once again"
							horizontal>
							<b-input v-model="user.reNewPassword"
								type="password"
								expanded />
						</b-field>

						<div class="mb2 mt2 text-center">
							<button class="button is-primary"
								@click="changePassword">Change password</button>
						</div>

						<b-field label="Api key"
							message="This API key lets you use the service from other apps"
							horizontal>
							<b-input v-model="user.apiKey"
								expanded
								disabled />
						</b-field>

						<div class="mb2 mt2 text-center">
							<button class="button is-primary"
								@click="promptNewAPIKey">Request new API key</button>
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
	middleware: 'auth',
	data() {
		return {
			user: {}
		};
	},
	metaInfo() {
		return { title: 'Account' };
	},
	mounted() {
		this.getUserSetttings();
	},
	methods: {
		async getUserSetttings() {
			const response = await this.$axios.$get(`users/me`);
			this.user = response.user;
		},
		async changePassword() {
			if (!this.user.password || !this.user.newPassword || !this.user.reNewPassword) {
				this.$store.dispatch('alert', {
					text: 'One or more fields are missing',
					error: true
				});
				return;
			}
			if (this.user.newPassword !== this.user.reNewPassword) {
				this.$store.dispatch('alert', {
					text: 'Passwords don\'t match',
					error: true
				});
				return;
			}

			const response = await this.$axios.$post(`user/password/change`,
				{
					password: this.user.password,
					newPassword: this.user.newPassword
				});
			this.$buefy.toast.open(response.message);
		},
		promptNewAPIKey() {
			this.$buefy.dialog.confirm({
				type: 'is-danger',
				message: 'Are you sure you want to regenerate your API key? Previously generated API keys will stop working. Make sure to write the new key down as this is the only time it will be displayed to you.',
				onConfirm: () => this.requestNewAPIKey()
			});
		},
		async requestNewAPIKey() {
			const response = await this.$axios.$post(`user/apikey/change`);
			this.user.apiKey = response.apiKey;
			this.$forceUpdate();
			this.$buefy.toast.open(response.message);
		}
	}
};
</script>
