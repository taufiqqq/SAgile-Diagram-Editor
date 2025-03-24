import React from 'react';
import { useDnD } from '../../features/diagram-editing/components/DnDContext'; // Import the DnDContext hook

const Sidebar: React.FC = () => {
  const [_, setType] = useDnD(); // Get the setType function from the context

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    setType(nodeType); // Set the node type in the context
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="leftsidebar">
      <div
        className="dndnode"
        onDragStart={(event) => onDragStart(event, 'oval')}
        draggable
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 0, // Remove padding
          margin: 0, // Remove margin
          width: 'fit-content', // Ensure the width fits the content
          height: 'fit-content', // Ensure the height fits the content
        }}
      >
        <div
          className="oval-node"
          style={{
            width: 150,
            height: 100,
            borderRadius: '50%',
            background: '#f0f0f0',
            border: '2px solid #555',
          }}
        ></div>
      </div>
    </div>
  );
};

export default Sidebar;