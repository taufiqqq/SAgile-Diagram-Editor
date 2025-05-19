import React from 'react';
import { EdgeProps, getSmoothStepPath, Position } from '@xyflow/react';

const GeneralizationEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition = Position.Right,
  targetPosition = Position.Left,
  style = {},
  selected,
}) => {
  // Get smooth step path
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // Find the significant segment of the path (the last visible segment)
  function getSignificantSegment(path: string) {
    // Extract all path segments
    const segments = [...path.matchAll(/([ML])\s*([-\d.]+),\s*([-\d.]+)/g)];
    if (segments.length < 2) return null;

    // Find the last two points with a significant distance
    const last = segments[segments.length - 1];
    let prev = segments[segments.length - 2];
    
    // Calculate distance between last points
    const x1 = parseFloat(prev[2]);
    const y1 = parseFloat(prev[3]);
    const x2 = parseFloat(last[2]);
    const y2 = parseFloat(last[3]);
    
    // If the distance is too small, go back one more segment
    const minDistance = 10; // Minimum significant distance in pixels
    const dist = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    
    if (dist < minDistance && segments.length > 2) {
      prev = segments[segments.length - 3];
    }
    
    return {
      x1: parseFloat(prev[2]),
      y1: parseFloat(prev[3]),
      x2: parseFloat(last[2]),
      y2: parseFloat(last[3]),
    };
  }

  const segment = getSignificantSegment(edgePath);
  if (!segment) return null;

  // Determine the dominant direction based on target position
  let angle;
  
  // Use targetPosition to determine the primary angle direction
  switch (targetPosition) {
    case Position.Left:
      angle = Math.PI; // Arrow pointing left (180°)
      break;
    case Position.Right:
      angle = 0; // Arrow pointing right (0°)
      break;
    case Position.Top:
      angle = -Math.PI / 2; // Arrow pointing up (-90°)
      break;
    case Position.Bottom:
      angle = Math.PI / 2; // Arrow pointing down (90°)
      break;
    default:
      // Fallback to calculating from segment
      const dx = segment.x2 - segment.x1;
      const dy = segment.y2 - segment.y1;
      
      if (Math.abs(dx) > Math.abs(dy)) {
        // Horizontal dominant
        angle = dx > 0 ? 0 : Math.PI; // 0° or 180°
      } else {
        // Vertical dominant
        angle = dy > 0 ? Math.PI / 2 : -Math.PI / 2; // 90° or -90°
      }
  }

  // Triangle size and points
  const size = 18;
  const tipX = targetX;
  const tipY = targetY;

  // Calculate triangle points based on the determined angle
const baseLeftX = tipX - size * Math.cos(angle + Math.PI) + (size / 2) * Math.sin(angle + Math.PI);
const baseLeftY = tipY - size * Math.sin(angle + Math.PI) - (size / 2) * Math.cos(angle + Math.PI);
const baseRightX = tipX - size * Math.cos(angle + Math.PI) - (size / 2) * Math.sin(angle + Math.PI);
const baseRightY = tipY - size * Math.sin(angle + Math.PI) + (size / 2) * Math.cos(angle + Math.PI);

  // Calculate where the line should end (at the base of the triangle)
  const endX = tipX - size * Math.cos(angle);
  const endY = tipY - size * Math.sin(angle);

  return (
    <g>
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        style={{
          ...style,
          stroke: '#222',
          strokeWidth: 2,
          fill: 'none',
        }}
      />
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