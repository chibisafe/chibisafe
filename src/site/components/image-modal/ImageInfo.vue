<template>
	<div class="container has-background-lolisafe">
		<div class="columns is-marginless">
			<div class="column fucking-opl-shut-up">
				<img src="https://placehold.it/1024x10024">
			</div>
			<div class="column is-one-third">
				<div class="sticky">
					<div class="divider is-lolisafe has-text-light">
						File information
					</div>
					<b-field
						label="ID"
						label-position="on-border"
						type="is-lolisafe"
						class="lolisafe-on-border">
						<div class="control">
							<span class="fake-input">{{ file.id }}</span>
						</div>
					</b-field>
					<b-field
						label="Name"
						label-position="on-border"
						type="is-lolisafe"
						class="lolisafe-on-border">
						<div class="control">
							<span class="fake-input">{{ file.name }}</span>
						</div>
					</b-field>

					<b-field
						label="Original Name"
						label-position="on-border"
						type="is-lolisafe"
						class="lolisafe-on-border">
						<div class="control">
							<span class="fake-input">{{ file.original }}</span>
						</div>
					</b-field>

					<b-field
						label="IP"
						label-position="on-border"
						type="is-lolisafe"
						class="lolisafe-on-border">
						<div class="control">
							<span class="fake-input">{{ file.ip }}</span>
						</div>
					</b-field>

					<b-field
						label="Link"
						label-position="on-border"
						type="is-lolisafe"
						class="lolisafe-on-border">
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
						type="is-lolisafe"
						class="lolisafe-on-border">
						<div class="control">
							<span class="fake-input">{{ formatBytes(file.size) }}</span>
						</div>
					</b-field>

					<b-field
						label="Hash"
						label-position="on-border"
						type="is-lolisafe"
						class="lolisafe-on-border">
						<div class="control">
							<span class="fake-input">{{ file.hash }}</span>
						</div>
					</b-field>

					<b-field
						label="Uploaded"
						label-position="on-border"
						type="is-lolisafe"
						class="lolisafe-on-border">
						<div class="control">
							<span class="fake-input"><timeago :since="file.createdAt" /></span>
						</div>
					</b-field>
					<div class="divider is-lolisafe has-text-light">
						Albums
					</div>

					<div class="divider is-lolisafe has-text-light">
						Tags
					</div>
					<b-field label="Add some tags">
						<b-taginput
							v-model="tags"
							class="lolisafe"
							ellipsis
							icon="label"
							placeholder="Add a tag" />
					</b-field>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex';

export default {
	props: {
		file: {
			type: Object,
			default: () => ({}),
		},
	},
	data() {
		return {
			tags: [],
		};
	},
	computed: mapState(['images']),
	methods: {
		formatBytes(bytes, decimals = 2) {
			if (bytes === 0) return '0 Bytes';

			const k = 1024;
			const dm = decimals < 0 ? 0 : decimals;
			const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

			const i = Math.floor(Math.log(bytes) / Math.log(k));

			return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
		},
	},
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
	border-color: #323846; /* $lolisafe */
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
</style>
