<template>
	<b-field label="Add some tags">
		<b-taginput
			:value="selectedTags"
			:data="filteredTags"
			class="lolisafe taginp"
			ellipsis
			icon="label"
			placeholder="Add a tag"
			autocomplete
			allow-new
			@typing="getFilteredTags"
			@add="tagAdded"
			@remove="tagRemoved" />
	</b-field>
</template>

<script>
import { mapState } from 'vuex';

export default {
	name: 'Taginfo',
	props: {
		imageId: {
			type: Number,
			default: 0
		},
		imageTags: {
			type: Array,
			default: () => []
		}
	},
	data() {
		return {
			filteredTags: []
		};
	},
	computed: {
		...mapState({
			tags: (state) => state.tags.tagsList
		}),
		selectedTags() { return this.imageTags.map((e) => e.name); },
		lowercaseTags() { return this.imageTags.map((e) => e.name.toLowerCase()); }
	},
	methods: {
		getFilteredTags(str) {
			this.filteredTags = this.tags.map((e) => e.name).filter((e) => {
				// check if the search string matches any of the tags
				const sanitezedTag = e.toString().toLowerCase();
				const matches = sanitezedTag.indexOf(str.toLowerCase()) >= 0;

				// check if this tag is already added to our image, to avoid duplicates
				if (matches) {
					const foundIndex = this.lowercaseTags.indexOf(sanitezedTag);
					if (foundIndex === -1) {
						return true;
					}
				}

				return false;
			});
		},
		async tagAdded(tag) {
			if (!tag) return;

			// normalize into NFC form (diactirics and moonrunes)
			// replace all whitespace with _
			// replace multiple __ with a single one
			tag = tag.normalize('NFC').replace(/\s/g, '_').replace(/_+/g, '_');

			const foundIndex = this.tags.findIndex(({ name }) => name === tag);

			if (foundIndex === -1) {
				await this.$handler.executeAction('tags/createTag', tag);
			}

			await this.$handler.executeAction('images/addTag', { fileId: this.imageId, tagName: tag });
		},
		tagRemoved(tag) {
			this.$handler.executeAction('images/removeTag', { fileId: this.imageId, tagName: tag });
		}
	}
};
</script>

<style lang="scss" scoped>
@import '~/assets/styles/_colors.scss';

.taginp {
	::v-deep .dropdown-content {
		background-color: #323846;
		box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
	}
}
</style>
