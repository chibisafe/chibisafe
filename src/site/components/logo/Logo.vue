<template>
	<img src="~/assets/images/logo.png">
</template>
<style lang="scss" scoped>
	img {
		height: 384px;
		animation: rotate 5s infinite linear;
		//animation-timing-function: cubic-bezier(0, 0.71, 0.29, 1);
	}

	@keyframes rotate {
		0% {
			transform: rotate(360deg);
		}
		100% {
			transform: rotate(0deg);
		}
	}
</style>
