<template>
	<div class="level-right">
		<div class="level-item">
			<b-field>
				<SearchInput
					ref="autocomplete"
					v-model="query"
					:data="filteredHints"
					:custom-selector="handleSelect"
					field="name"
					class="toshokan-input search"
					placeholder="Search"
					type="search"
					open-on-focus
					@typing="handleTyping"
					@keydown.native.enter="onSubmit">
					<template slot-scope="props">
						<b>{{ props.option.name }}:</b>
						<small>
							{{ props.option.valueFormat }}
						</small>
					</template>
				</SearchInput>
				<p class="control">
					<b-button type="is-toshokan" @click="onSubmit">
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
		SearchInput
	},
	props: {
		hiddenHints: {
			'type': Array,
			'default': () => []
		}
	},
	data() {
		return {
			query: '',
			hints: [
				{
					name: 'tag',
					valueFormat: 'name',
					hint: ''
				},
				{
					name: 'album',
					valueFormat: 'name',
					hint: ''
				},
				{
					name: 'before',
					valueFormat: 'specific date',
					hint: ''
				},
				{
					name: 'during',
					valueFormat: 'specific date',
					hint: ''
				},
				{
					name: 'after',
					valueFormat: 'specific date',
					hint: ''
				},
				{
					name: 'file',
					valueFormat: 'generated name',
					hint: ''
				}
			],
			filteredHints: []
		};
	},
	created() {
		this.hints = this.hints.filter(({ name }) => this.hiddenHints.indexOf(name) === -1);
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
			let lastWord = (qry.match(/("[^"]*")|[^\s]+/g) || ['']).pop().toLowerCase();
			// if there's an open/unbalanced quote, don't autosuggest
			if (/^[^"]*("[^"]*"[^"]*)*(")[^"]*$/.test(qry)) {
				this.filteredHints = [];
				return;
			}
			// don't autosuggest if we have an open query but no text yet
			if (/:\s+$/gi.test(qry)) {
				this.filteredHints = [];
				return;
			}
			// if the above query didn't match (all quotes are balanced
			// and the previous tag has value
			// check if we're about to start a new tag
			if (/\s+$/gi.test(qry)) {
				this.filteredHints = this.hints;
				return;
			}

			// ignore starting `-` from lastword, because - is used to
			// exclude something, so -alb should autosuggest album
			lastWord = lastWord.replace(/^-/, '');

			// if we got here, then we handled all special cases
			// now take last word, and check if we can autosuggest a tag
			this.filteredHints = this.hints.filter(hint => hint.name
				.toString()
				.toLowerCase()
				.indexOf(lastWord) === 0);
		},
		onSubmit(event) {
			if (event.key === 'Enter') {
				if (/:$/gi.test(this.query)) { return; }
			}
			this.$emit('search', this.query, event);
		}
	}
};
</script>

<style lang="scss" scoped>
	.search {
		::v-deep .dropdown-content {
			background-color: #323846;
		}
	}
</style>
