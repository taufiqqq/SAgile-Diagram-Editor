import React, { useState, useEffect } from 'react';
import NodeLabel from "../shapes-react-flow/Label";

interface UseCaseHtmlProps {
  label?: string;
  selected?: boolean;
  width?: number;
  height?: number;
  onLabelChange?: (newLabel: string) => void;
  hidePlaceholder?: boolean;
}

export const UseCaseHtml = ({ 
  label = '', 
  selected = false,
  width = 150, 
  height = 100,
  onLabelChange,
  hidePlaceholder = false
}: UseCaseHtmlProps) => {
  const [currentLabel, setCurrentLabel] = useState(label);

  // Update local state when label prop changes
  useEffect(() => {
    setCurrentLabel(label);
  }, [label]);

  const handleLabelChange = (newLabel: string) => {
    setCurrentLabel(newLabel);
    if (onLabelChange) {
      onLabelChange(newLabel);
    }
  };

  // Handle click on the label container to allow propagation
  const handleLabelContainerClick = (e: React.MouseEvent) => {
    // Only stop propagation if we're clicking on the input itself
    if (e.target instanceof HTMLInputElement) {
      e.stopPropagation();
    }
  };

  return (
    <div style={{
      width: `${width}px`,
      height: `${height}px`,
      borderRadius: '50%',
      background: '#f0f0f0',
      border: selected ? '2px solid red' : '2px solid #555',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div onClick={handleLabelContainerClick}>
        <NodeLabel 
          placeholder="Use Case Name" 
          value={currentLabel}
          onChange={handleLabelChange}
          hidePlaceholder={hidePlaceholder}
        />
      </div>
    </div>
  );
};

