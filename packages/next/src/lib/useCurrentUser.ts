import type { LocalStorageUser } from '@/types';
import { atom } from 'jotai';

export const currentUserAtom = atom<LocalStorageUser | null>(null);
