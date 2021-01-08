<template>
	<div>
		<div class="columns is-mobile">
			<div class="column is-2">
				{{ title }}
			</div>
			<div class="column">
				<b-table v-if="data.length" :data="data || []" :mobile-cards="true" narrowed class="details">
					<b-table-column v-slot="props" field="type" label="Type">
						{{ props.row.key }}
					</b-table-column>
					<b-table-column v-slot="props" field="count" label="Count">
						{{ props.row.value }}
					</b-table-column>
				</b-table>
				<template v-else>
					-
				</template>
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
		data: {
			'type': Array,
			'default': () => []
		}
	}
};
</script>
<style lang="scss" scoped>
	.details ::v-deep .table-wrapper {
		box-shadow: none;

		.table {
			border-radius: unset;
			background: #2A2E3C;
		}
	}
</style>
