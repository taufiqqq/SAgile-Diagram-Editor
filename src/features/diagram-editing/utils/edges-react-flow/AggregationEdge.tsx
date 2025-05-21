import React from 'react';
import { EdgeProps, getStraightPath } from '@xyflow/react';
import EdgeTypeSelectorPortal from '../../components/EdgeTypeSelectorPortal';

const AggregationEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  style = {},
  selected,
}) => {
  const [edgePath] = getStraightPath({ sourceX, sourceY, targetX, targetY });

  return (
    <g>
      <defs>
        {/* Define the border diamond marker */}
        <marker
          id="aggregation-diamond"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="10"
          markerHeight="10"
          orient="auto-start-reverse"
        >
          <path d="M 0 5 L 5 0 L 10 5 L 5 10 Z" fill="#ffffff" stroke="#000000" strokeWidth="1" />
        </marker>
      </defs>
      {/* Render the straight line */}
      <path
        id={id}
        style={{
          ...style,
          stroke: '#000000', // Solid black line
          strokeWidth: 2,
          fill: 'none',
          cursor: 'pointer',
        }}
        className="react-flow__edge-path"
        d={edgePath}
        markerStart="url(#aggregation-diamond)" // Attach the border diamond to the source
      />
      {/* Add the EdgeTypeSelectorPortal when the edge is selected */}
      {selected && (
        <EdgeTypeSelectorPortal
          id={id}
          selected={selected}
          sourceX={sourceX}
          sourceY={sourceY}
          targetX={targetX}
          targetY={targetY}
          currentType="aggregation"
        />
      )}
    </g>
  );
};

export default AggregationEdge;