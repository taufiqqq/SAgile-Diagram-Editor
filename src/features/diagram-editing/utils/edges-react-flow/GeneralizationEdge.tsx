import React from "react";
import { EdgeProps, getSmoothStepPath, Position } from "@xyflow/react";
import EdgeTypeSelectorPortal from "../../components/EdgeTypeSelectorPortal";

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
  const segments = [...path.matchAll(/([ML])\s*([-\d.]+),\s*([-\d.]+)/g)];

  // If there is only one segment, treat it as the significant segment
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

  // If there are fewer than two segments, return null (shouldn't happen with valid paths)
  if (segments.length < 2) {
    console.warn("Path has fewer than 2 segments. Cannot process.");
    return null;
  }

  const last = segments[segments.length - 1];
  let prev = segments[segments.length - 2];

  const x1 = parseFloat(prev[2]);
  const y1 = parseFloat(prev[3]);
  const x2 = parseFloat(last[2]);
  const y2 = parseFloat(last[3]);

  const minDistance = 10;
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

  let angle;
  switch (targetPosition) {
    case Position.Left:
      angle = Math.PI; // 180°
      break;
    case Position.Right:
      angle = 0; // 0°
      break;
    case Position.Top:
      angle = -Math.PI / 2; // -90°
      break;
    case Position.Bottom:
      angle = Math.PI / 2; // 90°
      break;
    default:
      const dx = targetX - sourceX;
      const dy = targetY - sourceY;

      if (Math.abs(dx) > Math.abs(dy)) {
        angle = dx > 0 ? 0 : Math.PI; // Horizontal dominant
      } else {
        angle = dy > 0 ? Math.PI / 2 : -Math.PI / 2; // Vertical dominant
      }
  }

  const size = 18;
  const tipX = targetX;
  const tipY = targetY;

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
    (size / 2) * Math.cos(angle + Math.PI);
  console.log("baseLeftX", baseLeftX);
  console.log("baseLeftY", baseLeftY);
  console.log("baseRightX", baseRightX);
  return (
    <g>
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
      <polygon
        points={`${tipX},${tipY} ${baseLeftX},${baseLeftY} ${baseRightX},${baseRightY}`}
        style={{
          fill: "#fff",
          stroke: "#222",
          strokeWidth: 2,
        }}
      />
      {selected && (
        <EdgeTypeSelectorPortal
          id={id}
          selected={selected}
          sourceX={sourceX}
          sourceY={sourceY}
          targetX={targetX}
          targetY={targetY}
          currentType="generalization"
        />
      )}
    </g>
  );
};

export default GeneralizationEdge;
