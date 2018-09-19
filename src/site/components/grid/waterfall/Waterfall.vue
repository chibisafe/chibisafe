<style>
	.waterfall {
		position: relative;
	}
</style>
<template>
	<div class="waterfall">
		<slot />
	</div>
</template>
<script>
// import {quickSort, getMinIndex, _, sum} from './util'

const quickSort = (arr, type) => {
	const left = [];
	const right = [];
	if (arr.length <= 1) {
		return arr;
	}
	const povis = arr[0];
	for (let i = 1; i < arr.length; i++) {
		if (arr[i][type] < povis[type]) {
			left.push(arr[i]);
		} else {
			right.push(arr[i]);
		}
	}
	return quickSort(left, type).concat(povis, quickSort(right, type))
};

const getMinIndex = arr => {
	let pos = 0;
	for (let i = 0; i < arr.length; i++) {
		if (arr[pos] > arr[i]) {
			pos = i;
		}
	}
	return pos;
};

const _ = {
	on(el, type, func, capture = false) {
		el.addEventListener(type, func, capture);
	},
	off(el, type, func, capture = false) {
		el.removeEventListener(type, func, capture);
	}
};

const sum = arr => arr.reduce((sum, val) => sum + val);
export default {
	name: 'Waterfall',
	props: {
		gutterWidth: {
			type: Number,
			default: 0
		},
		gutterHeight: {
			type: Number,
			default: 0
		},
		resizable: {
			type: Boolean,
			default: true
		},
		align: {
			type: String,
			default: 'center'
		},
		fixWidth: {
			type: Number
		},
		minCol: {
			type: Number,
			default: 1
		},
		maxCol: {
			type: Number
		},
		percent: {
			type: Array
		}
	},
	data() {
		return {
			timer: null,
			colNum: 0,
			lastWidth: 0,
			percentWidthArr: []
		};
	},
	created() {
		this.$on('itemRender', () => {
			if (this.timer) {
				clearTimeout(this.timer);
			}
			this.timer = setTimeout(() => {
				this.render();
			}, 0);
		});
	},
	mounted() {
		this.resizeHandle();
		this.$watch('resizable', this.resizeHandle);
	},
	methods: {
		calulate(arr) {
			let pageWidth = this.fixWidth ? this.fixWidth : this.$el.offsetWidth;
			// 百分比布局计算
			if (this.percent) {
				this.colNum = this.percent.length;
				const total = sum(this.percent);
				this.percentWidthArr = this.percent.map(value => (value / total) * pageWidth);
				this.lastWidth = 0;
			// 正常布局计算
			} else {
				this.colNum = parseInt(pageWidth / (arr.width + this.gutterWidth));
				if (this.minCol && this.colNum < this.minCol) {
					this.colNum = this.minCol;
					this.lastWidth = 0;
				} else if (this.maxCol && this.colNum > this.maxCol) {
					this.colNum = this.maxCol;
					this.lastWidth = pageWidth - (arr.width + this.gutterWidth) * this.colNum + this.gutterWidth;
				} else {
					this.lastWidth = pageWidth - (arr.width + this.gutterWidth) * this.colNum + this.gutterWidth;
				}
			}
		},
		resizeHandle() {
			if (this.resizable) {
				_.on(window, 'resize', this.render, false);
			} else {
				_.off(window, 'resize', this.render, false);
			}
		},
		render() {
			// 重新排序
			let childArr = [];
			childArr = this.$children.map(child => child.getMeta());
			childArr = quickSort(childArr, 'order');
			// 计算列数
			this.calulate(childArr[0])
			let offsetArr = Array(this.colNum).fill(0);
			// 渲染
			childArr.forEach(child => {
				let position = getMinIndex(offsetArr);
				// 百分比布局渲染
				if (this.percent) {
					let left = 0;
					child.el.style.width = `${this.percentWidthArr[position]}px`;
					if (position === 0) {
						left = 0;
					} else {
						for (let i = 0; i < position; i++) {
							left += this.percentWidthArr[i];
						}
					}
					child.el.style.left = `${left}px`;
				// 正常布局渲染
				} else {
					if (this.align === 'left') { // eslint-disable-line no-lonely-if
						child.el.style.left = `${position * (child.width + this.gutterWidth)}px`;
					} else if (this.align === 'right') {
						child.el.style.left = `${position * (child.width + this.gutterWidth) + this.lastWidth}px`;
					} else {
						child.el.style.left = `${position * (child.width + this.gutterWidth) + this.lastWidth / 2}px`;
					}
				}
				if (child.height === 0) {
					return;
				}
				child.el.style.top = `${offsetArr[position]}px`;
				offsetArr[position] += (child.height + this.gutterHeight);
				this.$el.style.height = `${Math.max.apply(Math, offsetArr)}px`;
			});
			this.$emit('rendered', this);
		}
	}
};
</script>
