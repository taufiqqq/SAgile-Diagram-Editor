import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the type for the context value
type DnDContextType = [string | null, React.Dispatch<React.SetStateAction<string | null>>];

// Create the context with a default value
const DnDContext = createContext<DnDContextType | undefined>(undefined);

// Define the provider's props
interface DnDProviderProps {
  children: ReactNode;
}

// Create the provider component
export const DnDProvider: React.FC<DnDProviderProps> = ({ children }) => {
  const [type, setType] = useState<string | null>(null);

  return (
    <DnDContext.Provider value={[type, setType]}>
      {children}
    </DnDContext.Provider>
  );
};

// Hook to use the DnD context
export const useDnD = (): DnDContextType => {
  const context = useContext(DnDContext);
  if (!context) {
    throw new Error('useDnD must be used within a DnDProvider');
  }
  return context;
};

export default DnDContext;