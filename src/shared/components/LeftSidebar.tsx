import React from "react";
import { useDnD } from "../../features/diagram-editing/hooks/useDnD";
import { nodeFactory } from "../factories/node-factory";
import { assertWithLog } from "../utils/assertWithLog";

const Sidebar: React.FC = () => {
  const [_, setType] = useDnD();

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    console.log(`Dragging node of type: ${nodeType}`); // Debugging log

    // Pre-condition: Ensure nodeType is a valid string
    assertWithLog(
      typeof nodeType === "string" && nodeType.length > 0,
      "Pre-condition failed: nodeType must be a non-empty string.",
      "Pre-condition passed: nodeType is valid."
    );

    setType(nodeType);
    event.dataTransfer.effectAllowed = "move";

    // Set data for the drag operation
    event.dataTransfer.setData("application/reactflow", nodeType);

    // Create a custom drag image
    const dragImage = document.createElement("div");
    dragImage.style.width = "150px";
    dragImage.style.height = "100px";
    dragImage.style.position = "absolute";
    dragImage.style.top = "-1000px";
    dragImage.style.left = "-1000px";
    dragImage.style.opacity = "0.8";
    dragImage.style.backgroundColor = "white";
    dragImage.style.border = "1px solid #ccc";
    dragImage.style.borderRadius = "5px";
    dragImage.style.padding = "10px";
    dragImage.style.display = "flex";
    dragImage.style.flexDirection = "column";
    dragImage.style.alignItems = "center";
    dragImage.style.justifyContent = "center";

    // Clone the actual node content
    const nodeContent = event.currentTarget.querySelector(".node-content");
    if (nodeContent) {
      const clone = nodeContent.cloneNode(true) as HTMLElement;
      dragImage.appendChild(clone);
    }

    document.body.appendChild(dragImage);
    event.dataTransfer.setDragImage(dragImage, 75, 50);

    // Post-condition: Ensure dragImage is added to the DOM
    assertWithLog(
      document.body.contains(dragImage),
      "Post-condition failed: dragImage must be added to the DOM.",
      "Post-condition passed: dragImage is in the DOM."
    );

    // Clean up the drag image after drag ends
    setTimeout(() => {
      document.body.removeChild(dragImage);
      assertWithLog(
        !document.body.contains(dragImage),
        "Post-condition failed: dragImage must be removed from the DOM.",
        "Post-condition passed: dragImage is removed from the DOM."
      );
    }, 0);
  };

  return (
    <div
      className="leftsidebar"
      style={{
        padding: "10px",
        backgroundColor: "#f5f5f5",
        borderRight: "1px solid #ddd",
        height: "100%",
        overflowY: "auto",
      }}
    >
      <h3 style={{ marginBottom: "15px", fontSize: "16px", color: "#333" }}>
        Diagram Elements
      </h3>
      <div
        className="dndnode"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "15px",
        }}
      >
        {nodeFactory.createDraggableNode("usecase", onDragStart)}
        {nodeFactory.createDraggableNode("actor", onDragStart)}
        {nodeFactory.createDraggableNode("package", onDragStart)}
      </div>
    </div>
  );
};

export default Sidebar;
