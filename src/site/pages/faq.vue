<template>
	<!-- eslint-disable max-len -->
	<div class="container has-text-left">
		<h2 class="subtitle">
			What is Toshokan?
		</h2>
		<article class="message">
			<div class="message-body">
				Toshokan(図書館) means 'library' in Japanese. Toshokan is a private file hosting website for myself and a few select friends.
			</div>
		</article>

		<h2 class="subtitle">
			Can I run my own Toshokan?
		</h2>
		<article class="message">
			<div class="message-body">
				<a target="_blank" href="https://github.com/WeebDev/toshokan">GitHub repo</a> for 'chibisafe', which Toshokan runs on. Follow the instructions to clone, build and deploy it yourself.
			</div>
		</article>

		<h2 class="subtitle">
			Why should I use this?
		</h2>
		<article class="message">
			<div class="message-body">
				You can't and you don't :)
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
	head() {
		return {
			title: 'FAQ'
		};
	}
};
</script>

<style lang="scss" scoped>
	@import '~/assets/styles/_colors.scss';
	article.message { background-color: #5F5A5A; }
	.message-body { color: $textColor; }
</style>
