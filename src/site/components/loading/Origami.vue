<template>
	<div :style="styles"
		class="spinner spinner-origami">
		<div :style="innerStyles"
			class="spinner-inner loading">
			<span class="slice" />
			<span class="slice" />
			<span class="slice" />
			<span class="slice" />
			<span class="slice" />
			<span class="slice" />
		</div>
	</div>
</template>

<script>
export default {
	props: {
		size: {
			type: String,
			default: '40px'
		}
	},
	computed: {
		innerStyles() {
			let size = parseInt(this.size);
			return { transform: `scale(${(size / 60)})` };
		},
		styles() {
			return {
				width: this.size,
				height: this.size
			};
		}
	}
};
</script>

<style lang="scss" scoped>
@import '../../styles/colors.scss';

@for $i from 1 through 6 {
	@keyframes origami-show-#{$i}{
		from{
			transform: rotateZ(60* $i + deg) rotateY(-90deg) rotateX(0deg);
			border-left-color: #31855e;
		}
	}
	@keyframes origami-hide-#{$i}{
		to{
			transform: rotateZ(60* $i + deg) rotateY(-90deg) rotateX(0deg);
			border-left-color: #31855e;
		}
	}

	@keyframes origami-cycle-#{$i} {

		$startIndex: $i*5;
		$reverseIndex: (80 - $i*5);

		#{$startIndex * 1%} {
			transform: rotateZ(60* $i + deg) rotateY(90deg) rotateX(0deg);
			border-left-color: #31855e;
		}
		#{$startIndex + 5%},
		#{$reverseIndex * 1%} {
			transform: rotateZ(60* $i + deg) rotateY(0) rotateX(0deg);
			border-left-color: #41b883;
		}

		#{$reverseIndex + 5%},
		100%{
			transform: rotateZ(60* $i + deg) rotateY(90deg) rotateX(0deg);
			border-left-color: #31855e;
		}
	}
}

.spinner{
	display: flex;
	justify-content: center;
	align-items: center;
	* {
	line-height: 0;
	box-sizing: border-box;
	}
}
.spinner-inner{
	display: block;
	width: 60px;
	height: 68px;
	.slice {
		border-top: 18px solid transparent;
		border-right: none;
		border-bottom: 16px solid transparent;
		border-left: 30px solid #f7484e;
		position: absolute;
		top: 0px;
		left: 50%;
		transform-origin: left bottom;
		border-radius: 3px 3px 0 0;
	}

	@for $i from 1 through 6 {
		.slice:nth-child(#{$i}) {
			transform: rotateZ(60* $i + deg) rotateY(0deg) rotateX(0);
			animation: .15s linear .9 - $i*.08s origami-hide-#{$i} both 1;
		}
	}

	&.loading{
		@for $i from 1 through 6 {
			.slice:nth-child(#{$i}) {
				transform: rotateZ(60* $i + deg) rotateY(90deg) rotateX(0);
				animation: 2s origami-cycle-#{$i} linear infinite both;
			}
		}
	}

}
</style>
