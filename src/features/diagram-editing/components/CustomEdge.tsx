import React from 'react';
import { EdgeProps, getStraightPath, useReactFlow, MarkerType } from '@xyflow/react';
import { EdgeType } from '../types/EdgeTypes.types';
import { useFlowState } from '../hooks/useFlowState';

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
  const { setEdges } = useReactFlow();
  const { takeSnapshot } = useFlowState();
  const [edgePath] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const edgeType: EdgeType = data.type || 'association';

  const handleTypeChange = (type: EdgeType) => {
    // Take snapshot before the change
    takeSnapshot();

    setEdges((eds) =>
      eds.map((edge) => {
        if (edge.id === id) {
          return {
            ...edge,
            data: { ...edge.data, type },
            style: { 
              ...edge.style,
              strokeDasharray: type === 'association' ? undefined : '5 5' 
            },
            label: type === 'association' ? undefined : `«${type}»`,
            labelStyle: { fill: '#000', fontFamily: 'monospace' },
            animated: false,
            markerEnd: type === 'association' ? undefined : {
              type: MarkerType.ArrowClosed,
              width: 20,
              height: 20,
              color: '#b1b1b7',
            },
          };
        }
        return edge;
      })
    );

    // Take snapshot after the change
    takeSnapshot();
  };

  return (
    <>
      <defs>
        <marker
          id="arrow"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#b1b1b7" />
        </marker>
      </defs>
      <path
        id={id}
        style={{
          ...style,
          strokeWidth: 30,
          stroke: 'transparent',
          cursor: 'pointer',
        }}
        className="react-flow__edge-path"
        d={edgePath}
      />
      <path
        id={`${id}-visible`}
        style={{
          ...style,
          strokeDasharray: edgeType === 'association' ? undefined : '5 5',
        }}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={edgeType === 'association' ? undefined : "url(#arrow)"}
      />
      {edgeType !== 'association' && (
        <text
          x={(sourceX + targetX) / 2}
          y={(sourceY + targetY) / 2 - 10}
          textAnchor="middle"
          style={{
            fill: '#000',
            fontFamily: 'monospace',
            fontSize: '12px',
            pointerEvents: 'none',
          }}
        >
          {`«${edgeType}»`}
        </text>
      )}
      {selected && (
        <foreignObject
          x={(sourceX + targetX) / 2 - 50}
          y={(sourceY + targetY) / 2 - 40}
          width={100}
          height={30}
          style={{ 
            overflow: 'visible', 
            pointerEvents: 'all',
            zIndex: 1000
          }}
        >
          <div style={{ 
            position: 'absolute',
            background: 'white',
            padding: '2px',
            borderRadius: '4px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            gap: '2px'
          }}>
            <button
              onClick={() => handleTypeChange('association')}
              style={{
                padding: '2px 4px',
                border: '1px solid #e5e7eb',
                borderRadius: '4px',
                background: edgeType === 'association' ? '#3b82f6' : 'white',
                color: edgeType === 'association' ? 'white' : 'black',
                cursor: 'pointer',
                fontSize: '10px'
              }}
            >
              Association
            </button>
            <button
              onClick={() => handleTypeChange('include')}
              style={{
                padding: '2px 4px',
                border: '1px solid #e5e7eb',
                borderRadius: '4px',
                background: edgeType === 'include' ? '#10B981' : 'white',
                color: edgeType === 'include' ? 'white' : 'black',
                cursor: 'pointer',
                fontSize: '10px'
              }}
            >
              Include
            </button>
            <button
              onClick={() => handleTypeChange('exclude')}
              style={{
                padding: '2px 4px',
                border: '1px solid #e5e7eb',
                borderRadius: '4px',
                background: edgeType === 'exclude' ? '#EF4444' : 'white',
                color: edgeType === 'exclude' ? 'white' : 'black',
                cursor: 'pointer',
                fontSize: '10px'
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