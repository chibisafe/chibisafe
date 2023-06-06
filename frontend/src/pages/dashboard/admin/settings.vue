<template>
	<Sidebar>
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-screen overflow-auto">
			<Breadcrumbs
				:pages="[
					{
						name: 'Admin',
						href: '/dashboard/admin/files'
					},
					{
						name: 'Statistics',
						href: '/dashboard/admin/settings'
					}
				]"
			/>
			<h1 class="text-2xl mt-8 mb-8 font-semibold text-light-100 flex items-center">Settings</h1>
			<div class="my-4 bg-dark-90 p-4 text-light-100 text-lg">
				<div v-for="(setting, index) in settings" :key="index" class="flex mb-4">
					<div v-if="setting.type === 'string' || setting.type === 'number'" class="w-full">
						<Input
							v-model="setting.value"
							:label="setting.name"
							:type="setting.type === 'string' ? 'text' : 'number'"
							class="w-full"
						/>
					</div>

					<div v-else-if="setting.type === 'boolean'">
						<div class="w-60 text-sm">{{ setting.name }}</div>
						<Switch
							v-model="setting.value"
							class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-0 dark:border-gray-600"
							:class="[setting.value ? 'bg-blue-400' : 'bg-gray-200']"
							@update:modelValue="() => {}"
						>
							<span class="sr-only">{{ setting.name }}</span>
							<span
								aria-hidden="true"
								class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out dark:bg-dark-90"
								:class="[setting.value ? 'translate-x-5' : 'translate-x-0']"
							/>
						</Switch>
					</div>
					<div v-else-if="setting.type === 'object'">
						<div class="w-60 text-sm">{{ setting.name }}</div>
						<template v-if="setting.name === 'blockedExtensions'">
							<div class="mt-1 mb-2">
								<!-- eslint-disable-next-line vue/component-name-in-template-casing -->
								<input
									class="shadow focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-sm text-dark-100 bg-light-100"
									type="text"
									placeholder="Type here an extension and then hit ENTER"
								/>
							</div>
							<span
								v-for="(extension, idx) in String(setting.value).split(',')"
								:key="idx"
								class="inline-flex items-center gap-x-0.5 rounded-md bg-gray-700 px-2 py-1 font-medium text-light-100 ring-1 ring-inset ring-gray-500/10 mr-2 mb-2"
							>
								{{ extension }}
								<button
									type="button"
									class="group relative -mr-1 h-3.5 w-3.5 rounded-sm hover:bg-gray-800"
								>
									<span class="sr-only">Remove</span>
									<svg viewBox="0 0 14 14" class="h-3.5 w-3.5 stroke-white group-hover:stroke-white">
										<path d="M4 4l6 6m0-6l-6 6" />
									</svg>
									<span class="absolute -inset-1" />
								</button>
							</span>
						</template>
					</div>
				</div>
			</div>
		</div>
	</Sidebar>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getAdminSettings } from '~/use/api';
import { Switch, SwitchLabel } from '@headlessui/vue';
import Input from '~/components/forms/Input.vue';
import Sidebar from '~/components/sidebar/Sidebar.vue';
import Breadcrumbs from '~/components/breadcrumbs/Breadcrumbs.vue';

const settings = ref(null) as any;

onMounted(async () => {
	const response = await getAdminSettings();
	if (!response) return;
	settings.value = response;
});
</script>
