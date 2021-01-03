<template>
	<img src="~/assets/images/logo.png">
</template>
<style lang="scss" scoped>
	img {
		height: 376px;
		animation-delay: 0.5s;
		animation-duration: 1.5s;
		animation-fill-mode: both;
		animation-name: floatUp;
		animation-timing-function: cubic-bezier(0, 0.71, 0.29, 1);
	}

	@keyframes floatUp {
		0% {
			opacity: 0;
			transform: scale(0.86);
		}
		25% { opacity: 100; }
		67% {
			transform: scale(1);
		}
		100% {
			transform: scale(1);
		}
	}
</style>
