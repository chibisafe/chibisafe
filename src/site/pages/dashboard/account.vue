<style lang="scss" scoped>
	@import '~/assets/styles/_colors.scss';
	section { background-color: $backgroundLight1 !important; }
	section.hero div.hero-body {
		align-items: baseline;
	}
	div.search-container {
		display: flex;
		justify-content: center;
	}
</style>
<style lang="scss">
	@import '~/assets/styles/_colors.scss';
</style>


<template>
	<section class="hero is-fullheight">
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
	data() {
		return {
			user: {}
		};
	},
	computed: {
		config() {
			return this.$store.state.config;
		}
	},
	metaInfo() {
		return { title: 'Account' };
	},
	mounted() {
		this.getUserSetttings();
	},
	methods: {
		async getUserSetttings() {
			try {
				const response = await this.axios.get(`${this.config.baseURL}/users/me`);
				this.user = response.data.user;
			} catch (error) {
				this.$onPromiseError(error);
			}
		},
		async changePassword() {
			if (!this.user.password || !this.user.newPassword || !this.user.reNewPassword) return this.$showToast('One or more fields are missing', true);
			if (this.user.newPassword !== this.user.reNewPassword) return this.$showToast('Passwords don\'t match', true);

			try {
				const response = await this.axios.post(`${this.config.baseURL}/user/password/change`,
					{
						password: this.user.password,
						newPassword: this.user.newPassword
					});
				this.$toast.open(response.data.message);
			} catch (error) {
				this.$onPromiseError(error);
			}
		},
		promptNewAPIKey() {
			this.$dialog.confirm({
				type: 'is-danger',
				message: 'Are you sure you want to regenerate your API key? Previously generated API keys will stop working. Make sure to write the new key down as this is the only time it will be displayed to you.',
				onConfirm: () => this.requestNewAPIKey()
			});
		},
		async requestNewAPIKey() {
			try {
				const response = await this.axios.post(`${this.config.baseURL}/user/apikey/change`);
				this.user.apiKey = response.data.apiKey;
				this.$toast.open(response.data.message);
				this.$forceUpdate();
			} catch (error) {
				this.$onPromiseError(error);
			}
		}
	}
};
</script>
