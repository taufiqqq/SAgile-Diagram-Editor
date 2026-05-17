import React, { useState, useEffect } from 'react';
import { Handle, Position } from '@xyflow/react';
import NodeLabel from "../../../diagram-editing/utils/shapes-react-flow/Label";

interface SequenceControlHtmlProps {
  label: string;
  selected: boolean;
  onLabelChange?: (newLabel: string) => void;
  hidePlaceholder?: boolean;
  hasLifeline?: boolean;
  lifelineLength?: number;
  isConnectable?: boolean;
}

export const SequenceControlHtml = ({
  label,
  selected,
  onLabelChange,
  hidePlaceholder = false,
  hasLifeline = true,
  lifelineLength = 400,
  isConnectable = true,
}: SequenceControlHtmlProps) => {
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
      {/* Control icon: circle with a small filled arrowhead at its top */}
      <svg width="64" height="50" viewBox="0 0 50 58" style={{ display: 'block', overflow: 'visible' }}>
        {/* Circle */}
        <circle cx="25" cy="36" r="18" fill="white" stroke={color} strokeWidth="2" />
        {/* Arc from top-left of circle curving to top-right */}
        <path
          d="M 17 20 A 11 11 0 0 1 35 22"
          fill="none"
          stroke={color}
          strokeWidth="2"
        />
        {/* Filled arrowhead at the end of the arc (top-right) */}
        <polygon points="35,16 40,24 30,23" fill={color} />
      </svg>
      <div onClick={handleLabelContainerClick}>
        <NodeLabel
          placeholder="Controller Name"
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
