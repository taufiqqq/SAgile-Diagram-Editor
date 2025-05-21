import React from 'react';
import { EdgeProps, getStraightPath } from '@xyflow/react';
import EdgeTypeSelectorPortal from '../../components/EdgeTypeSelectorPortal';

const AssociationEdge: React.FC<EdgeProps> = ({
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
      <path
        id={id}
        style={{
          ...style,
          stroke: '#222',
          strokeWidth: 2,
          fill: 'none',
          cursor: 'pointer',
        }}
        className="react-flow__edge-path"
        d={edgePath}
      />
      {selected && (
        <EdgeTypeSelectorPortal
          id={id}
          selected={selected}
          sourceX={sourceX}
          sourceY={sourceY}
          targetX={targetX}
          targetY={targetY}
          currentType="association"
        />
      )}
    </>
  );
};

export default AssociationEdge;