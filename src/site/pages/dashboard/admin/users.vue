<style lang="scss" scoped>
	@import '~/assets/styles/_colors.scss';
	div.view-container {
		padding: 2rem;
	}
	div.album {
		display: flex;
		flex-wrap: wrap;
		margin-bottom: 10px;

		div.arrow-container {
			width: 2em;
			height: 64px;
			position: relative;
			cursor: pointer;

			i {
				border: 2px solid $defaultTextColor;
				border-right: 0;
				border-top: 0;
				display: block;
				height: 1em;
				position: absolute;
				transform: rotate(-135deg);
				transform-origin: center;
				width: 1em;
				z-index: 4;
				top: 22px;

				-webkit-transition: transform 0.1s linear;
				-moz-transition: transform 0.1s linear;
				-ms-transition: transform 0.1s linear;
				-o-transition: transform 0.1s linear;
				transition: transform 0.1s linear;

				&.active {
					transform: rotate(-45deg);
				}
			}
		}
		div.thumb {
			width: 64px;
			height: 64px;
			-webkit-box-shadow: $boxShadowLight;
					box-shadow: $boxShadowLight;
		}

		div.info {
			margin-left: 15px;
			h4 {
				font-size: 1.5rem;
				a {
					color: $defaultTextColor;
					font-weight: 400;
					&:hover { text-decoration: underline; }
				}
			}
			span { display: block; }
			span:nth-child(3) {
				font-size: 0.9rem;
			}
		}

		div.latest {
			flex-grow: 1;
			justify-content: flex-end;
			display: flex;
			margin-left: 15px;

			span.no-files {
				font-size: 1.5em;
				color: #b1b1b1;
				padding-top: 17px;
			}

			div.more {
				width: 64px;
				height: 64px;
				background: white;
				display: flex;
				align-items: center;
				padding: 10px;
				text-align: center;
				a {
					line-height: 1rem;
					color: $defaultTextColor;
					&:hover { text-decoration: underline; }
				}
			}
		}

		div.details {
			flex: 0 1 100%;
			padding-left: 2em;
			padding-top: 1em;
			min-height: 50px;

			.b-table {
				padding: 2em 0em;

				.table-wrapper {
					-webkit-box-shadow: $boxShadowLight;
							box-shadow: $boxShadowLight;
				}
			}
		}
	}

	div.column > h2.subtitle { padding-top: 1px; }
</style>
<style lang="scss">
	@import '~/assets/styles/_colors.scss';

	.b-table {
		.table-wrapper {
			-webkit-box-shadow: $boxShadowLight;
					box-shadow: $boxShadowLight;
		}
	}
</style>


<template>
	<section class="hero is-fullheight dashboard">
		<div class="hero-body">
			<div class="container">
				<div class="columns">
					<div class="column is-narrow">
						<Sidebar />
					</div>
					<div class="column">
						<h2 class="subtitle">Manage your users</h2>
						<hr>

						<div class="view-container">
							<b-table
								:data="users || []"
								:mobile-cards="true">
								<template slot-scope="props">
									<b-table-column field="id"
										label="Id"
										centered>
										{{ props.row.id }}
									</b-table-column>

									<b-table-column field="username"
										label="Username"
										centered>
										<nuxt-link :to="`/dashboard/admin/user/${props.row.id}`">{{ props.row.username }}</nuxt-link>
									</b-table-column>

									<b-table-column field="enabled"
										label="Enabled"
										centered>
										<b-switch v-model="props.row.enabled"
											@input="changeEnabledStatus(props.row)" />
									</b-table-column>

									<b-table-column field="isAdmin"
										label="Admin"
										centered>
										<b-switch v-model="props.row.isAdmin"
											@input="changeIsAdmin(props.row)" />
									</b-table-column>

									<b-table-column field="purge"
										centered>
										<button class="button is-primary"
											@click="promptPurgeFiles(props.row)">Purge files</button>
									</b-table-column>
								</template>
								<template slot="empty">
									<div class="has-text-centered">
										<i class="icon-misc-mood-sad" />
									</div>
									<div class="has-text-centered">
										Nothing here
									</div>
								</template>
								<template slot="footer">
									<div class="has-text-right">
										{{ users.length }} users
									</div>
								</template>
							</b-table>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script>
import Sidebar from '~/components/sidebar/Sidebar.vue';

export default {
	components: {
		Sidebar
	},
	middleware: ['auth', 'admin'],
	data() {
		return {
			users: []
		};
	},
	computed: {
		config() {
			return this.$store.state.config;
		}
	},
	metaInfo() {
		return { title: 'Uploads' };
	},
	mounted() {
		this.getUsers();
	},
	methods: {
		async getUsers() {
			const response = await this.$axios.$get(`admin/users`);
			this.users = response.users;
		},
		async changeEnabledStatus(row) {
			const response = await this.$axios.$post(`admin/users/${row.enabled ? 'enable' : 'disable'}`, {
				id: row.id
			});
			this.$buefy.toast.open(response.message);
		},
		async changeIsAdmin(row) {
			const response = await this.$axios.$post(`admin/users/${row.isAdmin ? 'promote' : 'demote'}`, {
				id: row.id
			});
			this.$buefy.toast.open(response.message);
		},
		promptPurgeFiles(row) {
			this.$buefy.dialog.confirm({
				message: 'Are you sure you want to delete this user\'s files?',
				onConfirm: () => this.purgeFiles(row)
			});
		},
		async purgeFiles(row) {
			const response = await this.$axios.$post(`admin/users/purge`, {
				id: row.id
			});
			this.$buefy.toast.open(response.message);
		}
	}
};
</script>
