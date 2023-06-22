<template>
	<div>
		<TransitionRoot as="template" :show="sidebarOpen">
			<Dialog as="div" class="relative z-40 desktop:hidden" @close="sidebarOpen = false">
				<TransitionChild
					as="template"
					enter="transition-opacity ease-linear duration-300"
					enter-from="opacity-0"
					enter-to="opacity-100"
					leave="transition-opacity ease-linear duration-300"
					leave-from="opacity-100"
					leave-to="opacity-0"
				>
					<div class="fixed inset-0 bg-gray-600 bg-opacity-75" />
				</TransitionChild>

				<div class="fixed inset-0 z-40 flex">
					<TransitionChild
						as="template"
						enter="transition ease-in-out duration-300 transform"
						enter-from="-translate-x-full"
						enter-to="translate-x-0"
						leave="transition ease-in-out duration-300 transform"
						leave-from="translate-x-0"
						leave-to="-translate-x-full"
					>
						<DialogPanel class="relative flex w-full max-w-xs flex-1 flex-col bg-dark-110">
							<TransitionChild
								as="template"
								enter="ease-in-out duration-300"
								enter-from="opacity-0"
								enter-to="opacity-100"
								leave="ease-in-out duration-300"
								leave-from="opacity-100"
								leave-to="opacity-0"
							>
								<div class="absolute top-0 right-0 -mr-12 pt-2">
									<button
										type="button"
										class="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
										@click="sidebarOpen = false"
									>
										<span class="sr-only">Close sidebar</span>
										<IconClose class="h-6 w-6 text-white" aria-hidden="true" />
									</button>
								</div>
							</TransitionChild>
							<div class="h-0 flex-1 overflow-y-auto pt-5 pb-4">
								<div class="flex flex-shrink-0 items-center px-4 justify-center">
									<router-link to="/">
										<img
											v-if="settingsStore.logo"
											:src="settingsStore.logo"
											alt="chibisafe logo"
											class="w-24"
										/>
										<img
											v-else
											src="../../assets/images/logo.svg"
											alt="chibisafe logo"
											class="w-24"
										/>
									</router-link>
								</div>
								<nav class="mt-5 space-y-1 px-8 mb-8">
									<router-link
										v-for="item in mainNavigation"
										:key="item.name"
										:to="item.href"
										class="group flex items-center px-2 py-2 text-base font-medium rounded-md"
										:class="[
											item.current
												? 'bg-dark-100 text-white'
												: 'text-gray-300 hover:bg-dark-100 hover:text-white'
										]"
									>
										<component
											:is="item.icon"
											class="mr-4 flex-shrink-0 h-6 w-6"
											:class="[
												item.current
													? 'text-gray-300'
													: 'text-gray-400 group-hover:text-gray-300'
											]"
											aria-hidden="true"
										/>
										{{ item.name }}
									</router-link>
								</nav>
								<nav class="flex-1 space-y-1 px-8">
									<h3 id="projects-headline" class="px-3 text-sm font-medium text-gray-500">
										Admin section
									</h3>
									<router-link
										v-for="item in adminNavigation"
										:key="item.name"
										:to="item.href"
										class="group flex items-center px-2 py-2 text-sm font-medium rounded-md"
										:class="[
											item.current
												? 'bg-dark-100 text-white'
												: 'text-gray-300 hover:bg-dark-100 hover:text-white'
										]"
									>
										<component
											:is="item.icon"
											class="mr-3 flex-shrink-0 h-6 w-6"
											:class="[
												item.current
													? 'text-gray-300'
													: 'text-gray-400 group-hover:text-gray-300'
											]"
											aria-hidden="true"
										/>
										{{ item.name }}
									</router-link>
								</nav>
								<div class="mt-8 px-8">
									<div class="mt-1 space-y-1" aria-labelledby="projects-headline">
										<a
											v-for="item in secondaryNavigation"
											:key="item.name"
											:href="item.href"
											rel="noopener noreferrer"
											class="group flex items-center rounded-md px-3 py-1 text-sm font-medium text-light-100 hover:text-white"
										>
											<span class="truncate">{{ item.name }}</span>
										</a>
									</div>
								</div>
							</div>
						</DialogPanel>
					</TransitionChild>
					<div class="w-14 flex-shrink-0">
						<!-- Force sidebar to shrink to fit close icon -->
					</div>
				</div>
			</Dialog>
		</TransitionRoot>

		<!-- Static sidebar for desktop -->
		<div class="hidden desktop:fixed desktop:inset-y-0 desktop:flex desktop:w-48 desktop:flex-col">
			<!-- Sidebar component, swap this element with another sidebar if you like -->
			<div class="flex min-h-0 flex-1 flex-col bg-dark-110">
				<div class="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
					<div class="flex flex-shrink-0 items-center px-4 justify-center">
						<router-link to="/">
							<img
								v-if="settingsStore.logo"
								:src="settingsStore.logo"
								alt="chibisafe logo"
								class="w-24"
							/>
							<img v-else src="../../assets/images/logo.svg" alt="chibisafe logo" class="w-24" />
						</router-link>
					</div>
					<nav class="mt-5 flex-0 mb-8 space-y-1 px-8">
						<router-link
							v-for="item in mainNavigation"
							:key="item.name"
							:to="item.href"
							class="group flex items-center px-2 py-2 text-sm font-medium rounded-md"
							:class="[
								item.current
									? 'bg-dark-100 text-white'
									: 'text-gray-300 hover:bg-dark-100 hover:text-white'
							]"
						>
							<component
								:is="item.icon"
								class="mr-3 flex-shrink-0 h-6 w-6"
								:class="[item.current ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-300']"
								aria-hidden="true"
							/>
							{{ item.name }}
						</router-link>
					</nav>
					<nav class="flex-1 space-y-1 px-8">
						<template v-if="isAdmin">
							<h3 id="projects-headline" class="px-3 text-sm font-medium text-gray-500">Admin section</h3>
							<router-link
								v-for="item in adminNavigation"
								:key="item.name"
								:to="item.href"
								class="group flex items-center px-2 py-1 text-sm font-medium rounded-md"
								:class="[
									item.current
										? 'bg-dark-100 text-white'
										: 'text-gray-300 hover:bg-dark-100 hover:text-white'
								]"
							>
								<component
									:is="item.icon"
									class="mr-3 flex-shrink-0 h-6 w-6"
									:class="[
										item.current ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-300'
									]"
									aria-hidden="true"
								/>
								{{ item.name }}
							</router-link>
						</template>
					</nav>
					<nav class="mt-8">
						<div class="mt-1 space-y-1">
							<a
								v-for="item in secondaryNavigation"
								:key="item.name"
								:href="item.href"
								rel="noopener noreferrer"
								target="_blank"
								class="group flex items-center justify-center rounded-md px-3 py-1 text-sm font-medium text-light-100 hover:text-white"
								@click="item.onClick ? item.onClick() : null"
							>
								<span class="truncate">{{ item.name }}</span>
							</a>
						</div>
					</nav>
				</div>
			</div>
		</div>
		<div class="flex flex-1 flex-col desktop:pl-48">
			<div class="sticky top-0 z-10 bg-dark-110 pl-1 pt-1 mobile:pl-3 mobile:pt-3 desktop:hidden">
				<button
					type="button"
					class="-ml-0.5 -mt-0.5 mobile:mb-3 inline-flex h-12 w-12 items-center justify-center rounded-md text-light-100 hover:text-whitefocus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
					@click="sidebarOpen = true"
				>
					<span class="sr-only">Open sidebar</span>
					<IconMenu class="h-6 w-6" aria-hidden="true" />
				</button>
			</div>
			<main class="flex-1">
				<div id="dashboard-container" class="overflow-auto h-screen">
					<slot />
				</div>
			</main>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue';
import { useUserStore, useSettingsStore } from '~/store';
import { saveAs } from 'file-saver';

// @ts-ignore
import IconHome from '~icons/carbon/home';
import IconUploads from '~icons/carbon/cloud-upload';
import IconAlbums from '~icons/carbon/folders';
import IconTags from '~icons/carbon/tag-group';
import IconAccount from '~icons/carbon/user-identification';
import IconMenu from '~icons/carbon/menu';
import IconClose from '~icons/carbon/close';
import IconInvite from '~icons/carbon/user-follow';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const settingsStore = useSettingsStore();

const isAdmin = computed(() => userStore.user.isAdmin);
const apiKey = computed(() => userStore.user.apiKey);

const logout = async () => {
	await router.push('/');
	userStore.logout();
};

const getShareXConfig = async () => {
	if (!apiKey.value) {
		// eslint-disable-next-line no-alert
		window.alert('You need to generate an API key first!');
		return;
	}

	const sharexFile = `{
		"Name": "chibisafe",
		"DestinationType": "ImageUploader, FileUploader",
		"RequestType": "POST",
		"RequestURL": "${location.origin}/api/upload",
		"FileFormName": "file[]",
		"Headers": {
			"x-api-key": "${apiKey.value}"
		},
		"ResponseType": "Text",
		"URL": "$json:url$",
		"ThumbnailURL": "$json:thumb$"
	}`;
	const sharexBlob = new Blob([sharexFile], { type: 'application/octet-binary' });
	saveAs(sharexBlob, `${location.hostname}.sxcu`);
};

const navigationItems = [
	{ type: 'main', name: 'Home', href: '/', icon: IconHome, current: false },
	{ type: 'main', name: 'Uploads', href: '/dashboard/uploads', icon: IconUploads, current: false },
	{ type: 'main', name: 'Albums', href: '/dashboard/albums', icon: IconAlbums, current: false },
	// { type: 'main', name: 'Tags', href: '/dashboard/tags', icon: IconTags, current: false },
	{ type: 'main', name: 'My account', href: '/dashboard/account', icon: IconAccount, current: false },

	{ type: 'secondary', name: 'GitHub', href: 'https://github.com/chibisafe/chibisafe' },
	{ type: 'secondary', name: 'Discord', href: 'https://discord.gg/5g6vgwn' },
	{ type: 'secondary', name: 'Patreon', href: 'https://www.patreon.com/pitu' },
	{ type: 'secondary', name: 'Browser extension', href: 'https://github.com/chibisafe/chibisafe-extension' },
	{ type: 'secondary', name: 'Get ShareX config', href: '#', onClick: () => void getShareXConfig() },
	{ type: 'secondary', name: 'Log out', href: '#', onClick: () => void logout() },

	{ type: 'admin', name: 'Files', href: '/dashboard/admin/files', icon: IconTags, current: false },
	{ type: 'admin', name: 'Users', href: '/dashboard/admin/users', icon: IconHome, current: false },
	{ type: 'admin', name: 'Invites', href: '/dashboard/admin/invites', icon: IconInvite, current: false },
	{ type: 'admin', name: 'Settings', href: '/dashboard/admin/settings', icon: IconUploads, current: false },
	{ type: 'admin', name: 'Statistics', href: '/dashboard/admin/statistics', icon: IconAlbums, current: false }
];

// eslint-disable-next-line unicorn/no-array-for-each
navigationItems.forEach(item => {
	if (item.href === route.path) {
		item.current = true;
	}
});

const mainNavigation = computed(() => navigationItems.filter(item => item.type === 'main'));
const secondaryNavigation = computed(() => navigationItems.filter(item => item.type === 'secondary'));
const adminNavigation = computed(() => navigationItems.filter(item => item.type === 'admin'));

const sidebarOpen = ref(false);
</script>
