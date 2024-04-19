import { atom } from 'jotai';
import type { FilePropsType, FileWithAdditionalData } from '@/types';

export const isDialogOpenAtom = atom(false);
export const selectedFileAtom = atom<FileWithAdditionalData | null>(null);
export const currentTypeAtom = atom<FilePropsType | null>(null);
