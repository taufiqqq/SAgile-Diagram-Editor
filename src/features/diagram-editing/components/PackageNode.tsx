import React from "react";
import { memo } from "react";
import { DiagramElementData } from "../types/DiagramElementType.types";
import { NodeResizer, useReactFlow } from "@xyflow/react";
import { useNodeDimensions } from "../hooks/useNodeDimensions";
import { PackageHtml } from "../utils/shapes-html/Package-html";

interface PackageNodeProps {
  id: string;
  data: DiagramElementData;
  selected?: boolean;
}

const PackageNode: React.FC<PackageNodeProps> = ({ id, data, selected = false }) => {
  const { setNodes } = useReactFlow();
  const defaultWidth = 300;
  const { width: measuredWidth, height: measuredHeight } = useNodeDimensions(id);

  // Use measured dimensions from React Flow, fallback to data properties, or defaults
  const width = measuredWidth || (data.width as number) || defaultWidth;
  const height = measuredHeight || (data.height as number) || 200;

  const handleLabelChange = (newLabel: string) => {
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, label: newLabel } } : node
      )
    );
  };

  return (
    <div
      style={{
        width,
        height,
        position: "relative", // Ensure proper alignment
        pointerEvents: "auto",
      }}
    >
      <NodeResizer
        color="#555"
        isVisible={selected}
        minWidth={200}
        minHeight={100}
      />

      <PackageHtml
        label={data.label}
        width={width}
        height={height}
        onLabelChange={handleLabelChange} // Pass the label change handler
      />
    </div>
  );
};

export default memo(PackageNode);