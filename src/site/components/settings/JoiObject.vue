<template>
	<div v-if="settings">
		<div v-for="[key, field] in Object.entries(settings)" :key="key">
			<b-field
				:label="field.flags.label"
				:message="getErrorMessage(key) || getMessage(field)"
				:type="getValidationType(key)"
				class="field"
				horizontal>
				<b-input
					v-if="getDisplayType(field) === 'string'"
					v-model="values[key]"
					class="chibisafe-input"
					expanded />
				<b-input
					v-else-if="getDisplayType(field) === 'number'"
					v-model="values[key]"
					type="number"
					class="chibisafe-input"
					:min="getMin(field)"
					:max="getMax(field)"
					expanded />
				<b-switch
					v-else-if="getDisplayType(field) === 'boolean'"
					v-model="values[key]"
					:rounded="false"
					:true-value="true"
					:false-value="false" />
				<!-- TODO: If array and has allowed items, limit input to those items only -->
				<b-taginput
					v-else-if="getDisplayType(field) === 'array' || getDisplayType(field) === 'tagInput'"
					v-model="values[key]"
					ellipsis
					icon="label"
					:placeholder="field.flags.label"
					class="taginp" />
				<div v-else-if="getDisplayType(field) === 'checkbox'">
					<b-checkbox v-for="item in getAllowedItems(field)" :key="item"
						v-model="values[key]"
						:native-value="item">
						{{ item }}
					</b-checkbox>
				</div>
			</b-field>
			<!--
				TODO: Add asterisk to required fields
			-->
		</div>
	</div>
</template>


<script>
export default {
	name: 'JoiObject',
	props: {
		settings: {
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
			values: {}
		};
	},
	created() {
		for (const [k, v] of Object.entries(this.settings)) {
			this.$set(this.values, k, v.value);
		}
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
		},
		getValidationType(fieldName) {
			if (Array.isArray(this.errors[fieldName])) return 'is-danger';
			return null;
		},
		getErrorMessage(fieldName) {
			if (Array.isArray(this.errors[fieldName])) return this.errors[fieldName].join('\n');
			return null;
		},
		getValues() {
			return this.values;
		},
		getMessage(field) {
			let msg = field.flags.description;
			if (field.notes?.length) {
				msg += field.notes.map(note => `\n${note}`);
			}
			return msg;
		}
	}
};
</script>
<style lang="scss" scoped>
	@import '~/assets/styles/_colors.scss';

	.field {
		margin-bottom: 1em;

		::v-deep .help {
			font-size: 12px;
			white-space: pre-line;
		}
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
