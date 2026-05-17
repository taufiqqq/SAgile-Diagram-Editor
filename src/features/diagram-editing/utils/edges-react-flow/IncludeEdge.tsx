import React from 'react';
import { EdgeProps, getStraightPath } from '@xyflow/react';
import EdgeTypeSelectorPortal from '../../components/EdgeTypeSelectorPortal';

const IncludeEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  style = {},
  selected,
  target,
  source
}) => {
  const [edgePath] = getStraightPath({ sourceX, sourceY, targetX, targetY });

  return (
    <>
      <defs>
        <marker
          id="include-arrow"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#000000" />
        </marker>
      </defs>
      <path
        id={id}
        style={{
          ...style,
          stroke: '#000000',
          strokeWidth: 2,
          fill: 'none',
          strokeDasharray: '5 5',
          cursor: 'pointer',
        }}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd="url(#include-arrow)"
      />
      <text
        x={(sourceX + targetX) / 2}
        y={(sourceY + targetY) / 2 - 10}
        textAnchor="middle"
        style={{
          fill: '#000000',
          fontFamily: 'monospace',
          fontSize: '12px',
          pointerEvents: 'none',
        }}
      >
        {'«include»'}
      </text>
      {selected && (
        <EdgeTypeSelectorPortal
          id={id}
          selected={selected}
          sourceX={sourceX}
          sourceY={sourceY}
          targetX={targetX}
          targetY={targetY}
          currentType="include"
          target={target}
          source={source}
        />
      )}
    </>
  );
};

export default IncludeEdge;