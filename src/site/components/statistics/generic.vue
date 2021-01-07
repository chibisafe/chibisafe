<template>
	<div>
		<div class="columns is-mobile">
			<div class="column is-2">
				{{ title }}
			</div>
			<div class="column">
				{{ value }}
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
			'type': [Number, String],
			'default': null
		}
	}
};
</script>
