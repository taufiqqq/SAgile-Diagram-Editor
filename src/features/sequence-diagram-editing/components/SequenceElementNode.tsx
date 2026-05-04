import React from "react";
import { useReactFlow, useEdges, NodeToolbar, Position } from "@xyflow/react";
import { SequenceNodeData } from "../types/SequenceElementTypes";
import { SequenceActorHtml } from "../utils/shapes-html/SequenceActor-html";
import { SequenceBoundaryHtml } from "../utils/shapes-html/SequenceBoundary-html";
import { SequenceControlHtml } from "../utils/shapes-html/SequenceControl-html";
import { SequenceEntityHtml } from "../utils/shapes-html/SequenceEntity-html";

interface SequenceElementNodeProps {
  id: string;
  data: SequenceNodeData;
  selected?: boolean;
  isConnectable?: boolean;
}

const SequenceElementNode: React.FC<SequenceElementNodeProps> = ({
  data,
  selected = false,
  isConnectable = true,
  id,
}) => {
  const { setNodes } = useReactFlow();
  const edges = useEdges();

  // Compute lifeline length to always reach below the lowest connected message.
  // Nodes are locked at y=50; edge yPosition values are in canvas coords.
  const LOCKED_Y_POSITION = 50;
  const LIFELINE_PADDING = 80;
  const MIN_LIFELINE_LENGTH = data.lifelineLength ?? 400;

  // Use the global max yPosition across ALL edges so every lifeline has the same length
  const maxYPosition = edges.reduce((max, e) => {
    const y = (e.data?.yPosition as number) ?? 0;
    return y > max ? y : max;
  }, 0);

  const lifelineLength = maxYPosition > 0
    ? Math.max(MIN_LIFELINE_LENGTH, maxYPosition - LOCKED_Y_POSITION + LIFELINE_PADDING)
    : MIN_LIFELINE_LENGTH;

  const handleLabelChange = (newLabel: string) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              label: newLabel,
            },
          };
        }
        return node;
      })
    );
  };

  const renderShape = () => {
    const commonProps = {
      label: data.label,
      selected,
      onLabelChange: handleLabelChange,
      hasLifeline: data.hasLifeline,
      lifelineLength,
      isConnectable,
    };

    switch (data.elementType) {
      case "actor":
        return <SequenceActorHtml {...commonProps} />;
      case "boundary":
        return <SequenceBoundaryHtml {...commonProps} />;
      case "control":
        return <SequenceControlHtml {...commonProps} />;
      case "entity":
        return <SequenceEntityHtml {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <NodeToolbar position={Position.Top} align="end">
        <button
          onClick={() => {
            console.log("Edit sequence element:", id, data);
          }}
          style={{
            border: "none",
            background: "#000000",
            cursor: "pointer",
            padding: "4px 8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "4px",
            color: "white",
            fontSize: "12px",
            fontWeight: "500",
          }}
        >
          Edit
        </button>
      </NodeToolbar>

      {renderShape()}
    </div>
  );
};

export default SequenceElementNode;
