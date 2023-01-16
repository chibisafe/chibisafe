import { defineStore } from 'pinia';
import { createTag, getTags } from '~/use/api';
import type { Tag } from '../types';

export const useTagsStore = defineStore('tags', {
	state: () => ({
		tags: [] as Tag[]
	}),
	actions: {
		async get(force = false) {
			if (!force && this.tags.length) return;

			const response = await getTags();
			if (!response) return;
			this.tags = response.tags;
		},
		async create(name: string) {
			const response = await createTag(name);
			if (!response) return;
			this.tags.push(response.tag);
		}
	}
});
