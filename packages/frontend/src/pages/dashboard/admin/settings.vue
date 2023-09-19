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
			<h1 class="text-2xl mt-8 mb-8 font-semibold text-light-100 flex items-center mobile:flex-col"></h1>

			<div class="mt-8 my-4 bg-dark-100 text-light-100 text-lg p-4 space-y-4 max-w-3xl m-auto">
				<div v-for="(setting, index) in settings" :key="index" class="grid gap-2">
					<template v-if="setting.type === 'string' || setting.type === 'number'">
						<InputWithLabel
							v-model="setting.value"
							:label="setting.name"
							:name="setting.key"
							:type="setting.type"
						/>
					</template>
					<template v-if="setting.type === 'boolean'">
						<div class="flex items-center space-x-2 mt-4">
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
						<span v-if="setting.example" class="block italic mt-1 bg-dark-90"
							>Example: {{ setting.example }}</span
						>
					</p>
					<div v-if="setting.notice" class="text-sm italic text-red-400">
						{{ setting.notice }}
					</div>
					<Separator class="my-4" />
				</div>

				<Button @click="saveSettings">Save settings</Button>
			</div>
		</div>
	</ScrollArea>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import InputWithLabel from '@/components/input/InputWithLabel.vue';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import Breadcrumbs from '~/components/breadcrumbs/Breadcrumbs.vue';
import { useSettingsStore } from '~/store';
import { getAdminSettings, setAdminSettings } from '~/use/api';

const settingsStore = useSettingsStore();
const settings = ref(null) as any;
const blockedExtensionsInput = ref<HTMLInputElement>();

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

onMounted(async () => {
	const response = await getAdminSettings();
	if (!response) return;
	settings.value = response;
});
</script>
