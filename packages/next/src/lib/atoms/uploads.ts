import type { UploadFile } from '@/types';
import { atomWithImmer } from 'jotai-immer';

export const uploadsAtom = atomWithImmer<UploadFile[]>([]);
