import { atom } from 'jotai';
import type { FilePropsType, FileWithIndex } from '@/types';

export const isDialogOpenAtom = atom(false);
export const selectedFileAtom = atom<FileWithIndex | null>(null);
export const currentTypeAtom = atom<FilePropsType | null>(null);
export const allFilesAtom = atom<FileWithIndex[]>([]);
