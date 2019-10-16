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
				<h2 class="subtitle">Was ist das?</h2>
				<article class="message">
					<div class="message-body">
						Rahnserver ist ein fork des Projekts <a target="_blank" href="https://github.com/WeebDev/lolisafe">lolisafe</a>
					</div>
				</article>

				<h2 class="subtitle">Kann ich das selber hosten?</h2>
				<article class="message">
					<div class="message-body">
						Ja. gehe zu <a target="_blank" href="https://github.com/WeebDev/lolisafe">lolisafe's github repo</a> und folge dort den Anweisungen.
					</div>
				</article>

				<h2 class="subtitle">Wo kann ich meine Uploads sehen?</h2>
				<article class="message">
					<div class="message-body">
						Dazu musst du dich lediglich anmelden. Deine Dateien erscheinen auf dem Dashboard.
					</div>
				</article>

				<h2 class="subtitle">Was sind Alben?</h2>
				<article class="message">
					<div class="message-body">
						Mit Alben kannst du deine Uploads einfach gruppieren und eine Anzahl an Dateien mit einem Link teilen.
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
