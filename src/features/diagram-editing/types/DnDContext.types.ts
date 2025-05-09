import { Dispatch, SetStateAction, ReactNode } from "react";

export interface DnDContextType {
  diagramElementType: string; // Represents the node type (e.g., "use_case_shape", "package")
  shapeType: string; // Represents the shape type (e.g., "usecase", "actor", "package")
  setType: Dispatch<SetStateAction<string>>; // Setter for type
  setShapeType: Dispatch<SetStateAction<string>>; // Setter for shapeType
}

export interface DnDProviderProps {
  children: ReactNode;
}