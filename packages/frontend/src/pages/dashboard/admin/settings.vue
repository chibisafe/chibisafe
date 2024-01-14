<template>
	<ScrollArea class="w-full">
		<div class="mx-auto max-w-7xl px-6 mobile:pb-12">
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
			<h1 class="text-base mt-8 mb-8 font-semibold text-light-100 flex items-left flex-col mobile:flex-col">
				If you are having issues with your instance, you can generate a diagnostic file that will help us to
				identify the problem.
				<Button class="w-64 mt-2" @click="() => downloadDiagnosticsFile()">Download diagnostic file</Button>
			</h1>

			<Tabs v-if="categorizedSettings" default-value="service" class="w-full">
				<TabsList class="grid w-full grid-cols-5 border border-accent">
					<TabsTrigger
						v-for="(_, name, index) in categorizedSettings"
						:key="index"
						:value="name"
						class="capitalize"
					>
						{{ name }}
					</TabsTrigger>
				</TabsList>
				<TabsContent v-for="(value, name, index) in categorizedSettings" :key="index" :value="name">
					<!-- <div class="bg-muted p-4 border border-accent"> -->
					<div class="">
						<div
							v-for="(setting, index2) in value"
							:key="index2"
							class="grid gap-2 bg-muted p-4 border border-accent mb-2 rounded"
						>
							<template v-if="setting.type === 'string' || setting.type === 'number'">
								<!--
								  @vue-expect-error v-model can never be a boolean, but based
								  on the above assertion of TYPE, it should never be
								-->
								<InputWithLabel
									v-model="setting.value"
									:label="setting.name"
									:name="setting.key"
									:type="setting.type"
								/>
							</template>
							<template v-if="setting.type === 'boolean'">
								<div class="flex items-center space-x-2 mt-4">
									<!--
									  @vue-expect-error v-checked has to be boolean, and based
									  on the above assertion of TYPE, it will always be
									-->
									<Switch
										:id="setting.key"
										:checked="setting.value"
										@click="setting.value = !setting.value"
									/>
									<Label :for="setting.key">{{ setting.name }}</Label>
								</div>
							</template>

							<template v-else-if="setting.type === 'object'">
								<template v-if="setting.key === 'blockedExtensions'">
									<div class="grid w-full max-w-sm items-center gap-1.5">
										<Label :for="setting.key">{{ setting.name }}</Label>
										<Input
											:id="setting.key"
											ref="blockedExtensionsInput"
											type="text"
											placeholder="Type here an extension and then hit ENTER"
											@keydown.enter="(event: Event) => addExtension(setting, event.target)"
										/>
									</div>

									<div>
										<Badge
											v-for="(extension, idx) in String(setting.value).split(',')"
											:key="idx"
											class="mr-2"
										>
											{{ extension }}
											<span class="ml-2" @click="removeExtension(setting, extension)">
												<svg viewBox="0 0 14 14" class="h-3.5 w-3.5 stroke-white">
													<path d="M4 4l6 6m0-6l-6 6" />
												</svg>
											</span>
										</Badge>
									</div>
								</template>
							</template>

							<p class="text-muted-foreground text-sm">
								<span class="block">{{ setting.description }}</span>
								<span v-if="setting.example" class="block italic mt-1"
									>Example: {{ setting.example }}</span
								>
							</p>
							<div v-if="setting.notice" class="text-sm italic text-yellow-400">
								{{ setting.notice }}
							</div>
						</div>
					</div>
				</TabsContent>
			</Tabs>

			<div class="mt-8 my-4 bg-dark-100 text-light-100 text-lg p-4 space-y-4 max-w-3xl m-auto">
				<Button @click="saveSettings">Save settings</Button>
			</div>
		</div>
	</ScrollArea>
</template>

<script setup lang="ts">
import { saveAs } from 'file-saver';
import { ref, onMounted, computed } from 'vue';
import InputWithLabel from '@/components/input/InputWithLabel.vue';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Setting } from '@/types';
import Breadcrumbs from '~/components/breadcrumbs/Breadcrumbs.vue';
import { useSettingsStore } from '~/store';
import { getAdminSettings, setAdminSettings, getDiagnosticFile } from '~/use/api';

const settingsStore = useSettingsStore();
const settings = ref<Setting[]>([]);
const blockedExtensionsInput = ref<HTMLInputElement>();

const categorizedSettings = computed(() => {
	if (!settings.value) return null;
	const categorized = {
		service: [] as Setting[],
		uploads: [] as Setting[],
		users: [] as Setting[],
		other: [] as Setting[],
		customization: [] as Setting[]
	};
	for (const setting of settings.value) {
		if (setting.category) {
			// @ts-expect-error TODO
			categorized[setting.category].push(setting);
		} else {
			categorized.service.push(setting);
		}
	}

	return categorized;
});

const addExtension = (setting: any, extension: any) => {
	if (!extension.value) return;
	const extensions = setting.value.split(',');
	if (extensions.includes(extension.value)) return;
	extensions.push(extension.value);
	setting.value = extensions.join(',');
	// @ts-expect-error erh something about the element not being an array
	blockedExtensionsInput.value[0].value = '';
};

const removeExtension = (setting: any, extension: string) => {
	const items = setting.value.split(',');
	const index = items.indexOf(extension);
	if (index > -1) {
		items.splice(index, 1);
		setting.value = items.join(',');
	}
};

const saveSettings = async () => {
	await setAdminSettings(settings.value);
	// After saving settings we should call the settings API again to refresh possible values
	await settingsStore.get();
};

const downloadDiagnosticsFile = async () => {
	const diagnosticFile = await getDiagnosticFile();
	console.log(diagnosticFile);
	const sharexBlob = new Blob([diagnosticFile.diagnostics], { type: 'text/plain' });
	saveAs(sharexBlob, `${location.hostname}-diagnostics.log`);
};

onMounted(async () => {
	const response = await getAdminSettings();
	if (!response) return;
	settings.value = response;
});
</script>
