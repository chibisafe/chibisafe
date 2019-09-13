<style lang="scss" scoped>
	@import '~/assets/styles/_colors.scss';
	article.message { background-color: #ffffff; }
</style>

<template>
	<section id="login"
		class="hero is-fullheight">
		<Navbar />
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
			</div>
		</div>
	</section>
</template>

<script>
import Navbar from '~/components/navbar/Navbar.vue';

export default {
	name: 'Faq',
	components: { Navbar },
	data() {
		return {};
	},
	metaInfo() {
		return { title: 'Faq' };
	}
};
</script>
