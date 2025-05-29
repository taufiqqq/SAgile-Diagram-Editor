import React, { useState, useEffect } from 'react';
import NodeLabel from "../shapes-react-flow/Label";

interface RectangularActorHtmlProps {
  label: string;
  selected: boolean;
  width?: number;
  height?: number;
  onLabelChange?: (newLabel: string) => void;
  hidePlaceholder?: boolean;
}

export const RectangularActorHtml: React.FC<RectangularActorHtmlProps> = ({
  label,
  selected,
  width = 150, // Default width
  height = 100, // Default height
  onLabelChange,
  hidePlaceholder = false,
}) => {
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
    <div
      style={{
        width: width,
        height: height,
        border: selected ? '2px solid red' : '1px solid black', // Border style
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between', // Space between stereotype, label, and bottom border
        padding: '10px',
        boxSizing: 'border-box',
        backgroundColor: 'white', // Background color
      }}
    >
      <div style={{ fontSize: '12px', fontStyle: 'italic', color: '#333' }}>
        &lt;&lt;actor&gt;&gt;
      </div>
      <div onClick={handleLabelContainerClick} style={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}> {/* Label container */}
        <NodeLabel
          placeholder="Label"
          value={currentLabel}
          onChange={handleLabelChange}
          hidePlaceholder={hidePlaceholder}
        />
      </div>
      {/* Optional: Could add a bottom line/border if needed for specific styling */}
    </div>
  );
}; 