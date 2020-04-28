<template>
	<section class="hero is-fullheight is-register">
		<div class="hero-body">
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
							<b-input v-model="username"
								type="text"
								placeholder="Username" />
						</b-field>
						<b-field>
							<b-input v-model="password"
								type="password"
								placeholder="Password"
								password-reveal />
						</b-field>
						<b-field>
							<b-input v-model="rePassword"
								type="password"
								placeholder="Re-type Password"
								password-reveal
								@keyup.enter.native="register" />
						</b-field>

						<p class="control has-addons is-pulled-right">
							<router-link to="/login"
								class="is-text">Already have an account?</router-link>
							<button class="button is-primary big ml1"
								:disabled="isLoading"
								@click="register">Register</button>
						</p>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script>
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
	computed: {
		config() {
			return this.$store.state.config;
		}
	},
	metaInfo() {
		return { title: 'Register' };
	},
	methods: {
		async register() {
			if (this.isLoading) return;
			if (!this.username || !this.password || !this.rePassword) {
				this.$store.dispatch('alert', {
					text: 'Please fill all fields before attempting to register.',
					error: true
				});
				return;
			}
			if (this.password !== this.rePassword) {
				this.$store.dispatch('alert', {
					text: 'Passwords don\'t match',
					error: true
				});
				return;
			}
			this.isLoading = true;

			try {
				const response = await this.$axios.$post(`auth/register`, {
					username: this.username,
					password: this.password
				});

				this.$store.dispatch('alert', { text: response.message });
				return this.$router.push('/login');
			} catch (error) {
				//
			} finally {
				this.isLoading = false;
			}
		}
	}
};
</script>
