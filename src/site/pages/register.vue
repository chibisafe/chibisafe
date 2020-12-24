<template>
	<section class="section is-fullheight is-register">
		<div class="container">
			<h1 class="title">
				Dashboard Access
			</h1>
			<h2 class="subtitle mb5">
				Register for a new account
			</h2>
			<div class="columns">
				<div class="column is-4 is-offset-4">
					<b-field>
						<b-input
							v-model="username"
							class="lolisafe-input"
							type="text"
							placeholder="Username" />
					</b-field>
					<b-field>
						<b-input
							v-model="password"
							class="lolisafe-input"
							type="password"
							placeholder="Password"
							password-reveal />
					</b-field>
					<b-field>
						<b-input
							v-model="rePassword"
							class="lolisafe-input"
							type="password"
							placeholder="Re-type Password"
							password-reveal
							@keyup.enter.native="register" />
					</b-field>

					<div class="level">
						<!-- Left side -->
						<div class="level-left">
							<div class="level-item">
								<router-link
									to="/login"
									class="is-text">
									Already have an account?
								</router-link>
							</div>
						</div>
						<!-- Right side -->
						<div class="level-right">
							<p class="level-item">
								<b-button
									size="is-medium"
									type="is-lolisafe"
									:disabled="isLoading"
									@click="register">
									Register
								</b-button>
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script>
import { mapState } from 'vuex';

export default {
	name: 'Register',
	data() {
		return {
			username: null,
			password: null,
			rePassword: null,
			isLoading: false
		};
	},
	computed: mapState(['config', 'auth']),
	metaInfo() {
		return { title: 'Register' };
	},
	methods: {
		async register() {
			if (this.isLoading) return;

			if (!this.username || !this.password || !this.rePassword) {
				this.$notifier.error('Please fill all fields before attempting to register.');
				return;
			}
			if (this.password !== this.rePassword) {
				this.$notifier.error('Passwords don\'t match');
				return;
			}
			this.isLoading = true;

			try {
				const response = await this.$store.dispatch('auth/register', {
					username: this.username,
					password: this.password
				});

				this.$notifier.success(response.message);
				this.$router.push('/login');
				return;
			} catch (error) {
				this.$notifier.error(error.message);
			} finally {
				this.isLoading = false;
			}
		}
	}
};
</script>
