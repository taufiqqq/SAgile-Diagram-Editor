import React from 'react';
import { EdgeProps, getStraightPath } from '@xyflow/react';
import EdgeTypeSelectorPortal from '../../components/EdgeTypeSelectorPortal';

const ExcludeEdge: React.FC<EdgeProps> = ({
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
    <>
      <defs>
        <marker
          id="exclude-arrow"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#EF4444" />
        </marker>
      </defs>
      <path
        id={id}
        style={{
          ...style,
          stroke: '#EF4444',
          strokeWidth: 2,
          fill: 'none',
          strokeDasharray: '5 5',
          cursor: 'pointer',
        }}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd="url(#exclude-arrow)"
      />
      <text
        x={(sourceX + targetX) / 2}
        y={(sourceY + targetY) / 2 - 10}
        textAnchor="middle"
        style={{
          fill: '#EF4444',
          fontFamily: 'monospace',
          fontSize: '12px',
          pointerEvents: 'none',
        }}
      >
        {'«exclude»'}
      </text>
      {selected && (
        <EdgeTypeSelectorPortal
          id={id}
          selected={selected}
          sourceX={sourceX}
          sourceY={sourceY}
          targetX={targetX}
          targetY={targetY}
          currentType="exclude"
        />
      )}
    </>
  );
};

export default ExcludeEdge;