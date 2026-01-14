import React from 'react';
import { EdgeProps, getStraightPath, EdgeLabelRenderer } from '@xyflow/react';

const CreateMessageEdge: React.FC<EdgeProps> = ({
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
      {/* Main path - dashed for create message */}
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

      {/* Solid arrow head for create message */}
      <polygon
        points={`0,-${arrowSize/2} ${arrowSize},0 0,${arrowSize/2}`}
        style={{
          fill: selected ? '#E60000' : '#222',
          transform: `translate(${targetX}px, ${targetY}px) rotate(${angle}rad) translate(-${arrowSize}px, 0)`,
        }}
      />

      {/* Edge label with <<create>> stereotype */}
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
          <div style={{ fontSize: '9px', color: '#666' }}>&lt;&lt;create&gt;&gt;</div>
          {label && <div>{label}</div>}
          {data?.parameters && (
            <span style={{ color: '#666' }}>({data.parameters})</span>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

export default CreateMessageEdge;
