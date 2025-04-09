import { Dispatch, SetStateAction, ReactNode } from 'react';

export type DnDContextType = [string | null, Dispatch<SetStateAction<string | null>>];

export interface DnDProviderProps {
  children: ReactNode;
}