import { memo } from 'react';
import { ShapeNodeData } from '../types/NodeTypes.types';

const PackageNode = ({ data }: { data: ShapeNodeData }) => {
  const width = 300;
  const height = 200;
  const titleHeight = 30;

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        pointerEvents: 'none'
      }}
    >
      <svg
        width={width}
        height={height}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          overflow: 'visible',
        }}
      >
        {/* Debug background to verify rendering */}
        <rect
          x="0"
          y="0"
          width={width}
          height={height}
          fill="rgba(200, 200, 200, 0.0)"
          stroke="black"
          strokeWidth="2"
        />
        {/* Title separator line */}
        <line
          x1="0"
          y1={titleHeight}
          x2={width}
          y2={titleHeight}
          stroke="black"
          strokeWidth="2"
        />
        {/* Title text */}
        <text
          x={width / 2}
          y={titleHeight / 2}
          dominantBaseline="middle"
          textAnchor="middle"
          fontSize="14"
          fill="black"
        >
          {data.label}
        </text>
      </svg>
    </div>
  );
};

export default memo(PackageNode); 