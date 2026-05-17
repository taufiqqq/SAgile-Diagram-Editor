import { createContext, useState } from "react";
import { DnDContextType, DnDProviderProps } from "../types/DnDContext.types";

// Create the context with an initial value of `undefined`
const DnDContext = createContext<DnDContextType | undefined>(undefined);

export const DnDProvider = ({ children }: DnDProviderProps) => {
  const [diagramElementType, setType] = useState<string>(""); // Default to an empty string
  const [shapeType, setShapeType] = useState<string>(""); // Default to an empty string

  return (
    <DnDContext.Provider value={{ diagramElementType, shapeType, setType, setShapeType }}>
      {children}
    </DnDContext.Provider>
  );
};

export default DnDContext;