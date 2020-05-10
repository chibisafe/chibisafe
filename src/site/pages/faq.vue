<template>
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
</template>

<script>
export default {
	name: 'Faq',
	data() {
		return {};
	},
	metaInfo() {
		return { title: 'Faq' };
	}
};
</script>
<style lang="scss" scoped>
	@import '~/assets/styles/_colors.scss';
	article.message { background-color: #ffffff; }
</style>
