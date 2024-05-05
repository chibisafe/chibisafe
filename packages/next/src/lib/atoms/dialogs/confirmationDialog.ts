import { atom } from 'jotai';

interface ConfirmationDialogAtom {
	callback: any;
	description: string;
	title?: string;
}

export const confirmationDialogAtom = atom<ConfirmationDialogAtom>({
	callback: null,
	description: '',
	title: ''
});
