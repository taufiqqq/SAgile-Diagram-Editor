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
      displayName: 'usecase',
      html: <UseCaseHtml/>,
      width: 150,
      height: 100,
      
    },
    actor: {
      type: 'actor',
      displayName: "actor",
      html: <ActorHtml label={""} selected={false} />,
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
        onDragStart={(event) => onDragStart(event, type)}
        style={{
          width: config.width,
          height: config.height,
          position: 'relative'
        }}>
          {customHtml || config.html}
          <div style={{
            position: 'absolute',
            bottom: -20,
            width: '100%',
            color: 'black',
            fontSize: 12
          }}>
            {config.displayName}
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