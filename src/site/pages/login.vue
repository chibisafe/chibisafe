<style lang="scss" scoped>
	@import '~/assets/styles/_colors.scss';
</style>

<template>
	<section id="login"
		class="hero is-fullheight">
		<Navbar/>
		<div class="hero-body">
			<div class="container">
				<h1 class="title">
					Dashboard Access
				</h1>
				<h2 class="subtitle">
					Login or register
				</h2>
				<div class="columns">
					<div class="column is-4">
						<b-field>
							<b-input v-model="username"
								type="text"
								placeholder="Username"
								@keyup.enter.native="login" />
						</b-field>
						<b-field>
							<b-input v-model="password"
								type="password"
								placeholder="Password"
								password-reveal
								@keyup.enter.native="login" />
						</b-field>

						<p class="control has-addons is-pulled-right">
							<router-link v-if="config.enableAccounts"
								to="/register"
								class="is-text">Don't have an account?</router-link>
							<span v-else>Registration is closed at the moment</span>
							<a id="loginBtn"
								class="button"
								@click="login">Log in</a>
						</p>
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
import Navbar from '~/components/navbar/Navbar.vue';

export default {
	name: 'Login',
	components: { Navbar },
	data() {
		return {
			username: null,
			password: null,
			mfaCode: null,
			isMfaModalActive: false,
			isLoading: false
		};
	},
	computed: {
		config() {
			return this.$store.state.config;
		}
	},
	metaInfo() {
		return { title: 'Login' };
	},
	methods: {
		login() {
			if (this.isLoading) return;
			if (!this.username || !this.password) {
				this.$showToast('Please fill both fields before attempting to log in.', true);
				return;
			}
			this.isLoading = true;
			this.axios.post(`${this.config.baseURL}/auth/login`, {
				username: this.username,
				password: this.password
			}).then(res => {
				this.$store.commit('token', res.data.token);
				this.$store.commit('user', res.data.user);
				/*
				if (res.data.mfa) {
					this.isMfaModalActive = true;
					this.isLoading = false;
				} else {
					this.getUserData();
				}
				*/
				this.redirect();
			}).catch(err => {
				this.isLoading = false;
				this.$onPromiseError(err);
			});
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
		},*/
		redirect() {
			this.$store.commit('loggedIn', true);
			if (typeof this.$route.query.redirect !== 'undefined') {
				this.$router.push(this.$route.query.redirect);
				return;
			}
			this.$router.push('/dashboard');
		}
	}
};
</script>
