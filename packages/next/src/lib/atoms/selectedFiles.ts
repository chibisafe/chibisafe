import type { FileWithIndex } from '@/types';
import { atom } from 'jotai';

export const selectedFilesAtom = atom<FileWithIndex[]>([]);
export const selectionActiveAtom = atom(get => get(selectedFilesAtom).length > 0);
