<style lang="scss" scoped>
	@import "~/assets/styles/_colors.scss";
	div.home {
		color: $textColor;
		.columns {
			.column {
				&.centered {
					display: flex;
					align-items: center;
				}
			}
		}

		h4 {
			color: $textColorHighlight;
			margin-bottom: 1em;
		}

		p {
			font-size: 1.25em;
			font-weight: 600;
			line-height: 1.5;

			strong {
				color: $textColorHighlight;
			}
		}

		div.background {
			position: fixed;
			top: 0;
			left: 0;
			background: no-repeat scroll 50% 50%;
			background-size: cover;
			background-image: url('~assets/images/background.jpg');
			z-index: -1;
			height: 100vh;
			width: 100%;
			pointer-events: none;
		}
	}
</style>

<template>
	<div class="home">
		<section class="hero is-fullheight has-text-centered">
			<div class="background" />
			<Navbar :isWhite="true" />
			<div class="hero-body">
				<div class="container">
					<div class="columns">
						<div class="column is-3 is-offset-2">
							<div class="logo">
								<Logo />
							</div>
						</div>
						<div class="column is-5 centered">
							<div class="content-wrapper">
								<h4>Blazing fast file uploader. For real.</h4>
								<p>
									A <strong>modern</strong> and <strong>self-hosted</strong> file upload service that can handle anything you throw at it. Fast uploads, file manager and sharing capabilities all crafted with a beautiful user experience in mind.
								</p>
							</div>
						</div>
					</div>
					<div class="spacer mt7" />
					<Uploader v-if="config.publicMode || (!config.publicMode && loggedIn)" />
					<div v-else>
						This site has disabled public uploads. You need an account.
					</div>
				</div>
			</div>
			<div class="hero-foot">
				<div class="container">
					<Links />
				</div>
			</div>
		</section>
	</div>
</template>

<script>
import Navbar from '~/components/navbar/Navbar.vue';
import Logo from '~/components/logo/Logo.vue';
import Uploader from '~/components/uploader/Uploader.vue';
import Links from '~/components/home/links/Links.vue';

export default {
	name: 'Home',
	components: {
		Navbar,
		Logo,
		Uploader,
		Links
	},
	data() {
		return { albums: [] };
	},
	computed: {
		loggedIn() {
			return this.$store.state.loggedIn;
		},
		config() {
			return this.$store.state.config;
		}
	}
};
</script>
