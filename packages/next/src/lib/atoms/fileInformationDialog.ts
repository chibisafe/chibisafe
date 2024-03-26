import { atom } from 'jotai';
import type { File } from '@/types';

export const isDialogOpenAtom = atom(false);
export const selectedFileAtom = atom<File | null>(null);
