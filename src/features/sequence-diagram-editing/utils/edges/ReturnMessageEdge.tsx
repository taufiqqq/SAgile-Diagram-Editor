import React from 'react';
import { EdgeProps, getStraightPath, EdgeLabelRenderer } from '@xyflow/react';

const ReturnMessageEdge: React.FC<EdgeProps> = ({
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
  const arrowSize = 8;

  return (
    <>
      {/* Main path - dashed for return message */}
      <path
        id={id}
        style={{
          ...style,
          stroke: selected ? '#E60000' : '#666',
          strokeWidth: 1.5,
          strokeDasharray: '5,3',
          fill: 'none',
          cursor: 'pointer',
        }}
        className="react-flow__edge-path"
        d={edgePath}
      />

      {/* Open arrow head for return message */}
      <path
        d={`M 0,-${arrowSize/2} L ${arrowSize},0 L 0,${arrowSize/2}`}
        style={{
          stroke: selected ? '#E60000' : '#666',
          strokeWidth: 1.5,
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
              fontSize: '10px',
              fontStyle: 'italic',
              color: '#666',
              border: selected ? '1px solid #E60000' : '1px solid #ddd',
              pointerEvents: 'all',
            }}
            className="nodrag nopan"
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};

export default ReturnMessageEdge;
