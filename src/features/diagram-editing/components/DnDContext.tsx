import { createContext, useState } from 'react';
import { DnDContextType, DnDProviderProps } from '../types/DnDContext.types';


const DnDContext = createContext<DnDContextType | undefined>(undefined);

export const DnDProvider = ({ children }: DnDProviderProps) => {
  const [type, setType] = useState<string | null>(null);
  return (
    <DnDContext.Provider value={[type, setType]}>
      {children}
    </DnDContext.Provider>
  );
};

export default DnDContext;