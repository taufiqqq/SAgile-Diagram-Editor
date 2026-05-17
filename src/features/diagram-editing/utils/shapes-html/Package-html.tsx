import React from "react";
import NodeLabel from "../shapes-react-flow/Label";

interface PackageHtmlProps {
  label: string;
  width?: number;
  height?: number;
  onLabelChange?: (newLabel: string) => void;
  hidePlaceholder?: boolean;
}

export const PackageHtml: React.FC<PackageHtmlProps> = ({
  label,
  width = 300,
  height = 200,
  onLabelChange,
  hidePlaceholder = false,
}) => {
  return (
    <div
      style={{
        position: "relative", // Ensure proper alignment with NodeResizer
        width,
        height,
        border: "2px solid black",
        boxSizing: "border-box",
        // borderRadius: "5px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        pointerEvents: "auto", // Allow interaction with the container
      }}
    >
      {/* Editable Label */}
      <NodeLabel
        placeholder="Package Name"
        value={label}
        onChange={onLabelChange} // Use the parent-provided callback
        hidePlaceholder={hidePlaceholder}
        style={{
          marginTop: "5px",
          fontSize: "12px",
          textAlign: "center",
        }}
      />

      {/* Separator Line */}
      <svg
        width="100%"
        height="100%"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          overflow: "visible",
          pointerEvents: "none", // Prevent the SVG from blocking clicks
        }}
      >
        <line
          x1="0"
          y1="30"
          x2="100%"
          y2="30"
          stroke="black"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
};