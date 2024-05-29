import type { Settings } from '@/types';
import { atom } from 'jotai';

export const settingsAtom = atom<any | null>(null);
export const isMasonryViewAtom = atom(true);
