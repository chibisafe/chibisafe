<template>
	<div class="section">
		<div class="container">
			<div class="columns">
				<div class="column is-3 is-offset-2">
					<div class="logo">
						<Logo />
					</div>
				</div>
				<div class="column is-5 centered">
					<div class="content-wrapper">
						<h4>Blazing fast file uploader. <br>For real.</h4>
						<p>
							A <strong>modern</strong> and <strong>self-hosted</strong> file upload service that can handle anything you throw at it. Fast uploads, file manager and sharing capabilities all crafted with a beautiful user experience in mind.
						</p>
					</div>
				</div>
			</div>
		</div>
		<div class="container uploader">
			<Uploader v-if="config.publicMode || (!config.publicMode && loggedIn)" />
			<div v-else
				class="has-text-centered is-size-4 has-text-danger">
				This site has disabled public uploads. You need an account.
			</div>
			<Links />
		</div>
	</div>
</template>
<script>
import { mapState, mapGetters } from 'vuex';

import Logo from '~/components/logo/Logo.vue';
import Uploader from '~/components/uploader/Uploader.vue';
import Links from '~/components/home/links/Links.vue';

export default {
	name: 'Home',
	components: {
		Logo,
		Uploader,
		Links
	},
	data() {
		return { albums: [] };
	},
	computed: {
		...mapGetters({ loggedIn: 'auth/isLoggedIn' }),
		...mapState(['config'])
	}
};
</script>
<style lang="scss" scoped>
	@import "~/assets/styles/_colors.scss";
	.container {
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
	}

	.uploader {
		margin-top: 2rem;
	}
</style>
