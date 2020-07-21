<template>
	<div class="level-right">
		<div class="level-item">
			<b-field>
				<SearchInput
					ref="autocomplete"
					v-model="query"
					:data="filteredHints"
					:customSelector="handleSelect"
					field="name"
					class="lolisafe-input search"
					placeholder="Search"
					type="search"
					open-on-focus
					@typing="handleTyping">
					<template slot-scope="props">
						<b>{{ props.option.name }}:</b>
						<small>
							{{ props.option.valueFormat }}
						</small>
					</template>
				</SearchInput>
				<p class="control">
					<b-button type="is-lolisafe" @click="onSubmit">
						Search
					</b-button>
				</p>
			</b-field>
		</div>
	</div>
</template>

<script>
import SearchInput from '~/components/search-input/SearchInput.vue';

export default {
	components: {
		SearchInput,
	},
	data() {
		return {
			query: '',
			hints: [
				{
					'name': 'tag',
					'valueFormat': 'name',
					'hint': '',
				},
				{
					'name': 'album',
					'valueFormat': 'name',
					'hint': '',
				},
				{
					'name': 'before',
					'valueFormat': 'specific date',
					'hint': '',
				},
				{
					'name': 'during',
					'valueFormat': 'specific date',
					'hint': '',
				},
				{
					'name': 'after',
					'valueFormat': 'specific date',
					'hint': '',
				},
			],
			filteredHints: [],
		};
	},
	created() {
		this.filteredHints = this.hints; // fixes the issue where on pageload, suggestions wont load
	},
	methods: {
		handleSelect(selected, currentValue) {
			this.$refs.autocomplete.focus();
			if (!currentValue) { return `${selected.name}:`; }
			if (/[^:][\s|;|,]+$/gi.test(currentValue)) return `${currentValue}${selected.name}:`;
			return currentValue.replace(/\w+$/gi, `${selected.name}:`);
		},
		handleTyping(qry) {
			qry = qry || '';
			// get the last word or group of words
			const lastWord = (qry.match(/("[^"]*")|[^;, ]+/g) || ['']).pop().toLowerCase();
			// if there's an open/unbalanced quote, don't autosuggest
			if (/^[^"]*("[^"]*"[^"]*)*(")[^"]*$/.test(qry)) { this.filteredHints = []; return; }
			// don't autosuggest if we have an open query but no text yet
			if (/:[\s|;|,]?$/gi.test(qry)) { this.filteredHints = []; return; }
			// if the above query didn't match (all quotes are balanced
			// and the previous tag has value
			// check if we're about to start a new tag
			if (/[\s|;|,]+$/gi.test(qry)) { this.filteredHints = this.hints; return; }

			// if we got here, then we handled all special cases
			// now take last word, and check if we can autosuggest a tag
			this.filteredHints = this.hints.filter((hint) => hint.name
				.toString()
				.toLowerCase()
				.indexOf(lastWord) === 0);
		},
		sanitizeQuery(qry) {
			// \w+:\s+? to transform 'tag: 123' into 'tag:123'
		},
		onSubmit() {
			this.$emit('search', this.query);
		},
	},
};
</script>

<style lang="scss" scoped>
	.search {
		::v-deep .dropdown-content {
			background-color: #323846;
		}
	}
</style>
