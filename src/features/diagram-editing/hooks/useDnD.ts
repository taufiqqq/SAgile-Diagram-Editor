import { useContext } from 'react';
import { DnDContextType } from '../types/DnDContext.types';
import DnDContext from '../components/DnDContext';



export const useDnD = (): DnDContextType => {
  const context = useContext(DnDContext);
  if (!context) {
    throw new Error('useDnD must be used within a DnDProvider');
  }
  return context;
};