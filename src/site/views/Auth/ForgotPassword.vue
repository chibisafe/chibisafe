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

				<h3>To request a new password please enter your account email in the box below. <br>We will send you an email with further instructions.</h3>
				<div class="columns">
					<div class="column is-4 is-offset-4">
						<b-field>
							<b-input v-model="email"
								type="text"
								placeholder="Email"/>
						</b-field>

						<p class="control has-addons is-pulled-right">
							<a :class="{ 'is-loading': isLoading }"
								class="button is-themed"
								@click="request">Request Password Change</a>
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
	name: 'ForgotPassword',
	components: { Logo },
	data() {
		return {
			email: null,
			isLoading: false
		};
	},
	metaInfo() {
		return { title: 'Forgot password' };
	},
	mounted() {
		this.$ga.page({
			page: '/login/forgot',
			title: 'Forgot Password',
			location: window.location.href
		});
	},
	methods: {
		request() {
			if (this.isLoading) return;
			if (!this.email || this.email === '') {
				this.$showToast('Email can\'t be empty', true);
				return;
			}
			this.isLoading = true;
			this.axios.post(`${this.$config.baseURL}/password/forgot`, { email: this.email }).then(response => {
				this.$showToast(response.data.message);
				this.isLoading = false;
				return this.$router.push('/login');
			}).catch(err => {
				this.isLoading = false;
				this.$onPromiseError(err);
			});
		}
	}
};
</script>
