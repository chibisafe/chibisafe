<style lang="scss" scoped>
	@import '../../styles/colors.scss';

	a.is-themed {
		background: $basePink;
		color: #fafafa;
		border: none;
	}

	a.is-themed:hover {
		background: $basePinkHover;
		border: none;
	}

	body.kpop a.is-themed { background: $baseBlue; }
	body.kpop a.is-themed:hover { background: $baseBlueHover; }

	a.is-text {
		display: inline-flex;
		padding-top: 4px;
		color: #fafafa;
	}

	a.is-text:hover { color: $basePink; }
	body.kpop a.is-text:hover { color: $baseBlue; }

	a.text { color: white }
	a.text:hover { color: #FF015B; }

	input, p.control a.button {
		border-left: 0px;
			border-top: 0px;
			border-right: 0px;
			border-radius: 0px;
			box-shadow: 0 0 0;
	}

	p.control a.button { margin-left: 10px; }
	p.control a.button:hover { border-bottom: 1px solid #FF015B; }
	p.control a#loginBtn { border-right: 0px; }
	p.control a#registerBtn { border-left: 0px; }

	span.errorMessage {
		display: block;
		padding-top: 50px;
		color: #FF015B;
	}

	section.hero {
		overflow: hidden;
	}

	section.hero, section.hero > * {
		position: relative;
	}

	section.hero div.background {
		content: '';
		position: fixed;
		top: -50px;
		left: -50px;
		background: no-repeat scroll 50% 50%;
		background-size: cover;
		background-image: url(../../../public/images/home-background.jpg);
		filter: blur(25px);
		-webkit-filter: blur(25px);
		z-index: 0;
		height: calc(100vh + 100px);
		width: calc(100% + 100px);
	}

	h3 {
		color: #c7c7c7;
		margin-bottom: 10px;
	}
</style>

<template>
	<section class="hero is-fullheight has-text-centered">
		<div class="background"/>

		<div class="hero-body">
			<div class="container">
				<router-link to="/">
					<div class="logo">
						<Logo/>
					</div>
				</router-link>

				<h3>Please choose a new password for your account.</h3>
				<div class="columns">
					<div class="column is-4 is-offset-4">
						<b-field>
							<b-input v-model="password"
								type="password"
								placeholder="Password"
								password-reveal/>
						</b-field>
						<b-field>
							<b-input v-model="rePassword"
								type="password"
								placeholder="Re-type Password"
								password-reveal
								@keyup.enter.native="change"/>
						</b-field>

						<p class="control has-addons is-pulled-right">
							<a :class="{ 'is-loading': isLoading }"
								class="button is-themed"
								@click="change">Request Password Change</a>
						</p>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script>
import Logo from '../../components/logo/Logo.vue';

export default {
	components: { Logo },
	props: {
		key: {
			type: String,
			default: null
		},
		email: {
			type: String,
			default: null
		}
	},
	data() {
		return {
			password: null,
			rePassword: null,
			isLoading: false
		};
	},
	mounted() {
		this.$ga.page({
			page: '/login/change',
			title: 'Change Password',
			location: window.location.href
		});

		if (!this.key || !this.email) {
			this.$showToast('Data is missing.', true);
			this.$router.push('/');
		}
	},
	methods: {
		async change() {
			if (this.isLoading) return;
			if (this.password !== this.rePassword) {
				this.$showToast('Passwords don\'t match', true);
				return;
			}
			this.isLoading = true;

			try {
				const response = await this.axios.post(`${this.$config.baseURL}/password/verify`, {
					password: this.password,
					verificationKey: this.key,
					email: this.email
				});
				this.$showToast(response.data.message);
				this.isLoading = false;
				this.$router.push('/login');
			} catch (error) {
				this.isLoading = false;
				this.$onPromiseError(error);
			}
		}
	}
};
</script>
