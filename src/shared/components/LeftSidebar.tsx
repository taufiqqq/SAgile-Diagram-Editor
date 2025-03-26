import React from 'react';
import { useDnD } from '../../features/diagram-editing/hooks/useDnD';
import { nodeFactory } from '../factories/node-factory';


const Sidebar: React.FC = () => {
  const [_, setType] = useDnD(); // Get the setType function from the context

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    setType(nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (

    <div className="leftsidebar" style={{ padding: '10px' }}>
      <div
        className="dndnode"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 15,
          margin: 0,
          width: 'fit-content',
          height: 'fit-content',
          flexWrap: 'wrap',
          maxWidth: '100%',
          boxSizing: 'border-box',
          cursor: 'grab',
          gap: '20px' // Add gap between items to prevent overlap
        }}
      >
        {nodeFactory.createDraggableNode('usecase', onDragStart)}
        {nodeFactory.createDraggableNode('actor', onDragStart)}
      </div>
    </div>
  );
};

export default Sidebar;