import React, { useState, useEffect } from 'react';
import { Handle, Position } from '@xyflow/react';
import NodeLabel from "../../../diagram-editing/utils/shapes-react-flow/Label";

interface SequenceActorHtmlProps {
  label: string;
  width?: number;
  selected: boolean;
  onLabelChange?: (newLabel: string) => void;
  hidePlaceholder?: boolean;
  hasLifeline?: boolean;
  lifelineLength?: number;
  isConnectable?: boolean;
}

export const SequenceActorHtml = ({
  label,
  selected,
  width = 100,
  onLabelChange,
  hidePlaceholder = false,
  hasLifeline = true,
  lifelineLength = 400,
  isConnectable = true,
}: SequenceActorHtmlProps) => {
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <img
        draggable
        width={width}
        src="/actor.svg"
        style={{
          filter: selected
            ? 'brightness(0) saturate(100%) invert(21%) sepia(93%) saturate(7473%) hue-rotate(-1deg) brightness(96%) contrast(107%)'
            : 'none',
          width: '34px',
          height: '50px'
        }}
        alt="Actor Icon"
        className="actor-icon"
      />
      <div onClick={handleLabelContainerClick}>
        <NodeLabel
          placeholder="<<actor>>"
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
