import { memo } from 'react';
import { ShapeNodeData } from '../types/NodeTypes.types';
import { NodeResizer, useReactFlow } from '@xyflow/react';
import { useNodeDimensions } from '../hooks/useNodeDimensions';

interface PackageNodeProps {
  id: string;
  data: ShapeNodeData;
  selected?: boolean;
}

const PackageNode = ({ id, data, selected = false }: PackageNodeProps) => {
  const { setNodes } = useReactFlow();
  const defaultWidth = 300;
  const { width: measuredWidth, height: measuredHeight } = useNodeDimensions(id);
  
  // Use measured dimensions from React Flow, fallback to data properties, or defaults
  const width = measuredWidth || (data.width as number) || defaultWidth;
  const height = measuredHeight || (data.height as number) || 200;
  const titleHeight = 30;

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        pointerEvents: 'auto'
      }}
    >
      <NodeResizer
        color="#555"
        isVisible={selected}
        minWidth={200}
        minHeight={100}
      />
      
      <svg
        width="100%"
        height="100%"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          overflow: 'visible',
        }}
      >
        {/* Package background - transparent */}
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="transparent"
          stroke="black"
          strokeWidth="2"
        />
        {/* Title separator line */}
        <line
          x1="0"
          y1={titleHeight}
          x2="100%"
          y2={titleHeight}
          stroke="black"
          strokeWidth="2"
        />
        {/* Title text */}
        <text
          x="50%"
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