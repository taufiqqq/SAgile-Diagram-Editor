import React from "react";
import { EdgeProps, getSmoothStepPath, Position } from "@xyflow/react";
import EdgeTypeSelectorPortal from "../../components/EdgeTypeSelectorPortal";

/**
 * GeneralizationEdge Component
 * 
 * Renders a UML generalization edge (inheritance relationship) with a hollow triangular arrowhead.
 * This represents an "is-a" relationship in UML diagrams where the child class inherits from the parent class.
 * 
 * Features:
 * - Smooth step path routing between nodes
 * - Hollow triangle arrowhead pointing to the parent class
 * - Dynamic arrow positioning based on connection handles
 * - Edge type selector when selected
 */
const GeneralizationEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition = Position.Top,
  targetPosition = Position.Bottom,
  style = {},
  selected,
  target,
  source
}) => {
  // Generate smooth step path for edge routing
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });  

  /**
   * Analyzes the SVG path and extracts the most significant segment for arrow positioning.
   * This ensures the arrow is placed at the end of a visible line segment, not on tiny connector segments.
   * 
   * @param path - SVG path string containing Move (M) and Line (L) commands
   * @returns Object with start and end coordinates of the significant segment
   */
  function getSignificantSegment(path: string) {  // Extract all Move and Line commands with their coordinates using regex
  const segments = [...path.matchAll(/([ML])\s*([-\d.]+),\s*([-\d.]+)/g)];

  // Handle single segment case (direct line)
  if (segments.length === 1) {
    const single = segments[0];
    const x = parseFloat(single[2]);
    const y = parseFloat(single[3]);
    return {
      x1: x, // Start and end points are the same for a single segment
      y1: y,
      x2: x,
      y2: y,
    };
  }

  // Validate minimum segments required
  if (segments.length < 2) {
    console.warn("Path has fewer than 2 segments. Cannot process.");
    return null;
  }

  // Get the last two segments for arrow positioning
  const last = segments[segments.length - 1];
  let prev = segments[segments.length - 2];

  const x1 = parseFloat(prev[2]);
  const y1 = parseFloat(prev[3]);
  const x2 = parseFloat(last[2]);
  const y2 = parseFloat(last[3]);

  // Check if the last segment is too short (might be a connector segment)
  const minDistance = 10;
  const dist = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

  // Use third-to-last segment if last segment is too short
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

  // Get the significant segment for arrow positioning
  const segment = getSignificantSegment(edgePath);
  if (!segment) return null;

  // Calculate arrow rotation angle based on target position
  // This ensures the triangle points in the correct direction regardless of edge orientation
  let angle;
  switch (targetPosition) {
    case Position.Left:
      angle = Math.PI; // 180° - arrow points left
      break;
    case Position.Right:
      angle = 0; // 0° - arrow points right
      break;
    case Position.Top:
      angle = -Math.PI / 2; // -90° - arrow points up
      break;
    case Position.Bottom:
      angle = Math.PI / 2; // 90° - arrow points down
      break;
    default:
      // Fallback: calculate angle based on edge direction
      const dx = targetX - sourceX;
      const dy = targetY - sourceY;

      if (Math.abs(dx) > Math.abs(dy)) {
        angle = dx > 0 ? 0 : Math.PI; // Horizontal dominant
      } else {
        angle = dy > 0 ? Math.PI / 2 : -Math.PI / 2; // Vertical dominant
      }
  }

  // Triangle arrowhead dimensions and positioning
  const size = 18; // Triangle size
  const tipX = targetX; // Arrow tip at target position
  const tipY = targetY;

  // Calculate triangle base points using trigonometry
  // Creates an equilateral triangle pointing towards the target
  const baseLeftX =
    tipX -
    size * Math.cos(angle + Math.PI) +
    (size / 2) * Math.sin(angle + Math.PI);
  const baseLeftY =
    tipY -
    size * Math.sin(angle + Math.PI) -
    (size / 2) * Math.cos(angle + Math.PI);
  const baseRightX =
    tipX -
    size * Math.cos(angle + Math.PI) -
    (size / 2) * Math.sin(angle + Math.PI);
  const baseRightY =
    tipY -
    size * Math.sin(angle + Math.PI) +
    (size / 2) * Math.cos(angle + Math.PI);  return (
    <g>
      {/* Main edge path - the line connecting the nodes */}
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        style={{
          ...style,
          stroke: "#222",
          strokeWidth: 2,
          fill: "none",
        }}
      />
      {/* Hollow triangle arrowhead representing generalization/inheritance */}
      <polygon
        points={`${tipX},${tipY} ${baseLeftX},${baseLeftY} ${baseRightX},${baseRightY}`}
        style={{
          fill: "#fff", // White fill makes it hollow
          stroke: "#222", // Black border
          strokeWidth: 2,
        }}
      />
      {/* Edge type selector portal - appears when edge is selected */}
      {selected && (
        <EdgeTypeSelectorPortal
          id={id}
          selected={selected}
          sourceX={sourceX}
          sourceY={sourceY}
          targetX={targetX}
          targetY={targetY}
          currentType="generalization"
          target={target}
          source={source}
        />
      )}
    </g>
  );
};

export default GeneralizationEdge;
