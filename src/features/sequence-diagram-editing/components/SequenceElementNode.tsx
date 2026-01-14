import React from "react";
import { Handle, Position, useReactFlow, NodeToolbar } from "@xyflow/react";
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
      lifelineLength: data.lifelineLength,
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

  const handleStyle = {
    background: selected ? "red" : "#555",
    width: "8px",
    height: "8px",
    border: "1px solid #fff",
  };

  return (
    <div style={{ position: "relative" }}>
      <NodeToolbar position={Position.Top} align="end">
        <button
          onClick={() => {
            // TODO: Open modal for editing sequence element properties
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

      {/* Connection handles */}
      <Handle
        id="left"
        type="source"
        position={Position.Left}
        style={handleStyle}
        isConnectable={isConnectable}
      />
      <Handle
        id="top"
        type="source"
        position={Position.Top}
        style={handleStyle}
        isConnectable={isConnectable}
      />

      {renderShape()}

      <Handle
        id="right"
        type="source"
        position={Position.Right}
        style={handleStyle}
        isConnectable={isConnectable}
      />
      <Handle
        id="bottom"
        type="source"
        position={Position.Bottom}
        style={handleStyle}
        isConnectable={isConnectable}
      />
    </div>
  );
};

export default SequenceElementNode;
