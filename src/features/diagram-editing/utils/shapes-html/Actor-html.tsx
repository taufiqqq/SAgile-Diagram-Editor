import React, { useState } from 'react';
import NodeLabel from "../shapes-react-flow/Label";

interface ActorHtmlProps {
  label: string;
  width?: number;
  selected: boolean;
  onLabelChange?: (newLabel: string) => void;
}

export const ActorHtml = ({ 
  label, 
  selected, 
  width = 100,
  onLabelChange 
}: ActorHtmlProps) => {
  const [currentLabel, setCurrentLabel] = useState(label);

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
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <img draggable
        width={width} 
        src="/actor.svg" 
        style={{ 
          filter: selected 
          ? 'brightness(0) saturate(100%) invert(21%) sepia(93%) saturate(7473%) hue-rotate(-1deg) brightness(96%) contrast(107%)'
          : 'none',
          width: '75px',
          height: '100px'
        }} 
        alt="Actor Icon" 
        className="actor-icon" 
      />
      <div onClick={handleLabelContainerClick}>
        <NodeLabel 
          placeholder="Actor Name" 
          value={currentLabel}
          onChange={handleLabelChange}
        />
      </div>
    </div>
  );
};