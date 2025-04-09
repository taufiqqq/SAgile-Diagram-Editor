import React from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import { ShapeNode as ShapeNodeType } from '../types/NodeTypes.types';
import { ActorHtml } from '../utils/shapes-html/Actor-html';
import { UseCaseHtml } from '../utils/shapes-html/UseCase-html';

interface ShapeNodeProps {
  data: ShapeNodeType['data'];
  selected?: boolean;
  isConnectable?: boolean;
  id: string;
}

const ShapeNode: React.FC<ShapeNodeProps> = ({ data, selected = false, isConnectable = true, id }) => {
  const { setNodes } = useReactFlow();

  const handleLabelChange = (newLabel: string) => {
    setNodes((nodes) => 
      nodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              label: newLabel
            }
          };
        }
        return node;
      })
    );
  };

  const renderShape = () => {
    switch (data.type) {
      case 'actor':
        return <ActorHtml label={data.label} selected={selected} onLabelChange={handleLabelChange} />;
      case 'usecase':
        return <UseCaseHtml label={data.label} selected={selected} onLabelChange={handleLabelChange} />;
      default:
        return null;
    }
  };

  const handleStyle = {
    background: selected ? 'red' : '#555',
    width: '8px',
    height: '8px',
    border: '1px solid #fff'
  };

  return (
    <div style={{ position: 'relative' }}>
      <Handle
        id="left"
        type="source"
        position={Position.Left}
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
    </div>
  );
};

export default ShapeNode; 