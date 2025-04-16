import React from 'react';
import { EdgeProps, getStraightPath } from '@xyflow/react';
import EdgeTypeSelector from './EdgeTypeSelector';
import { EdgeType } from '../types/EdgeTypes.types';

const CustomEdge: React.FC<EdgeProps & { data?: { type?: EdgeType } }> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  style = {},
  selected,
  data = { type: 'association' },
}) => {
  const [edgePath] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const edgeType: EdgeType = data.type || 'association';

  return (
    <>
      <path
        id={id}
        style={{
          ...style,
          strokeWidth: 20, // Make the clickable area wider
          stroke: 'transparent', // Make the wider area invisible
          cursor: 'pointer',
        }}
        className="react-flow__edge-path"
        d={edgePath}
      />
      <path
        id={`${id}-visible`}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
      />
      {selected && (
        <foreignObject
          x={(sourceX + targetX) / 2 - 75}
          y={(sourceY + targetY) / 2 - 20}
          width={150}
          height={40}
          style={{ 
            overflow: 'visible', 
            pointerEvents: 'all',
            zIndex: 1000
          }}
        >
          <div style={{ 
            position: 'absolute',
            background: 'white',
            padding: '4px',
            borderRadius: '4px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            gap: '4px'
          }}>
            <button
              style={{
                padding: '4px 8px',
                border: '1px solid #e5e7eb',
                borderRadius: '4px',
                background: edgeType === 'association' ? '#3b82f6' : 'white',
                color: edgeType === 'association' ? 'white' : 'black',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              Association
            </button>
            <button
              style={{
                padding: '4px 8px',
                border: '1px solid #e5e7eb',
                borderRadius: '4px',
                background: edgeType === 'include' ? '#10B981' : 'white',
                color: edgeType === 'include' ? 'white' : 'black',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              Include
            </button>
            <button
              style={{
                padding: '4px 8px',
                border: '1px solid #e5e7eb',
                borderRadius: '4px',
                background: edgeType === 'exclude' ? '#EF4444' : 'white',
                color: edgeType === 'exclude' ? 'white' : 'black',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              Exclude
            </button>
          </div>
        </foreignObject>
      )}
    </>
  );
};

export default CustomEdge; 