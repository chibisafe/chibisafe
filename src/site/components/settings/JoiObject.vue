<template>
	<div v-if="keys">
		<div v-for="[key, field] in Object.entries(keys)" :key="key">
			<b-field
				:label="field.flags.label"
				:message="field.flags.description"
				class="field"
				horizontal>
				<b-input
					v-if="getDisplayType(field) === 'string'"
					v-model="settings.serviceName"
					class="chibisafe-input"
					expanded />
				<b-input
					v-else-if="getDisplayType(field) === 'number'"
					v-model="settings.serviceName"
					type="number"
					class="chibisafe-input"
					:min="getMin(field)"
					:max="getMax(field)"
					expanded />
				<b-switch
					v-else-if="getDisplayType(field) === 'boolean'"
					v-model="settings.publicMode"
					:rounded="false"
					:true-value="true"
					:false-value="false" />
				<!-- TODO: If array and has allowed items, limit input to those items only -->
				<b-taginput
					v-else-if="getDisplayType(field) === 'array' || getDisplayType(field) === 'tagInput'"
					v-model="settings.arr"
					ellipsis
					icon="label"
					:placeholder="field.flags.label"
					aria-close-label="Delete this tag"
					class="taginp" />
				<div v-else-if="getDisplayType(field) === 'checkbox'">
					<b-checkbox v-for="item in getAllowedItems(field)" :key="item"
						v-model="settings.ech"
						:native-value="item">
						{{ item }}
					</b-checkbox>
				</div>
			</b-field>
			<!--
				TODO: Add asterisk to required fields
				TODO: Implement showing errors returned by backend/joi
			-->
		</div>
	</div>
</template>


<script>
export default {
	name: 'JoiObject',
	props: {
		keys: {
			type: Object,
			required: true
		},
		values: {
			type: Object,
			required: true
		},
		errors: {
			'type': Object,
			'default': () => ({})
		}
	},
	data() {
		return {
			fields: null, // keys + values combined
			settings: {
				ech: []
			}
		};
	},
	mounted() {

	},
	methods: {
		getMin(field) {
			if (field.type !== 'number') return;

			for (const rule of field.rules) {
				if (rule.name === 'greater') return rule.args.limit + 1;
				if (rule.name === 'min') return rule.args.limit;
			}
		},
		getMax(field) {
			if (field.type !== 'number') return;

			for (const rule of field.rules) {
				if (rule.name === 'less') return rule.args.limit - 1;
				if (rule.name === 'max') return rule.args.limit;
			}
		},
		getDisplayType(field) {
			if (!field.metas) return field.type;

			const foundMeta = field.metas.find(e => e.displayType);

			if (foundMeta) return foundMeta.displayType;

			return field.type;
		},
		getAllowedItems(field) {
			if (!field.items) return [];

			return field.items.reduce((acc, item) => {
				if (!item.allow) return acc;

				return [...acc, ...item.allow];
			}, []);
		}
	}
};
</script>
<style lang="scss" scoped>
	@import '~/assets/styles/_colors.scss';

	.field {
		margin-bottom: 1em;
	}

	.taginp {
		::v-deep {
			.taginput-container {
				border-color: #585858;
			}

			.input::placeholder {
				color: $textColor;
			}

			.taginput-container, .control, .input  {
				background-color: transparent;
			}
		}
	}
</style>
