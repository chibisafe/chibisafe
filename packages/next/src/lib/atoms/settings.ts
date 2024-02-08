import type { Settings } from '@/types';
import { atom } from 'jotai';

export const settingsAtom = atom<Settings | null>(null);
