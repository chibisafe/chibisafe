<template>
	<div>
		<div class="columns">
			<div class="column is-2">
				{{ title }}
			</div>
			<div class="column">
				<b-table :data="data || []" :mobile-cards="true">
					<b-table-column v-slot="props" field="type" label="Type">
						{{ props.row.key }}
					</b-table-column>
					<b-table-column v-slot="props" field="count" label="Count">
						{{ props.row.value }}
					</b-table-column>
				</b-table>
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
