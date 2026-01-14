import React from 'react';
import { EdgeProps, getStraightPath, EdgeLabelRenderer } from '@xyflow/react';

const AsynchronousMessageEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  style = {},
  selected,
  label,
  data,
}) => {
  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY
  });

  // Calculate arrow direction
  const angle = Math.atan2(targetY - sourceY, targetX - sourceX);
  const arrowSize = 10;

  return (
    <>
      {/* Main path - dashed for asynchronous */}
      <path
        id={id}
        style={{
          ...style,
          stroke: selected ? '#E60000' : '#222',
          strokeWidth: 2,
          strokeDasharray: '5,5',
          fill: 'none',
          cursor: 'pointer',
        }}
        className="react-flow__edge-path"
        d={edgePath}
      />

      {/* Open arrow head for asynchronous message */}
      <path
        d={`M 0,-${arrowSize/2} L ${arrowSize},0 L 0,${arrowSize/2}`}
        style={{
          stroke: selected ? '#E60000' : '#222',
          strokeWidth: 2,
          fill: 'none',
          transform: `translate(${targetX}px, ${targetY}px) rotate(${angle}rad) translate(-${arrowSize}px, 0)`,
        }}
      />

      {/* Edge label */}
      {label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY - 10}px)`,
              background: '#fff',
              padding: '2px 6px',
              borderRadius: '3px',
              fontSize: '11px',
              fontWeight: 500,
              border: selected ? '1px solid #E60000' : '1px solid #ddd',
              pointerEvents: 'all',
            }}
            className="nodrag nopan"
          >
            {label}
            {data?.parameters && (
              <span style={{ color: '#666' }}>({data.parameters})</span>
            )}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};

export default AsynchronousMessageEdge;
