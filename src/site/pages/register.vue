<style lang="scss" scoped>
	@import '~/assets/styles/_colors.scss';
</style>

<template>
	<section id="register"
		class="hero is-fullheight">
		<Navbar/>
		<div class="hero-body">
			<div class="container">
				<h1 class="title">
					Dashboard Access
				</h1>
				<h2 class="subtitle">
					Register for a new account
				</h2>
				<div class="columns">
					<div class="column is-4">
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
							<a :class="{ 'is-loading': isLoading }"
								class="button is-themed"
								@click="register">Register</a>
						</p>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script>
import Navbar from '~/components/navbar/Navbar.vue';

export default {
	name: 'Register',
	components: { Navbar },
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
			if (this.password !== this.rePassword) {
				this.$showToast('Passwords don\'t match', true);
				return;
			}
			this.isLoading = true;

			try {
				const response = await this.$axios.$post(`auth/register`, {
					username: this.username,
					password: this.password
				});
				this.$showToast(response.message);
				return this.$router.push('/login');
			} catch (error) {
				this.$onPromiseError(error);
			} finally {
				this.isLoading = false;
			}
		}
	}
};
</script>
