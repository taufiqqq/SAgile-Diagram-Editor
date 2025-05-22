import React, { useState } from 'react';
import { useReactFlow } from '@xyflow/react';
import { EdgeType } from '../types/EdgeTypes.types';
import EdgeTypeSelectorModal from './EdgeTypeSelectorModal';

interface EdgeTypeSelectorPortalProps {
  id: string;
  selected: boolean;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  currentType: EdgeType;
  source: String;
  target: String;
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
  source,
  target,
}) => {
  const { setEdges } = useReactFlow();
  const [open, setOpen] = useState(false);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });

  if (!selected) return null;

  // Calculate the center position of the edge in flow coordinates
  const centerX = (sourceX + targetX) / 2;
  const centerY = (sourceY + targetY) / 2;

  const buttonSize = 28;
  const verticalOffset = 17;

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Get the click position relative to the viewport
    const rect = e.currentTarget.getBoundingClientRect();
    const viewportX = rect.left + window.scrollX;
    const viewportY = rect.bottom + window.scrollY;
    
    setModalPosition({
      x: viewportX,
      y: viewportY + 5 // Position it 5px below the button
    });
    setOpen(true);
  };

  const handleTypeChange = (type: EdgeType) => {
    // Check if both source and target are use cases
    if (type === 'association' && 
        source.toString().toLowerCase().startsWith('usecase') && 
        target.toString().toLowerCase().startsWith('usecase')) {
      setOpen(false);
      return;
    }

    setEdges((eds) =>
      eds.map((edge) =>
        edge.id === id
          ? { ...edge, type, data: { ...edge.data, type } }
          : edge
      )
    );
    setOpen(false);
  };

  return (
    <>
      <foreignObject
        x={centerX - buttonSize / 2}
        y={centerY - buttonSize / 2 + verticalOffset}
        width={buttonSize}
        height={buttonSize}
        style={{ overflow: 'visible', pointerEvents: 'all' }}
      >
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
          }}
          onClick={handleButtonClick}
        >
          <svg width="16" height="16" fill="none" stroke="#222" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
          </svg>
        </button>
      </foreignObject>
      {open && (
        <EdgeTypeSelectorModal
          position={modalPosition}
          onClose={() => setOpen(false)}
          onSelect={handleTypeChange}
          currentType={currentType}
          source={source.toString()}
          target={target.toString()}
        />
      )}
    </>
  );
};

export default EdgeTypeSelectorPortal; 