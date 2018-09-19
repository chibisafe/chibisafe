<style>
	.waterfall-item {
		position: absolute;
	}
</style>
<template>
	<div class="waterfall-item">
		<slot />
	</div>
</template>
<script>
import imagesLoaded from 'imagesloaded';
export default {
	name: 'WaterfallItem',
	props: {
		order: {
			type: Number,
			default: 0
		},
		width: {
			type: Number,
			default: 150
		}
	},
	data() {
		return {
			itemWidth: 0,
			height: 0
		};
	},
	created() {
		this.$watch(() => this.height, this.emit);
	},
	mounted() {
		this.$el.style.display = 'none';
		this.$el.style.width = `${this.width}px`;
		this.emit();
		imagesLoaded(this.$el, () => {
			this.$el.style.left = '-9999px';
			this.$el.style.top = '-9999px';
			this.$el.style.display = 'block';
			this.height = this.$el.offsetHeight;
			this.itemWidth = this.$el.offsetWidth;
		});
	},
	methods: {
		emit() {
			this.$parent.$emit('itemRender');
		},
		getMeta() {
			return {
				el: this.$el,
				height: this.height,
				width: this.itemWidth,
				order: this.order
			};
		}
	}
}
</script>
