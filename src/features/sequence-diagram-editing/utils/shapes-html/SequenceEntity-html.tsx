import React, { useState, useEffect } from 'react';
import { Handle, Position } from '@xyflow/react';
import NodeLabel from "../../../diagram-editing/utils/shapes-react-flow/Label";

interface SequenceEntityHtmlProps {
  label: string;
  selected: boolean;
  onLabelChange?: (newLabel: string) => void;
  hidePlaceholder?: boolean;
  hasLifeline?: boolean;
  lifelineLength?: number;
  isConnectable?: boolean;
}

export const SequenceEntityHtml = ({
  label,
  selected,
  onLabelChange,
  hidePlaceholder = false,
  hasLifeline = true,
  lifelineLength = 400,
  isConnectable = true,
}: SequenceEntityHtmlProps) => {
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
      {/* Entity icon: circle with a horizontal line underneath */}
      <svg width="50" height="52" viewBox="0 0 50 52" style={{ display: 'block', overflow: 'visible' }}>
        {/* Circle */}
        <circle cx="25" cy="22" r="18" fill="white" stroke={color} strokeWidth="2" />
        {/* Horizontal line below */}
        <line x1="7" y1="44" x2="43" y2="44" stroke={color} strokeWidth="2" />
      </svg>
      <div onClick={handleLabelContainerClick}>
        <NodeLabel
          placeholder="Entity Name"
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
