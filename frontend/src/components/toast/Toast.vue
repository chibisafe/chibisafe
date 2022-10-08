<template>
	<!-- Global notification live region, render this permanently at the end of the document -->
	<div
		aria-live="assertive"
		class="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6 z-20"
	>
		<div class="flex w-full flex-col items-center space-y-4 sm:items-end">
			<!-- Notification panel, dynamically insert this into the live region when it needs to be displayed -->
			<TransitionGroup
				enter-active-class="transform ease-out duration-300 transition"
				enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
				enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
				leave-active-class="transition ease-in duration-100"
				leave-from-class="opacity-100"
				leave-to-class="opacity-0"
			>
				<div
					v-for="toast in toasts"
					:key="toast.id"
					class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5"
				>
					<div class="p-4">
						<div class="flex items-start">
							<div class="flex-shrink-0">
								<IconCheckCircle
									class="h-6 w-6"
									aria-hidden="true"
									:class="[
										{
											'text-green-400': toast.type === 'success',
											'text-yellow-400': toast.type === 'warning',
											'text-red-400': toast.type === 'error'
										}
									]"
								/>
							</div>
							<div class="ml-3 w-0 flex-1 pt-0.5">
								<p class="text-sm font-medium text-gray-900">{{ toast.message }} - {{ toast.id }}</p>
							</div>
							<div class="ml-4 flex flex-shrink-0">
								<button
									type="button"
									class="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
									@click="toastStore.dismiss(toast.id)"
								>
									<span class="sr-only">Close</span>
									<IconClose class="h-5 w-5" aria-hidden="true" />
								</button>
							</div>
						</div>
					</div>
				</div>
			</TransitionGroup>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useToastStore } from '~/store/toast';
// @ts-ignore
import IconCheckCircle from '~icons/carbon/checkmark-outline';
// @ts-ignore
import IconClose from '~icons/carbon/close';

const toastStore = useToastStore();
const toasts = computed(() => toastStore.toasts);
</script>
