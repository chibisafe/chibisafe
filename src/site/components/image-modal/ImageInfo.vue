<template>
	<div class="container has-background-chibisafe">
		<div class="columns is-marginless">
			<div class="column image-col has-centered-items">
				<img v-if="!isVideo(file.type)" class="col-img" :src="file.url">
				<video v-else class="col-vid" controls>
					<source :src="file.url" :type="file.type">
				</video>
			</div>
			<div class="column data-col is-one-third">
				<div class="sticky">
					<div class="divider is-chibisafe has-text-light">
						File information
					</div>
					<b-field
						label="ID"
						label-position="on-border"
						type="is-chibisafe"
						class="chibisafe-on-border">
						<div class="control">
							<span class="fake-input">{{ file.id }}</span>
						</div>
					</b-field>
					<b-field
						label="Name"
						label-position="on-border"
						type="is-chibisafe"
						class="chibisafe-on-border">
						<div class="control">
							<span class="fake-input">{{ file.name }}</span>
						</div>
					</b-field>

					<b-field
						label="Original Name"
						label-position="on-border"
						type="is-chibisafe"
						class="chibisafe-on-border">
						<div class="control">
							<span class="fake-input">{{ file.original }}</span>
						</div>
					</b-field>

					<b-field
						label="IP"
						label-position="on-border"
						type="is-chibisafe"
						class="chibisafe-on-border">
						<div class="control">
							<span class="fake-input">{{ file.ip }}</span>
						</div>
					</b-field>

					<b-field
						label="Link"
						label-position="on-border"
						type="is-chibisafe"
						class="chibisafe-on-border">
						<div class="control">
							<a
								class="fake-input"
								:href="file.url"
								target="_blank">{{ file.url }}</a>
						</div>
					</b-field>

					<b-field
						label="Size"
						label-position="on-border"
						type="is-chibisafe"
						class="chibisafe-on-border">
						<div class="control">
							<span class="fake-input">{{ formatBytes(file.size) }}</span>
						</div>
					</b-field>

					<b-field
						label="Hash"
						label-position="on-border"
						type="is-chibisafe"
						class="chibisafe-on-border">
						<div class="control">
							<span class="fake-input">{{ file.hash }}</span>
						</div>
					</b-field>

					<b-field
						label="Uploaded"
						label-position="on-border"
						type="is-chibisafe"
						class="chibisafe-on-border">
						<div class="control">
							<span class="fake-input"><timeago :since="file.createdAt" /></span>
						</div>
					</b-field>

					<div class="divider is-chibisafe has-text-light">
						Tags
					</div>
					<Taginfo :image-id="file.id" :image-tags="tags" />

					<div class="divider is-chibisafe has-text-light">
						Albums
					</div>
					<Albuminfo :image-id="file.id" :image-albums="albums" :albums="tinyDetails" />
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex';

import Albuminfo from './AlbumInfo.vue';
import Taginfo from './TagInfo.vue';

export default {
	components: {
		Taginfo,
		Albuminfo
	},
	props: {
		file: {
			'type': Object,
			'default': () => ({})
		},
		albums: {
			'type': Array,
			'default': () => ([])
		},
		tags: {
			'type': Array,
			'default': () => ([])
		}
	},
	computed: mapState({
		images: state => state.images,
		tinyDetails: state => state.albums.tinyDetails
	}),
	methods: {
		formatBytes(bytes, decimals = 2) {
			if (bytes === 0) return '0 Bytes';

			const k = 1024;
			const dm = decimals < 0 ? 0 : decimals;
			const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

			const i = Math.floor(Math.log(bytes) / Math.log(k));

			// eslint-disable-next-line no-mixed-operators
			return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
		},
		isVideo(type) {
			return type.startsWith('video');
		}
	}
};
</script>

<style lang="scss" scoped>
@import '~/assets/styles/_colors.scss';
.modal-content, .modal-card {
	max-height: 100%;
}

.fake-input {
	font-size: 1rem !important;
	height: 2.5rem;
	border-color: #323846; /* $chibisafe */
	max-width: 100%;
	width: 100%;
    border-radius: 4px;
    display: inline-block;
    font-size: 1rem;
    justify-content: flex-start;
    line-height: 1.5;
    padding-bottom: calc(0.375em - 1px);
    padding-left: calc(0.625em - 1px);
    padding-right: calc(0.625em - 1px);
    padding-top: calc(0.375em - 1px);
	background-color: #21252d;
	border: 2px solid #21252d;
	border-radius: 0.3em !important;

	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
}

.divider:first-child {
    margin: 10px 0 25px;
}

.col-vid {
	width: 100%;
}

.image-col {
	align-items: center;
}

.data-col  {
	@media screen and (min-width: 769px) {
		padding-right: 1.5rem;
	}
	@media screen and (max-width: 769px) {
		padding-bottom: 3rem;
	}
}
</style>
