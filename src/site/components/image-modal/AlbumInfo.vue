<template>
	<b-dropdown
		v-model="selectedOptions"
		multiple
		expanded
		scrollable
		inline
		aria-role="list"
		max-height="500px">
		<button slot="trigger" class="button is-primary" type="button">
			<span>Albums ({{ selectedOptions.length }})</span>
			<b-icon icon="menu-down" />
		</button>

		<b-dropdown-item
			v-for="album in orderedAlbums"
			:key="album.id"
			:value="album.id"
			aria-role="listitem"
			@click="handleClick(album.id)">
			<span>{{ album.name }}</span>
		</b-dropdown-item>
	</b-dropdown>
</template>

<script>
import { mapState } from 'vuex';

export default {
	name: 'Albuminfo',
	props: {
		imageId: {
			type: Number,
			default: 0
		},
		imageAlbums: {
			type: Array,
			default: () => []
		},
		albums: {
			type: Array,
			default: () => []
		}
	},
	data() {
		return {
			selectedOptions: [],
			orderedAlbums: []
		};
	},
	created() {
		this.orderedAlbums = this.getOrderedAlbums();
		// we're sorting here instead of computed because we want sort on creation
		// then the array's values should be frozen
		this.selectedOptions = this.imageAlbums.map((e) => e.id);
	},
	methods: {
		getOrderedAlbums() {
			return [...this.albums].sort(
				(a, b) => {
					const selectedA = this.imageAlbums.findIndex(({ name }) => name === a.name) !== -1;
					const selectedB = this.imageAlbums.findIndex(({ name }) => name === b.name) !== -1;

					if (selectedA !== selectedB) {
						return selectedA ? -1 : 1;
					}
					return a.name.localeCompare(b.name);
				}
			);
		},
		isAlbumSelected(id) {
			if (!this.showingModalForFile) return false;
			const found = this.showingModalForFile.albums.find((el) => el.id === id);
			return !!(found && found.id);
		},
		async handleClick(id) {
			// here the album should be already removed from the selected list
			if (this.selectedOptions.indexOf(id) > -1) {
				this.$handler.executeAction('images/addToAlbum', {
					albumId: id,
					fileId: this.imageId
				});
			} else {
				this.$handler.executeAction('images/removeFromAlbum', {
					albumId: id,
					fileId: this.imageId
				});
			}
		}
	}
};
</script>
