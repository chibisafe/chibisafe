<style lang="scss" scoped>
	@import '~/assets/styles/_colors.scss';
	#logo {
		-webkit-animation-delay: 0.5s;
		animation-delay: 0.5s;
		-webkit-animation-duration: 1.5s;
		animation-duration: 1.5s;
		-webkit-animation-fill-mode: both;
		animation-fill-mode: both;
		-webkit-animation-name: floatUp;
		animation-name: floatUp;
		-webkit-animation-timing-function: cubic-bezier(0, 0.71, 0.29, 1);
		animation-timing-function: cubic-bezier(0, 0.71, 0.29, 1);
		border-radius: 24px;
		display: inline-block;
		height: 240px;
		position: relative;
		vertical-align: top;
		width: 240px;
		box-shadow: 0 20px 60px rgba(10, 10, 10, 0.05), 0 5px 10px rgba(10, 10, 10, 0.1), 0 1px 1px rgba(10, 10, 10, 0.2);
		background: $backgroundAccent;
		pointer-events: none;
	}

	#logo img {
		height: 200px;
		margin-top: 20px;
	}

	@keyframes floatUp {
		0% {
			opacity: 0;
			box-shadow: 0 0 0 rgba(10, 10, 10, 0), 0 0 0 rgba(10, 10, 10, 0), 0 0 0 rgba(10, 10, 10, 0);
			-webkit-transform: scale(0.86);
			transform: scale(0.86);
		}
		25% { opacity: 100; }
		67% {
			box-shadow: 0 0 0 rgba(10, 10, 10, 0), 0 5px 10px rgba(10, 10, 10, 0.1), 0 1px 1px rgba(10, 10, 10, 0.2);
			-webkit-transform: scale(1);
			transform: scale(1);
		}
		100% {
			box-shadow: 0 20px 60px rgba(10, 10, 10, 0.05), 0 5px 10px rgba(10, 10, 10, 0.1), 0 1px 1px rgba(10, 10, 10, 0.2);
			-webkit-transform: scale(1);
			transform: scale(1);
		}
	}
</style>

<template>
	<p id="logo">
		<img src="~/assets/images/logo.png">
	</p>
</template>

<script>
export default {};
</script>
