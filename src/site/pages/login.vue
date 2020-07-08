<template>
	<section class="section is-fullheight is-login">
		<div class="container">
			<h1 class="title">
				Dashboard Access
			</h1>
			<h2 class="subtitle mb5">
				Login to access your files and folders
			</h2>
			<div class="columns">
				<div class="column is-4 is-offset-4">
					<b-field>
						<b-input
							v-model="username"
							type="text"
							placeholder="Username"
							@keyup.enter.native="login" />
					</b-field>
					<b-field>
						<b-input
							v-model="password"
							type="password"
							placeholder="Password"
							password-reveal
							@keyup.enter.native="login" />
					</b-field>

					<p class="control has-addons is-pulled-right" />

					<div class="level">
						<div class="level-left">
							<div class="level-item">
								<router-link
									v-if="config.userAccounts"
									to="/register"
									class="is-text">
									Don't have an account?
								</router-link>
								<span v-else>Registration is closed at the moment</span>
							</div>
						</div>

						<div class="level-right">
							<p class="level-item">
								<b-button
									size="is-medium"
									type="is-lolisafe"
									@click="login">
									Login
								</b-button>
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!--
		<b-modal :active.sync="isMfaModalActive"
			:canCancel="true"
			has-modal-card>
			<div class="card mfa">
				<div class="card-content">
					<div class="content">
						<p>Enter your Two-Factor code to proceed.</p>
						<b-field>
							<b-input v-model="mfaCode"
								placeholder="Your MFA Code"
								type="text"
								@keyup.enter.native="mfa"/>
							<p class="control">
								<button :class="{ 'is-loading': isLoading }"
									class="button is-primary"
									@click="mfa">Submit</button>
							</p>
						</b-field>
					</div>
				</div>
			</div>
		</b-modal>
		-->
	</section>
</template>

<script>
import { mapState } from 'vuex';

export default {
	name: 'Login',
	data() {
		return {
			username: null,
			password: null,
			mfaCode: null,
			isMfaModalActive: false,
			isLoading: false,
		};
	},
	computed: mapState(['config', 'auth']),
	metaInfo() {
		return { title: 'Login' };
	},
	created() {
		if (this.auth.loggedIn) {
			this.redirect();
		}
	},
	methods: {
		async login() {
			if (this.isLoading) return;

			const { username, password } = this;
			if (!username || !password) {
				this.$notifier.error('Please fill both fields before attempting to log in.');
				return;
			}

			try {
				this.isLoading = true;
				await this.$store.dispatch('auth/login', { username, password });
				if (this.auth.loggedIn) {
					this.redirect();
				}
			} catch (e) {
				this.$notifier.error(e.message);
			} finally {
				this.isLoading = false;
			}
		},
		/*
		mfa() {
			if (!this.mfaCode) return;
			if (this.isLoading) return;
			this.isLoading = true;
			this.axios.post(`${this.$BASE_URL}/login/mfa`, { token: this.mfaCode })
				.then(res => {
					this.$store.commit('token', res.data.token);
					this.redirect();
				})
				.catch(err => {
					this.isLoading = false;
					this.$onPromiseError(err);
				});
		}, */
		redirect() {
			if (typeof this.$route.query.redirect !== 'undefined') {
				this.$router.push(this.$route.query.redirect);
				return;
			}
			this.$router.push('/dashboard');
		},
	},
};
</script>
