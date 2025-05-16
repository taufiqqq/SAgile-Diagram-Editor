import React from 'react';
import { EdgeProps } from '@xyflow/react';

/**
 * GeneralizationEdge renders a UML generalization edge:
 * - Step (zig-zag) line (custom implementation)
 * - Large white triangle at the target (arrowhead)
 */
const GeneralizationEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  style = {},
}) => {
  // Calculate angle for triangle orientation
  const dx = targetX - sourceX;
  const dy = targetY - sourceY;
  const angle = Math.atan2(dy, dx);
  // Triangle size
  const size = 24;
  // Triangle points (pointing to target)
  const tipX = targetX;
  const tipY = targetY;
  const baseLeftX = targetX - size * Math.cos(angle) + (size / 2) * Math.sin(angle);
  const baseLeftY = targetY - size * Math.sin(angle) - (size / 2) * Math.cos(angle);
  const baseRightX = targetX - size * Math.cos(angle) - (size / 2) * Math.sin(angle);
  const baseRightY = targetY - size * Math.sin(angle) + (size / 2) * Math.cos(angle);

  // Custom step (zig-zag) path logic
  // We'll do a horizontal step, then vertical, then horizontal to the base of the triangle
  const midX = sourceX + (targetX - sourceX) / 2;
  const midY = sourceY + (targetY - sourceY) / 2;
  // The last point should be at the base of the triangle
  const midBaseX = (baseLeftX + baseRightX) / 2;
  const midBaseY = (baseLeftY + baseRightY) / 2;
  const path = `M${sourceX},${sourceY} L${midX},${sourceY} L${midX},${targetY} L${midBaseX},${midBaseY}`;

  return (
    <g>
      {/* Step (zig-zag) edge line (ends at the base of the triangle) */}
      <path
        id={id}
        className="react-flow__edge-path"
        d={path}
        style={{
          ...style,
          stroke: '#222',
          strokeWidth: 2,
          fill: 'none',
        }}
      />
      {/* White-filled triangle with black border */}
      <polygon
        points={`${tipX},${tipY} ${baseLeftX},${baseLeftY} ${baseRightX},${baseRightY}`}
        style={{
          fill: '#fff',
          stroke: '#222',
          strokeWidth: 2,
        }}
      />
    </g>
  );
};

export default GeneralizationEdge; 