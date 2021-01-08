<template>
	<div>
		<div class="columns">
			<div class="column is-2">
				{{ title }}
			</div>
			<div class="column">
				{{ (value / 1024 / 1024 / 1024).toFixed(2) }} GiB
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
		value: {
			'type': Number,
			'default': null
		}
	}
};
</script>
