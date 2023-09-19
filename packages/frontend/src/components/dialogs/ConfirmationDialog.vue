<template>
	<AlertDialog>
		<AlertDialogTrigger as-child>
			<slot />
		</AlertDialogTrigger>
		<AlertDialogContent>
			<AlertDialogHeader>
				<AlertDialogTitle>{{ title }}</AlertDialogTitle>
				<AlertDialogDescription>
					{{ message }}
				</AlertDialogDescription>
			</AlertDialogHeader>
			<AlertDialogFooter>
				<AlertDialogCancel>{{ cancelText }}</AlertDialogCancel>
				<AlertDialogAction @click="callback">{{ proceedText }}</AlertDialogAction>
			</AlertDialogFooter>
		</AlertDialogContent>
	</AlertDialog>
</template>

<script setup lang="ts">
import AlertDialog from '@/components/ui/alert-dialog/AlertDialog.vue';
import AlertDialogAction from '@/components/ui/alert-dialog/AlertDialogAction.vue';
import AlertDialogCancel from '@/components/ui/alert-dialog/AlertDialogCancel.vue';
import AlertDialogContent from '@/components/ui/alert-dialog/AlertDialogContent.vue';
import AlertDialogDescription from '@/components/ui/alert-dialog/AlertDialogDescription.vue';
import AlertDialogFooter from '@/components/ui/alert-dialog/AlertDialogFooter.vue';
import AlertDialogHeader from '@/components/ui/alert-dialog/AlertDialogHeader.vue';
import AlertDialogTitle from '@/components/ui/alert-dialog/AlertDialogTitle.vue';
import AlertDialogTrigger from '@/components/ui/alert-dialog/AlertDialogTrigger.vue';

interface Props {
	title: string;
	message: string;
	proceedText?: string;
	cancelText?: string;
	callback: () => void;
}

withDefaults(defineProps<Props>(), {
	title: 'Are you sure?',
	message: 'This action cannot be undone.',
	proceedText: 'Confirm',
	cancelText: 'Cancel',
	callback: () => {}
});
</script>
