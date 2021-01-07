<template>
	<div>
		<div class="columns">
			<div class="column is-2">
				{{ title }}
			</div>
			<div class="column">
				{{ parsedTime }}
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
	},
	computed: {
		parsedTime() {
			let seconds = this.value;
			const days = Math.floor(seconds / 86400);
			seconds %= 86400;
			let hours = Math.floor(seconds / 3600);
			seconds %= 3600;
			let minutes = Math.floor(seconds / 60);
			seconds %= 60;

			if (hours < 10) hours = `0${hours}`;
			if (minutes < 10) minutes = `0${minutes}`;
			if (seconds < 10) seconds = `0${seconds}`;

			if (days > 0) {
				return `${days}d ${hours}:${minutes}:${seconds}`;
			}
			return `${hours}:${minutes}:${seconds}`;
		}
	}
};
</script>
