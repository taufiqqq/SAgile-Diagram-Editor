// features/diagram-editing/factories/node-factory.ts
import {ReactNode} from 'react';
import { UseCaseHtml } from '../../features/diagram-editing/utils/shapes-html/UseCase-html';
import { ActorHtml } from '../../features/diagram-editing/utils/shapes-html/Actor-html';
import { PackageHtml } from '../../features/diagram-editing/utils/shapes-html/Package-html';

type DiagramElement = 'usecase'  | 'actor' | 'package' | string;

interface DiagramElementConfig {
  type: DiagramElement;
  displayName: string;
  html: ReactNode;
  width: number;
  height: number;
}

export const createNodeFactory = () => {
  const nodeTypes: Record<DiagramElement, DiagramElementConfig> = {
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
    package: {
      type: 'package',
      displayName: "Package",
      html: <PackageHtml label={''} width={100} height={100} hidePlaceholder={true}/>,
      width: 150,
      height: 100,
    },
    
    // Add more node types here
  };

  const getNodeConfig = (type: DiagramElement): DiagramElementConfig => {
    const config = nodeTypes[type];
    if (!config) {
      throw new Error(`Node type "${type}" is not defined in nodeTypes.`);
    }
    return config;
  };

  const createDraggableNode = (
    diagramElement: DiagramElement,
    shape: string,
    onDragStart: (event: React.DragEvent, diagramElementType: string, shapeType: string) => void,
    customHtml?: React.ReactNode
  ) => {
    const config = getNodeConfig(shape);
  
    return (
      <div
        className="dndnode"
        draggable
        onDragStart={(event) => onDragStart(event, diagramElement, shape )} // Pass both nodeType and shapeType
        style={{
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "5px",
          backgroundColor: "white",
          cursor: "grab",
          width: "150px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "5px",
        }}
      >
        <div
          className="node-content"
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {customHtml || config.html}
          <div style={{ fontSize: "12px", color: "#666" }}>{config.displayName}</div>
        </div>
      </div>
    );
  };

  return {
    getNodeConfig,
    createDraggableNode,
    registerNewNodeType: (config: DiagramElementConfig) => {
      nodeTypes[config.type] = config;
    }
  };
};

// Export a singleton instance
export const nodeFactory = createNodeFactory();