import React, { useState, useEffect } from 'react';
import { Handle, Position } from '@xyflow/react';
import NodeLabel from "../../../diagram-editing/utils/shapes-react-flow/Label";

interface SequenceBoundaryHtmlProps {
  label: string;
  selected: boolean;
  onLabelChange?: (newLabel: string) => void;
  hidePlaceholder?: boolean;
  hasLifeline?: boolean;
  lifelineLength?: number;
  isConnectable?: boolean;
}

export const SequenceBoundaryHtml = ({
  label,
  selected,
  onLabelChange,
  hidePlaceholder = false,
  hasLifeline = true,
  lifelineLength = 400,
  isConnectable = true,
}: SequenceBoundaryHtmlProps) => {
  const [currentLabel, setCurrentLabel] = useState(label);

  useEffect(() => {
    setCurrentLabel(label);
  }, [label]);

  const handleLabelChange = (newLabel: string) => {
    setCurrentLabel(newLabel);
    if (onLabelChange) {
      onLabelChange(newLabel);
    }
  };

  const handleLabelContainerClick = (e: React.MouseEvent) => {
    if (e.target instanceof HTMLInputElement) {
      e.stopPropagation();
    }
  };

  const color = selected ? '#E60000' : '#333';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Boundary icon: vertical bar on left connected to a circle  |—○ */}
      <svg width="64" height="50" viewBox="0 0 64 50" style={{ display: 'block', overflow: 'visible' }}>
        {/* Vertical bar */}
        <line x1="8" y1="5" x2="8" y2="45" stroke={color} strokeWidth="2" />
        {/* Horizontal connector */}
        <line x1="8" y1="25" x2="20" y2="25" stroke={color} strokeWidth="2" />
        {/* Circle */}
        <circle cx="38" cy="25" r="17" fill="white" stroke={color} strokeWidth="2" />
      </svg>
      <div onClick={handleLabelContainerClick}>
        <NodeLabel
          placeholder="View Name"
          value={currentLabel}
          onChange={handleLabelChange}
          hidePlaceholder={hidePlaceholder}
        />
      </div>
      {hasLifeline && (
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', marginTop: '8px' }}>
          <div
            style={{
              width: '2px',
              height: `${lifelineLength}px`,
              backgroundColor: selected ? '#E60000' : '#333',
              borderStyle: 'dashed',
              borderWidth: '0 1px 0 0',
              borderColor: selected ? '#E60000' : '#666',
              pointerEvents: 'none',
            }}
          />
          <Handle
            id="lifeline"
            type="source"
            position={Position.Right}
            isConnectable={isConnectable}
            style={{
              position: 'absolute',
              top: 0,
              left: '50%',
              right: 'auto',
              transform: 'translateX(-50%)',
              width: '16px',
              height: `${lifelineLength}px`,
              opacity: 0,
              cursor: 'crosshair',
              borderRadius: 0,
            }}
          />
        </div>
      )}
    </div>
  );
};
