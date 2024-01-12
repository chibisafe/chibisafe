import { atom, createStore } from 'jotai';

export const uploadStore = createStore();

export const isUploadingAtom = atom(false);
export const fileListAtom = atom<File[] | []>([]);

uploadStore.set(isUploadingAtom, false);
uploadStore.set(fileListAtom, []);
