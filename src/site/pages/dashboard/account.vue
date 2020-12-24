<template>
	<section class="section is-fullheight dashboard">
		<div class="container">
			<div class="columns">
				<div class="column is-narrow">
					<Sidebar />
				</div>
				<div class="column">
					<h2 class="subtitle">
						Account settings
					</h2>
					<hr>

					<b-field
						label="Username"
						message="Nothing to do here"
						horizontal>
						<b-input
							class="lolisafe-input"
							:value="user.username"
							expanded
							disabled />
					</b-field>

					<b-field
						label="Current password"
						message="If you want to change your password input the current one here"
						horizontal>
						<b-input
							v-model="password"
							class="lolisafe-input"
							type="password"
							expanded />
					</b-field>

					<b-field
						label="New password"
						message="Your new password"
						horizontal>
						<b-input
							v-model="newPassword"
							class="lolisafe-input"
							type="password"
							expanded />
					</b-field>

					<b-field
						label="New password again"
						message="Your new password once again"
						horizontal>
						<b-input
							v-model="reNewPassword"
							class="lolisafe-input"
							type="password"
							expanded />
					</b-field>

					<div class="mb2 mt2 text-center">
						<b-button
							type="is-lolisafe"
							@click="changePassword">
							Change password
						</b-button>
					</div>

					<b-field
						label="API key"
						message="This API key lets you use the service from other apps"
						horizontal>
						<b-field expanded>
							<b-input
								class="lolisafe-input"
								:value="apiKey"
								expanded
								disabled />
							<p class="control">
								<b-button
									type="is-lolisafe"
									@click="copyKey">
									Copy
								</b-button>
							</p>
						</b-field>
					</b-field>

					<div class="mb2 mt2 text-center">
						<b-button
							type="is-lolisafe"
							@click="promptNewAPIKey">
							Request new API key
						</b-button>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import Sidebar from '~/components/sidebar/Sidebar.vue';

export default {
	components: {
		Sidebar
	},
	middleware: ['auth', ({ store }) => {
		store.dispatch('auth/fetchCurrentUser');
	}],
	data() {
		return {
			password: '',
			newPassword: '',
			reNewPassword: ''
		};
	},
	computed: {
		...mapGetters({ apiKey: 'auth/getApiKey' }),
		...mapState({
			user: state => state.auth.user
		})
	},
	metaInfo() {
		return { title: 'Account' };
	},
	methods: {
		...mapActions({
			getUserSetttings: 'auth/fetchCurrentUser'
		}),
		async changePassword() {
			const { password, newPassword, reNewPassword } = this;

			if (!password || !newPassword || !reNewPassword) {
				this.$store.dispatch('alert/set', {
					text: 'One or more fields are missing',
					error: true
				});
				return;
			}
			if (newPassword !== reNewPassword) {
				this.$store.dispatch('alert/set', {
					text: 'Passwords don\'t match',
					error: true
				});
				return;
			}

			const response = await this.$store.dispatch('auth/changePassword', {
				password,
				newPassword
			});

			if (response) {
				this.$buefy.toast.open(response.message);
			}
		},
		promptNewAPIKey() {
			this.$buefy.dialog.confirm({
				type: 'is-danger',
				message: 'Are you sure you want to regenerate your API key? Previously generated API keys will stop working. Make sure to write the new key down as this is the only time it will be displayed to you.',
				onConfirm: () => this.requestNewAPIKey()
			});
		},
		copyKey() {
			this.$clipboard(this.apiKey);
			this.$notifier.success('API key copied to clipboard');
		},
		async requestNewAPIKey() {
			const response = await this.$store.dispatch('auth/requestAPIKey');
			this.$buefy.toast.open(response.message);
		}
	}
};
</script>
