import type { Album } from '@/types';
import { atom } from 'jotai';

export const isDialogOpenAtom = atom(false);
export const selectedAlbumAtom = atom<Album | null>(null);
