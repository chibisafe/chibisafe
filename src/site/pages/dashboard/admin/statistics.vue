<template>
	<section class="section is-fullheight dashboard">
		<div class="container">
			<div class="columns">
				<div class="column is-narrow">
					<Sidebar />
				</div>
				<div class="column">
					<h2 class="subtitle">
						Statistics
					</h2>
					<hr>
					<template v-for="category in Object.keys(stats)">
						<div :key="category"
							class="stats-container">
							<h2 class="title">
								{{ category }} <span v-if="stats[category].meta" class="is-size-7 is-pulled-right is-family-monospace has-text-grey-light">
									generated on {{ stats[category].meta.generatedOn }}
									<b-icon class="is-pulled-right ml1 is-clickable"
										size="is-small"
										icon="reload"
										@click.native="refresh(category)" />
								</span>
							</h2>

							<template v-for="item in Object.keys(stats[category])">
								<!-- If it's plain text or a number, just print it -->
								<template v-if="typeof stats[category][item] === 'string' || typeof stats[category][item] === 'number'">
									<generic :key="item"
										:title="item"
										:value="stats[category][item]" />
								</template>

								<!-- If it's an object then we need to do some magic -->
								<template v-else-if="typeof stats[category][item] === 'object' && stats[category][item].type !== 'hidden'">
									<byteUsage v-if="stats[category][item].type === 'byteUsage'"
										:key="item"
										:title="item"
										:used="stats[category][item].value.used"
										:total="stats[category][item].value.total" />
									<byte v-else-if="stats[category][item].type === 'byte'"
										:key="item"
										:title="item"
										:value="stats[category][item].value" />
									<beat v-else-if="stats[category][item].type === 'time'"
										:key="item"
										:title="item"
										:value="stats[category][item].value" />
									<detailed v-else-if="stats[category][item].type === 'detailed'"
										:key="item"
										:title="item"
										:data="stats[category][item].data" />
								</template>
							</template>
						</div>
					</template>
				</div>
			</div>
		</div>
	</section>
</template>

<script>
import { mapState } from 'vuex';
import Sidebar from '~/components/sidebar/Sidebar.vue';
import byteUsage from '~/components/statistics/byteUsage.vue';
import byte from '~/components/statistics/byte.vue';
import beat from '~/components/statistics/time.vue';
import detailed from '~/components/statistics/detailed.vue';
import generic from '~/components/statistics/generic.vue';

export default {
	components: {
		Sidebar,
		byteUsage,
		byte,
		beat,
		detailed,
		generic
	},
	middleware: ['auth', 'admin'],
	computed: mapState({
		stats: state => state.admin.statistics
	}),
	async asyncData({ app }) {
		await app.store.dispatch('admin/fetchStatistics');
	},
	methods: {
		refresh(category) {
			try {
				this.$store.dispatch('admin/fetchStatistics', category);
			} catch (error) {
				this.$notifier.error(error.message);
			}
		}
	},
	head() {
		return {
			title: 'Service statistics'
		};
	}
};
</script>
<style lang="scss" scoped>
@import '~/assets/styles/_colors.scss';
h2.title {
	color: $defaultTextColor;
}
div.stats-container {
	padding: 1rem;
	background: #1c1e23;
	box-shadow: rgba(15, 17, 21, 0.35) 0px 6px 9px 0px;
	margin-bottom: 1rem;
}
</style>
