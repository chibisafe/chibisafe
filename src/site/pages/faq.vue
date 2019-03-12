<style lang="scss" scoped>
	@import '~/assets/styles/_colors.scss';
</style>

<template>
	<section id="login"
		class="hero is-fullheight">
		<Navbar/>
		<div class="hero-body">
			<div class="container has-text-left">

				<h2 class="subtitle">What is lolisafe?</h2>
				<article class="message">
					<div class="message-body">
						lolisafe is an easy to use, open source and completely free file upload service. We accept your files, photos, documents, anything, and give you back a shareable link for you to send to others.
					</div>
				</article>

				<h2 class="subtitle">Can I run my own lolisafe?</h2>
				<article class="message">
					<div class="message-body">
						Definitely. Head to <a target="_blank" href="https://github.com/WeebDev/lolisafe">our GitHub repo</a> and follow the instructions to clone, build and deploy it by yourself. It's super easy too!
					</div>
				</article>

				<h2 class="subtitle">How can I keep track of my uploads?</h2>
				<article class="message">
					<div class="message-body">
						Simply create a user on the site and every upload will be associated with your account, granting you access to your uploaded files through our dashboard.
					</div>
				</article>

				<h2 class="subtitle">What are albums?</h2>
				<article class="message">
					<div class="message-body">
						Albums are a simple way of sorting uploads together. Right now you can create albums through the dashboard and use them only with <a target="_blank" href="https://chrome.google.com/webstore/detail/loli-safe-uploader/enkkmplljfjppcdaancckgilmgoiofnj">our chrome extension</a> which will enable you to <strong>right click -&gt; send to lolisafe</strong> or to a desired album if you have any.
					</div>
				</article>

				<h2 class="subtitle">Why should I use this?</h2>
				<article class="message">
					<div class="message-body">
						There are too many file upload services out there, and a lot of them rely on the foundations of pomf which is ancient. In a desperate and unsuccessful attempt of finding a good file uploader that's easily extendable, lolisafe was born. We give you control over your files, we give you a way to sort your uploads into albums for ease of access and we give you an api to use with ShareX or any other thing that let's you make POST requests.
					</div>
				</article>

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
