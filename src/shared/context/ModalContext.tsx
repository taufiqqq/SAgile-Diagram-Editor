import React, { createContext, useContext, useState } from 'react';

interface ModalContextType {
  isOpen: boolean;
  nodeData: {
    type: string;
    label: string;
    id: string;
  } | null;
  openModal: (data: { type: string; label: string; id: string }) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [nodeData, setNodeData] = useState<{ type: string; label: string; id: string } | null>(null);

  const openModal = (data: { type: string; label: string; id: string }) => {
    setNodeData(data);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setNodeData(null);
  };

  return (
    <ModalContext.Provider value={{ isOpen, nodeData, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}; 