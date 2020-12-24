<style lang="scss" scoped>
@import "~/assets/styles/_colors.scss";
	h2 {
		font-weight: 100;
		color: $textColor;
		font-size: 4em;
		text-align: center;
	}
</style>

<template>
	<section class="hero is-fullheight">
		<Navbar :isWhite="true" />
		<div class="hero-body">
			<div class="container">
				<h2>404エラ</h2>
			</div>
		</div>
	</section>
</template>

<script>
import Navbar from '~/components/navbar/Navbar.vue';

export default {
	components: { Navbar }
};
</script>
