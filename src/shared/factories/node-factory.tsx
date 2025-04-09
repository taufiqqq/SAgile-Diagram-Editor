// features/diagram-editing/factories/node-factory.ts
import {ReactNode} from 'react';
import { UseCaseHtml } from '../../features/diagram-editing/utils/shapes-html/UseCase-html';
import { ActorHtml } from '../../features/diagram-editing/utils/shapes-html/Actor-html';

type NodeType = 'usecase'  | 'actor';

interface NodeConfig {
  type: NodeType;
  displayName: string;
  html: ReactNode;
  width: number;
  height: number;
}

export const createNodeFactory = () => {
  const nodeTypes: Record<NodeType, NodeConfig> = {
    usecase: {
      type: 'usecase',
      displayName: 'Use Case',
      html: <UseCaseHtml hidePlaceholder={true}/>,
      width: 150,
      height: 100,
      
    },
    actor: {
      type: 'actor',
      displayName: "Actor",
      html: <ActorHtml label={""} selected={false} hidePlaceholder={true} />,
      width: 150,
      height: 100,
    },
    
    // Add more node types here
  };

  const getNodeConfig = (type: NodeType): NodeConfig => {
    return nodeTypes[type];
  };

  const createDraggableNode = (
    type: NodeType, 
    onDragStart: (event: React.DragEvent, nodeType: string) => void,
    customHtml?: React.ReactNode
  ) => {
    const config = getNodeConfig(type);
    
    return (
      <div
        className="dndnode"
        draggable
        onDragStart={(event) => onDragStart(event, type)}
        style={{
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '5px',
          backgroundColor: 'white',
          cursor: 'grab',
          width: '150px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '5px'
        }}
      >
        <div className="node-content" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {customHtml || config.html}
          <div style={{ fontSize: '12px', color: '#666' }}>{config.displayName}</div>
        </div>
      </div>
    );
  };

  return {
    getNodeConfig,
    createDraggableNode,
    registerNewNodeType: (config: NodeConfig) => {
      nodeTypes[config.type] = config;
    }
  };
};

// Export a singleton instance
export const nodeFactory = createNodeFactory();