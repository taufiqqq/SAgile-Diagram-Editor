import React, { useState } from 'react';
import { useReactFlow } from '@xyflow/react';
import { EdgeType } from '../types/EdgeTypes.types';

interface EdgeTypeSelectorPortalProps {
  id: string;
  selected: boolean;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  currentType: EdgeType;
}

const EDGE_TYPES: EdgeType[] = [
  'association',
  'include',
  'extend',
  'generalization',
  'composition',
  'aggregation',
];

const EdgeTypeSelectorPortal: React.FC<EdgeTypeSelectorPortalProps> = ({
  id,
  selected,
  sourceX,
  sourceY,
  targetX,
  targetY,
  currentType,
}) => {
  const { setEdges } = useReactFlow();
  const [open, setOpen] = useState(false);

  if (!selected) return null;

  // Calculate the center position of the edge in flow coordinates
  const centerX = (sourceX + targetX) / 2;
  const centerY = (sourceY + targetY) / 2;

  // Define a fixed size for the foreignObject large enough for the dropdown
  const foWidth = 150; 
  const foHeight = 200; // Make this large enough to contain the open dropdown
  
  const verticalOffset = 17; // Pixels to move the button/dropdown down from the edge center

  // Position the foreignObject centered on the edge
  const foX = centerX - foWidth / 2; 
  const foY = centerY - foHeight / 2; 

  const handleTypeChange = (type: EdgeType) => {
    setEdges((eds) =>
      eds.map((edge) =>
        edge.id === id
          ? { ...edge, type, data: { ...edge.data, type } }
          : edge
      )
    );
    setOpen(false);
  };

  const buttonSize = 28;
  const dropdownMinWidth = 120;

  return (
    <foreignObject
      x={foX}
      y={foY}
      width={foWidth}
      height={foHeight}
      style={{ overflow: 'visible', pointerEvents: 'all' }}
    >
      <div className="edge-selector-container" style={{ position: 'relative', width: '100%', height: '100%' }}>
        <button
          style={{
            width: buttonSize,
            height: buttonSize,
            borderRadius: '50%',
            border: '1px solid #ccc',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            position: 'absolute',
            // Center button horizontally in FO, then center on edge center
            left: (foWidth / 2) - (buttonSize / 2),
            // Center button vertically in FO, then offset from edge center
            top: (foHeight / 2) - (buttonSize / 2) + verticalOffset, 
          }}
          onClick={() => setOpen((o) => !o)}
        >
          <svg width="16" height="16" fill="none" stroke="#222" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
          </svg>
        </button>
        {open && (
          <div
            style={{
              position: 'absolute',
              // Position dropdown below button
              top: (foHeight / 2) + (buttonSize / 2) + verticalOffset + 5, // 5px spacing below button
              left: (foWidth / 2) - (dropdownMinWidth / 2), // Center dropdown horizontally
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: 4,
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
              zIndex: 10,
              minWidth: dropdownMinWidth,
              padding: 4,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              pointerEvents: 'all',
            }}
          >
            {EDGE_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => handleTypeChange(type)}
                style={{
                  padding: '4px 8px',
                  background: currentType === type ? '#3b82f6' : 'white',
                  color: currentType === type ? 'white' : 'black',
                  border: 'none',
                  borderRadius: 3,
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '12px',
                  pointerEvents: 'all',
                }}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        )}
      </div>
    </foreignObject>
  );
};

export default EdgeTypeSelectorPortal; 