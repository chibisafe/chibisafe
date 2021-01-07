<template>
	<div>
		<div class="columns is-mobile">
			<div class="column is-2">
				{{ title }}
			</div>
			<div class="column">
				{{ (used / 1024 / 1024 / 1024).toFixed(2) }} GiB /
				{{ (total / 1024 / 1024 / 1024).toFixed(2) }} GiB ({{ ((used * 100) / total).toFixed(2) }}%)
			</div>
		</div>
	</div>
</template>
<script>
export default {
	props: {
		title: {
			'type': String,
			'default': null
		},
		used: {
			'type': Number,
			'default': null
		},
		total: {
			'type': Number,
			'default': null
		}
	}
};
</script>
