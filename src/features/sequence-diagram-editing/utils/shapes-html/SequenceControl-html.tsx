import React, { useState, useEffect } from 'react';
import NodeLabel from "../../../diagram-editing/utils/shapes-react-flow/Label";

interface SequenceControlHtmlProps {
  label: string;
  width?: number;
  height?: number;
  selected: boolean;
  onLabelChange?: (newLabel: string) => void;
  hidePlaceholder?: boolean;
  hasLifeline?: boolean;
  lifelineLength?: number;
}

export const SequenceControlHtml = ({
  label,
  selected,
  width = 120,
  height = 80,
  onLabelChange,
  hidePlaceholder = false,
  hasLifeline = true,
  lifelineLength = 400
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Control/Controller Circle with Arrow */}
      <div
        style={{
          position: 'relative',
          width: `${width}px`,
          height: `${height}px`,
          border: `2px solid ${selected ? '#E60000' : '#333'}`,
          borderRadius: '8px',
          backgroundColor: '#fff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '8px'
        }}
      >
        {/* Circle with arrow icon */}
        <div
          style={{
            position: 'absolute',
            left: '-15px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '30px',
            height: '30px',
            border: `2px solid ${selected ? '#E60000' : '#333'}`,
            borderRadius: '50%',
            backgroundColor: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          ↻
        </div>
        <div style={{ fontSize: '10px', color: '#666', marginBottom: '4px' }}>
          &lt;&lt;control&gt;&gt;
        </div>
        <div onClick={handleLabelContainerClick}>
          <NodeLabel
            placeholder="Controller Name"
            value={currentLabel}
            onChange={handleLabelChange}
            hidePlaceholder={hidePlaceholder}
          />
        </div>
      </div>
      {hasLifeline && (
        <div
          style={{
            width: '2px',
            height: `${lifelineLength}px`,
            backgroundColor: selected ? '#E60000' : '#333',
            marginTop: '8px',
            borderStyle: 'dashed',
            borderWidth: '0 1px 0 0',
            borderColor: selected ? '#E60000' : '#666'
          }}
        />
      )}
    </div>
  );
};
