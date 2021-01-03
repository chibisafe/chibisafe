<template>
	<div ref="waterfall" class="waterfall">
		<WaterfallItem
			v-for="item in items"
			:key="item.id"
			:style="{ width: `${itemWidth}px`, marginBottom: `${gutterHeight}px` }"
			:width="itemWidth">
			<slot :item="item" />
		</WaterfallItem>
	</div>
</template>
<script>
import WaterfallItem from './WaterfallItem.vue';

const isBrowser = typeof window !== 'undefined';
// eslint-disable-next-line global-require
const Masonry = isBrowser ? window.Masonry || require('masonry-layout') : null;
const imagesloaded = isBrowser ? require('imagesloaded') : null;

export default {
	name: 'Waterfall',
	components: {
		WaterfallItem
	},
	props: {
		options: {
			'type': Object,
			'default': () => {}
		},
		items: {
			'type': Array,
			'default': () => []
		},
		itemWidth: {
			'type': Number,
			'default': 150
		},
		gutterWidth: {
			'type': Number,
			'default': 10
		},
		gutterHeight: {
			'type': Number,
			'default': 4
		}
	},
	mounted() {
		this.initializeMasonry();
		this.imagesLoaded();
	},
	updated() {
		this.performLayout();
		this.imagesLoaded();
	},
	unmounted() {
		this.masonry.destroy();
	},
	methods: {
		imagesLoaded() {
			const node = this.$refs.waterfall;
			imagesloaded(
				node,
				() => {
					this.masonry.layout();
				}
			);
		},
		performLayout() {
			const diff = this.diffDomChildren();
			if (diff.removed.length > 0) {
				this.masonry.remove(diff.removed);
				this.masonry.reloadItems();
			}
			if (diff.appended.length > 0) {
				this.masonry.appended(diff.appended);
				this.masonry.reloadItems();
			}
			if (diff.prepended.length > 0) {
				this.masonry.prepended(diff.prepended);
			}
			if (diff.moved.length > 0) {
				this.masonry.reloadItems();
			}
			this.masonry.layout();
		},
		diffDomChildren() {
			const oldChildren = this.domChildren.filter(element => Boolean(element.parentNode));
			const newChildren = this.getNewDomChildren();
			const removed = oldChildren.filter(oldChild => !newChildren.includes(oldChild));
			const domDiff = newChildren.filter(newChild => !oldChildren.includes(newChild));
			const prepended = domDiff.filter((newChild, index) => newChildren[index] === newChild);
			const appended = domDiff.filter(el => !prepended.includes(el));
			let moved = [];
			if (removed.length === 0) {
				moved = oldChildren.filter((child, index) => index !== newChildren.indexOf(child));
			}
			this.domChildren = newChildren;
			return {
				'old': oldChildren,
				'new': newChildren,
				removed,
				appended,
				prepended,
				moved
			};
		},
		initializeMasonry() {
			if (!this.masonry) {
				this.masonry = new Masonry(
					this.$refs.waterfall,
					{
						columnWidth: this.itemWidth,
						gutter: this.gutterWidth,
						...this.options
					}
				);
				this.domChildren = this.getNewDomChildren();
			}
		},
		getNewDomChildren() {
			const node = this.$refs.waterfall;
			const children = this.options && this.options.itemSelector
				? node.querySelectorAll(this.options.itemSelector)
				: node.children;
			return Array.prototype.slice.call(children);
		}
	}
};
</script>
