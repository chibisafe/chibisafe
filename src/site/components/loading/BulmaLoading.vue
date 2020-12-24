<template>
	<div class="loader-wrapper">
		<div class="loader is-loading" />
	</div>
</template>

<style lang="scss" scoped>
	.loader-wrapper {
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
		background: #fff;
		opacity: 0;
		z-index: -1;
		transition: opacity .3s;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 6px;

			.loader {
				height: 80px;
				width: 80px;
			}

		&.is-active {
			opacity: 1;
			z-index: 1;
		}
	}
</style>
