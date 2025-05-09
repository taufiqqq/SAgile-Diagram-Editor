import React from 'react';
import { Handle, Position, useReactFlow, NodeToolbar } from '@xyflow/react';
import { ShapeNodeData } from '../types/NodeTypes.types';
import { ActorHtml } from '../utils/shapes-html/Actor-html';
import { UseCaseHtml } from '../utils/shapes-html/UseCase-html';
import { useModal } from '../../../shared/context/ModalContext';

interface UseCaseShapeNodeProps {
  id: string;
  data: ShapeNodeData;
  selected?: boolean;
  isConnectable?: boolean;
}

const UseCaseShapeNode: React.FC<UseCaseShapeNodeProps> = ({ data, selected = false, isConnectable = true, id }) => {
  const { setNodes } = useReactFlow();
  const { openModal } = useModal();

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
      <NodeToolbar position={Position.Top} align="end">
        <button
          onClick={() => openModal({ type: data.type, label: data.label, id })}
          style={{
            border: 'none',
            background: '#000000',
            cursor: 'pointer',
            padding: '4px 8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '4px',
            color: 'white',
            fontSize: '12px',
            fontWeight: '500'
          }}
        >
          Edit
        </button>
      </NodeToolbar>
      
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

export default UseCaseShapeNode; 