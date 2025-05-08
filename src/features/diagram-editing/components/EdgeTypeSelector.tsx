import React from 'react';
import { useReactFlow, MarkerType } from '@xyflow/react';
import { EdgeType } from '../types/EdgeTypes.types';

interface EdgeTypeSelectorProps {
  id: string;
  selected?: boolean;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  currentType: EdgeType;
}

const EdgeTypeSelector: React.FC<EdgeTypeSelectorProps> = ({ 
  id, 
  selected = false,
  sourceX,
  sourceY,
  targetX,
  targetY,
  currentType
}) => {
  const { setEdges } = useReactFlow();
  const centerX = (sourceX + targetX) / 2;
  const centerY = (sourceY + targetY) / 2;

  const handleTypeChange = (type: EdgeType) => {
    setEdges((eds) =>
      eds.map((edge) => {
        if (edge.id === id) {
          return {
            ...edge,
            type,
            data: { ...edge.data, type },
            style: { strokeDasharray: type === 'association' ? undefined : '5 5' },
            label: type === 'association' ? undefined : `«${type}»`,
            labelStyle: { fill: '#000', fontFamily: 'monospace' },
            markerEnd: {
              type: MarkerType.ArrowClosed,
            },
            sourceHandle: 'right',
            targetHandle: 'left',
          };
        }
        return edge;
      })
    );
  };

  return (
    <foreignObject
      x={centerX - 75}
      y={centerY - 20}
      width={150}
      height={40}
      style={{ overflow: 'visible', pointerEvents: 'all' }}
    >
      <div style={{ 
        position: 'absolute',
zIndex: 1000000,
        background: 'white',
        padding: '4px',
        borderRadius: '4px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        gap: '4px'
      }}>
        <button
          onClick={() => handleTypeChange('association')}
          style={{
            padding: '4px 8px',
            border: '1px solid #e5e7eb',
            borderRadius: '4px',
            background: currentType === 'association' ? '#3b82f6' : 'white',
            color: currentType === 'association' ? 'white' : 'black',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Association
        </button>
        <button
          onClick={() => handleTypeChange('include')}
          style={{
            padding: '4px 8px',
            border: '1px solid #e5e7eb',
            borderRadius: '4px',
            background: currentType === 'include' ? '#10B981' : 'white',
            color: currentType === 'include' ? 'white' : 'black',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Include
        </button>
        <button
          onClick={() => handleTypeChange('exclude')}
          style={{
            padding: '4px 8px',
            border: '1px solid #e5e7eb',
            borderRadius: '4px',
            background: currentType === 'exclude' ? '#EF4444' : 'white',
            color: currentType === 'exclude' ? 'white' : 'black',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Exclude
        </button>
      </div>
    </foreignObject>
  );
};

export default EdgeTypeSelector; 